from flask import Flask, request, jsonify, render_template, Blueprint
from dotenv import load_dotenv
from flask_cors import CORS
from backend.models.models import Office, Contact
from backend.logic.offices import get_offices
from backend.logic.buildings import get_buildings
from backend.utils.payload_parser import parse_payload
from backend.database.utils.db_operations import insert_office, insert_contact

load_dotenv()

app = Flask(__name__, template_folder='pages')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---------- API: Buildings ----------
offices_bp = Blueprint('offices_api', __name__, url_prefix='/api/offices')

@offices_bp.get('/')
def api_list_buildings():
    data = get_offices()
    return jsonify(data), 200


@offices_bp.route('/register', methods=['GET', 'POST'])
def register_office():
    if request.method == 'GET':
        buildings = get_buildings()
        return render_template('office_form.html', buildings=buildings), 200

    payload = request.get_json(silent=True) or request.form
    office_rec, contact_rec = parse_payload(payload)

    # validate office
    required = ["building_id", "name", "room_number", "floor"]
    missing = [k for k in required if not office_rec.get(k)]
    if missing:
        return jsonify({"ok": False, "error": f"Missing fields: {', '.join(missing)}"}), 400

    contact_id = None
    if contact_rec:
        must = ["name", "email", "role"]  # <-- FIX: not "contact"
        if all(contact_rec.get(k) for k in must):
            contact_id = insert_contact(contact_rec)

    office_id = insert_office(office_rec, contact_id=contact_id)
    return jsonify({"ok": True, "office_id": office_id, "contact_id": contact_id}), 201




app.register_blueprint(offices_bp)

# ---------- HTML routes ----------
@app.errorhandler(404)
def page_not_found(e):
    return "Sorry, Not found", 404

@app.route('/admin/building/new', methods=['GET', 'POST'])
def add_building():
    if request.method == 'GET':
        return render_template('building_form.html'), 200
    form = request.form
    return jsonify({
        "name": form.get('name'),
        "description": form.get('description'),
        "latitude": form.get('latitude'),
        "longitude": form.get('longitude'),
    }), 200

# @app.route('/admin/office/new', methods=['GET', 'POST'])
# def add_office():
#     if request.method == 'GET':
#         buildings = get_buildings()
#         return render_template('office_form.html', buildings=buildings), 200
#     return jsonify({"ok": True}), 201
