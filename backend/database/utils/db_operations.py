from backend.database.db_config import ps_db
from peewee import IntegrityError
from backend.models.models import Office, Building, Contact

def insert_contact(data: dict) -> str:
    ps_db.connect(reuse_if_open=True)
    try:
        with ps_db.atomic():
            contact = Contact.create(**data)
            cid = str(contact.contact_id)
            print(f"✅ Inserted contact {cid}")
            return cid
    except IntegrityError as e:
        print(f"⚠️ Insert contact failed: {e}")
        raise
    finally:
        if not ps_db.is_closed():
            ps_db.close()

def insert_office(data: dict, *, contact_id: str | None = None) -> str:
    row = dict(data)
    building_id = row.pop("building_id")
    if contact_id:
        row["contact"] = contact_id  # FK field name

    ps_db.connect(reuse_if_open=True)
    try:
        with ps_db.atomic():
            office = Office.create(building=building_id, **row)
            return str(office.office_id)
    finally:
        if not ps_db.is_closed():
            ps_db.close()

