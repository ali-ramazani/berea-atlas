from flask import Flask, request, jsonify, render_template, Blueprint, abort, redirect, url_for
from dotenv import load_dotenv
from flask_cors import CORS
from flask_login import (
    LoginManager, login_user, logout_user, login_required, current_user
)
from backend.models.models import Office, Contact, Admin
from backend.logic.offices import get_offices
from backend.logic.buildings import get_buildings
from backend.utils.payload_parser import parse_payload
from backend.database.utils.db_operations import insert_office, insert_contact
import os

# -------------------- App setup --------------------
load_dotenv()

app = Flask(__name__, template_folder='pages', static_folder='backend/static')
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-only-change-me")  # replace in .env

# CORS (keep permissive for now; restrict later)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---- Flask-Login wiring ----
login_manager = LoginManager(app)
login_manager.login_view = "login_page"   # GET login page endpoint name

@login_manager.user_loader
def load_user(admin_id):
    try:
        return Admin.get_by_id(int(admin_id))
    except Admin.DoesNotExist:
        return None

# Peewee model needs these attributes for Flask-Login
Admin.is_authenticated = property(lambda self: True)
Admin.is_anonymous = property(lambda self: False)
Admin.get_id = lambda self: str(self.id)

# ---- admin-only decorator ----
def admin_required(fn):
    from functools import wraps
    @wraps(fn)
    @login_required
    def wrapper(*args, **kwargs):
        if not getattr(current_user, "is_active", True):
            abort(403)
        return fn(*args, **kwargs)
    return wrapper

# -------------------- Unauthorized handling --------------------
@login_manager.unauthorized_handler
def handle_unauthorized():
    # If an API call is unauthenticated, return JSON; otherwise redirect to login
    if request.path.startswith("/api/"):
        return jsonify({"ok": False, "error": "Login required"}), 401
    return redirect(url_for("login_page", next=request.full_path), 302)

# -------------------- Basic pages --------------------
@app.get("/")
def index():
    return redirect(url_for("login_page"))

@app.get("/login")
def login_page():
    return render_template("login.html"), 200

@app.get("/admin/home")
@admin_required
def admin_home():
    return render_template("admin_home.html", admin_email=current_user.email), 200

# -------------------- Auth endpoints --------------------
@app.post("/auth/login")
def auth_login():
    """
    Body: { "email": "...", "password": "..." }
    For now compares plaintext (simple dev mode).
    """
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    pwd = data.get("password") or ""

    admin = Admin.get_or_none(Admin.email == email)
    if not admin or admin.password_hash != pwd:
        return jsonify({"ok": False, "error": "Invalid credentials"}), 401
    if not admin.is_active:
        return jsonify({"ok": False, "error": "Account disabled"}), 403

    login_user(admin, remember=False, fresh=True)
    return jsonify({"ok": True, "admin_id": admin.id, "email": admin.email}), 200

@app.post("/auth/logout")
def auth_logout():
    logout_user()
    return jsonify({"ok": True}), 200

@app.get("/auth/me")
@login_required
def auth_me():
    return jsonify({"ok": True, "admin_id": current_user.id, "email": current_user.email})

# -------------------- API: Offices --------------------
offices_bp = Blueprint("offices_api", __name__, url_prefix="/api/offices")

@offices_bp.get("/")
def api_list_buildings():
    # public
    data = get_offices()
    return jsonify(data), 200

@offices_bp.route("/register", methods=["GET", "POST"])
@admin_required
def register_office():
    if request.method == "GET":
        buildings = get_buildings()
        return render_template("office_form.html", buildings=buildings), 200

    payload = request.get_json(silent=True) or request.form
    office_rec, contact_rec = parse_payload(payload)

    # validate office
    required = ["building_id", "name", "room_number", "floor"]
    missing = [k for k in required if not office_rec.get(k)]
    if missing:
        return jsonify({"ok": False, "error": f"Missing fields: {', '.join(missing)}"}), 400

    contact_id = None
    if contact_rec:
        must = ["name", "email", "role"]
        if all(contact_rec.get(k) for k in must):
            contact_id = insert_contact(contact_rec)

    office_id = insert_office(office_rec, contact_id=contact_id)
    return jsonify({"ok": True, "office_id": office_id, "contact_id": contact_id}), 201

app.register_blueprint(offices_bp)

# -------------------- Admin: Building form --------------------
@app.route("/admin/building/new", methods=["GET", "POST"])
@admin_required
def add_building():
    if request.method == "GET":
        return render_template("building_form.html"), 200
    form = request.form
    return jsonify({
        "name": form.get("name"),
        "description": form.get("description"),
        "latitude": form.get("latitude"),
        "longitude": form.get("longitude"),
    }), 200

# -------------------- Errors --------------------
@app.errorhandler(404)
def page_not_found(e):
    return "Sorry, Not found", 404


if __name__ == "__main__":
    app.run(debug=True)
