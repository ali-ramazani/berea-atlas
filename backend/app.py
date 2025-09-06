from flask import Flask, request, jsonify, render_template

app = Flask(__name__, template_folder='pages')

@app.errorhandler(404)
def page_not_found(e):
    return "Sorry, Not found"

@app.route('/admin/office/new', methods=['GET', 'POST'])
def add_office():
    if request.method == 'GET':
        return render_template('office_form.html'), 200

    form = request.form


    # Building Information
    building_name = form.get('building_name')

    # Office Information
    office_name = form.get('office_name')
    room_number = form.get('room_number')
    floor = form.get('floor')
    office_website = form.get('office_website')
    office_description = form.get('office_description')

    # Contact Information
    contact_name = form.get('contact_name')
    contact_role = form.get('contact_role')
    contact_email = form.get('contact_email')
    contact_phone = form.get('contact_phone')
    contact_website = form.get('contact_website')



    return jsonify({"building_name": building_name, "office_name": office_name,
                    "room_number": room_number, "floor": floor,
                    "office_website": office_website, "office_description": office_description,
                    "contact_name": contact_name, "contact_role": contact_role,
                    "contact_email": contact_email, "contact_phone": contact_phone,
                    "contact_website": contact_website}), 200