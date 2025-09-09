import uuid
from backend.database.db_config import ps_db
from backend.models.models import Building
from peewee import IntegrityError

uuids = [uuid.uuid4() for _ in range(15)]

buildings = [
    {"building_id": uuids[0],  "name": "CMIT Building",                          "address": "101 Chestnut", "description": "", "latitude": 37.57292195128939, "longitude": -84.29074074279187, "accessibility_info": ""},
    {"building_id": uuids[1],  "name": "Arts Center",                            "address": "102 Chestnut", "description": "", "latitude": 37.5733333,        "longitude": -84.2888889,        "accessibility_info": ""},
    {"building_id": uuids[2],  "name": "Draper Hall",                            "address": "103 Chestnut", "description": "", "latitude": 37.573027141828966,"longitude": -84.29228072169963,  "accessibility_info": ""},
    {"building_id": uuids[3],  "name": "Natural Sciences Building",              "address": "104 Chesntut", "description": "", "latitude": 37.57483224024733, "longitude": -84.28918852406122,  "accessibility_info": ""},
    {"building_id": uuids[4],  "name": "Danforth Industrial Arts Building",      "address": "105 Chestnut", "description": "", "latitude": 37.57395248203487, "longitude": -84.28921936269758,  "accessibility_info": ""},
    {"building_id": uuids[5],  "name": "Seabury Center",                         "address": "106 Chestnut", "description": "", "latitude": 37.574041098123956,"longitude": -84.29076200127025,  "accessibility_info": ""},
    {"building_id": uuids[6],  "name": "Presser Hall",                           "address": "107 Chestnut", "description": "", "latitude": 37.57009445815573, "longitude": -84.29195110688627,  "accessibility_info": ""},
    {"building_id": uuids[7],  "name": "Frost Building",                         "address": "108 Chestnut", "description": "", "latitude": 37.571758053571685,"longitude": -84.29134332214507,  "accessibility_info": ""},
    {"building_id": uuids[8],  "name": "Goldthwait Agricultural Building",       "address": "109 Chestnut", "description": "", "latitude": 0.0,                "longitude": 0.0,                 "accessibility_info": ""},
    {"building_id": uuids[9],  "name": "Ross Jelkyl Drama Center",               "address": "110 Chestnut", "description": "", "latitude": 37.573774763655635,"longitude": 84.29262113589267,   "accessibility_info": ""},
    {"building_id": uuids[10], "name": "Rogers-Traylor Art Building",            "address": "111 Chestnut", "description": "", "latitude": 37.5737644308301,  "longitude": -84.2925968145063,   "accessibility_info": ""},
    {"building_id": uuids[11], "name": "Knapp Hall",                             "address": "112 Chestnut", "description": "", "latitude": 37.569762149096306,"longitude": -84.292845057283,    "accessibility_info": ""},
    {"building_id": uuids[12], "name": "Emery Building",                         "address": "113 Chestnut", "description": "", "latitude": 0.0,                "longitude": 0.0,                 "accessibility_info": ""},
    {"building_id": uuids[13], "name": "Harrison-McLain Home Management House",  "address": "114 Chestnut", "description": "", "latitude": 0.0,                "longitude": 0.0,                 "accessibility_info": ""},
    {"building_id": uuids[14], "name": "Phelps Stokes Chapel",                   "address": "115 Chestnut", "description": "", "latitude": 0.0,                "longitude": 0.0,                 "accessibility_info": ""},
]

def main():
    ps_db.connect(reuse_if_open=True)
    try:
        Building.insert_many(buildings).execute()
        print(f"✅ Inserted {len(buildings)} buildings.")
    except IntegrityError as e:
        print(f"⚠️ Insert failed: {e}")
    finally:
        if not ps_db.is_closed():
            ps_db.close()

if __name__ == "__main__":
    main()
