import uuid
from backend.database.db_config import ps_db
from backend.models.models import Building, Contact, Office, Admin
from peewee import IntegrityError
from backend.Logger import get_logger



building_uuids = [uuid.uuid4() for _ in range(15)]
office_uuids = [uuid.uuid4() for _ in range(15)]
contact_uuids = [uuid.uuid4() for _ in range(15)]

buildings = [
    {"building_id": building_uuids[0], "name": "CMIT Building", "address": "101 Chestnut Street", "description": "", "latitude": 37.57292195128939, "longitude": -84.29074074279187, "accessibility_info": ""},
    {"building_id": building_uuids[1], "name": "Arts Center", "address": "102 Chesssstnut Street", "description": "", "latitude": 37.5733333, "longitude": -84.2888889, "accessibility_info": ""},
    {"building_id": building_uuids[2], "name": "Draper Hall", "address": "103 Chestnut Street", "description": "", "latitude": 37.573027141828966, "longitude": -84.29228072169963, "accessibility_info": ""},
    {"building_id": building_uuids[3], "name": "Natural Sciences Building", "address": "104 Chesntut Street", "description": "", "latitude": 37.57483224024733, "longitude": -84.28918852406122, "accessibility_info": ""},
    {"building_id": building_uuids[4], "name": "Danforth Industrial Arts Building", "address": "105 Chestnut Street", "description": "", "latitude": 37.57395248203487, "longitude": -84.28921936269758, "accessibility_info": ""},
    {"building_id": building_uuids[5], "name": "Seabury Center", "address": "106 Chestnut Street", "description": "", "latitude": 37.574041098123956, "longitude": -84.29076200127025, "accessibility_info": ""},
    {"building_id": building_uuids[6], "name": "Presser Hall", "address": "107 Chestnut Street", "description": "", "latitude": 37.57009445815573, "longitude": -84.29195110688627, "accessibility_info": ""},
    {"building_id": building_uuids[7], "name": "Frost Building", "address": "108 Chestnut Street", "description": "", "latitude": 37.571758053571685, "longitude": -84.29134332214507, "accessibility_info": ""},
    {"building_id": building_uuids[8], "name": "Goldthwait Agricultural Building", "address": "109 Chestnut Street", "description": "", "latitude": 0.0, "longitude": 0.0, "accessibility_info": ""},
    {"building_id": building_uuids[9], "name": "Ross Jelkyl Drama Center", "address": "110 Chestnut Street", "description": "", "latitude": 37.573774763655635, "longitude": 84.29262113589267, "accessibility_info": ""},
    {"building_id": building_uuids[10], "name": "Rogers-Traylor Art Building", "address": "111 Chestnut Street", "description": "", "latitude": 37.5737644308301, "longitude": -84.2925968145063, "accessibility_info": ""},
    {"building_id": building_uuids[11], "name": "Knapp Hall", "address": "112 Chestnut Street", "description": "", "latitude": 37.569762149096306, "longitude": -84.290952, "accessibility_info": ""},
    {"building_id": building_uuids[12], "name": "Lincoln Hall", "address": "113 Chestnut Street", "description": "", "latitude": 37.571944, "longitude": -84.290556, "accessibility_info": ""},
    {"building_id": building_uuids[13], "name": "Harrison-McLain Home Management House", "address": "114 Chestnut Street", "description": "", "latitude": 0.0, "longitude": 0.0, "accessibility_info": ""},
    {"building_id": building_uuids[14], "name": "Phelps Stokes Chapel", "address": "115 Chestnut Street", "description": "", "latitude": 0.0, "longitude": 0.0, "accessibility_info": ""},
]
contacts = [
    {
        "contact_id": contact_uuids[0],
        "name": "Dr. Pearce",
        "role": "Professor of Computer Science",
        "email": "janpearce@berea.edu",
        "phone": "",
        "website": "",
    },
    {
        "contact_id": contact_uuids[1],
        "name": "Dr. Hines",
        "role": "Professor of Mathematics",
        "email": "hines@berea.edu",
        "phone": "",
        "website": "www.berea.edu/academics/faculty/hines",
    },
    {
        "contact_id": contact_uuids[2],
        "name": "Amanda White",
        "role": "Student Accounts Manager",
        "email": "whiltea@berea.edu",
        "phone": "8599795669",
        "website": "amanda@edu.com"
    }
]


offices = [
    {"office_id": office_uuids[0], "building_id": building_uuids[0], "contact_id": contact_uuids[0], "name": "Dr. Pearce Office", "room_number": "301", "floor": "3", "description": "", "website": "www.ali-ramazani.com"},
    {"office_id": office_uuids[1], "building_id": building_uuids[11], "contact_id": contact_uuids[1], "name": "Art Department Office", "room_number": "210", "floor": "2", "description": "", "website": ""},
    {"office_id": office_uuids[2], "building_id": building_uuids[12], "contact_id": contact_uuids[2], "name": "Student Accounts", "room_number": "101", "floor": "1", "description": "Serving student accounts", "website": "www.studentacounts.com"},
]

SUPERADMIN_EMAIL = "admin@berea.edu"
SUPERADMIN_PASSWORD = "admin"

def seed_super_admin():
    existing = Admin.get_or_none(Admin.email == SUPERADMIN_EMAIL.lower())
    if existing:
        logger.info("ℹ️ Super admin already exists.")
        return existing

    try:
        admin = Admin.create(
            email=SUPERADMIN_EMAIL.lower(),
            password_hash=SUPERADMIN_PASSWORD,  # ✅ plain text for now
            is_active=True,
            created_by=None
        )
        logger.info(f"✅ Seeded super admin: {admin.email}")
        return admin
    except IntegrityError as e:
        logger.error(f"⚠️ Could not insert super admin: {e}")


logger = get_logger()

def main():
    ps_db.connect(reuse_if_open=True)
    try:
        Building.insert_many(buildings).execute()
        logger.info(f"✅ Inserted {len(buildings)} buildings.")
        Contact.insert_many(contacts).execute()
        logger.info(f"✅ Inserted {len(contacts)} contacts.")
        Office.insert_many(offices).execute()
        logger.info(f"✅ Inserted {len(offices)} offices.")
        seed_super_admin()
    except IntegrityError as e:
        logger.error(f"⚠️ Insert failed: {e}")
    finally:
        if not ps_db.is_closed():
            ps_db.close()

if __name__ == "__main__":
    main()
