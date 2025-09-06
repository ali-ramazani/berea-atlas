from flask import Flask, request, jsonify, render_template

app = Flask(__name__, template_folder='pages')

@app.route('/admin/office/new', methods=['GET', 'POST'])
def add_office():
    if request.method == 'GET':
        return render_template('office_form.html'), 200

    form = request.form


    office_name = form.get('office_name')
    room_number = form.get('room_number')
    floor = form.get('floor')
    office_website = form.get('office_website')

    return jsonify({office_name: office_name, room_number: room_number, floor: floor, }), 200