import psycopg2
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

from backend.database import get_db_connection
from backend.logic.buildings import list_buildings, get_building

app = Flask(__name__, template_folder='pages')

@app.errorhandler(404)
def page_not_found(e):
    return "Sorry, Not found"


@app.route('/admin/building/new', methods=['GET', 'POST'])
def add_building():
    if request.method == 'GET':
        return render_template('building_form.html'), 200

    form = request.form
    name = form.get('name')
    description = form.get('description')
    latitude = form.get('latitude')
    longitude = form.get('longitude')

    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("""
                            INSERT INTO building (name, description, latitude, longitude)
                            VALUES (%s, %s, %s, %s) RETURNING building_id;
                            """, (name, description, latitude, longitude))
                new_id = cur.fetchone()['building_id']
    except psycopg2.Error as e:
        return jsonify({"ok": False, "error": str(e)}), 400
    finally:
        conn.close()

    return jsonify({"name": name, "description": description,
                    "latitude": latitude, "longitude": longitude}), 200

import psycopg2
from psycopg2 import errors
from flask import render_template, request, jsonify
# from backend.logic.buildings import list_buildings
# from backend.database import get_db_connection

@app.route('/admin/office/new', methods=['GET', 'POST'])
def add_office():
    if request.method == 'GET':
        # only fetch what you need for the dropdown
        buildings = list_buildings(fields=["building_id", "name"])
        return render_template('office_form.html', buildings=buildings), 200

    form = request.form

    def _none(v):
        v = (v or "").strip()
        return v or None

    building_id = form.get('building_id', type=int)
    building_name = _none(form.get('building_name'))  # fallback support only

    if not building_id and building_name:
        conn_lookup = get_db_connection()
        try:
            with conn_lookup.cursor() as cur:
                cur.execute("SELECT building_id FROM public.building WHERE name = %s;", (building_name,))
                row = cur.fetchone()
                building_id = row['building_id'] if row else None
        finally:
            conn_lookup.close()

    # Office fields
    office_name        = _none(form.get('office_name'))
    room_number        = _none(form.get('room_number'))
    floor              = _none(form.get('floor'))
    office_website     = _none(form.get('office_website'))
    office_description = _none(form.get('office_description'))

    if not building_id or not office_name:
        return jsonify({"ok": False, "error": "building_id and office_name are required"}), 400

    contact_name    = _none(form.get('contact_name'))
    contact_role    = _none(form.get('contact_role'))
    contact_email   = _none(form.get('contact_email'))
    contact_phone   = _none(form.get('contact_phone'))
    contact_website = _none(form.get('contact_website'))

    conn = get_db_connection()
    try:
        with conn:  # transaction; commits on success, rolls back on exception
            with conn.cursor() as cur:
                # Insert office
                cur.execute("""
                    INSERT INTO public.office
                      (building_id, name, room_number, floor, website, description)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING office_id;
                """, (building_id, office_name, room_number, floor, office_website, office_description))
                office_id = cur.fetchone()['office_id']

                contact_id = None
                if any([contact_name, contact_role, contact_email, contact_phone, contact_website]):
                    cur.execute("""
                        INSERT INTO public.contact
                          (office_id, name, role, email, phone, website)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING contact_id;
                    """, (office_id, contact_name, contact_role, contact_email, contact_phone, contact_website))
                    contact_id = cur.fetchone()['contact_id']

        return jsonify({"ok": True, "office_id": office_id, "contact_id": contact_id}), 201

    except errors.ForeignKeyViolation:
        return jsonify({"ok": False, "error": "Invalid building_id (foreign key)"}), 400
    except errors.UniqueViolation:
        return jsonify({"ok": False, "error": "Office name already exists for this building"}), 409
    except psycopg2.Error as e:
        return jsonify({"ok": False, "error": str(e)}), 400
    finally:
        conn.close()
