from decimal import Decimal
from backend.models.models import Office, Building, Contact

TABLE = "public.building"

# ALLOWED_FIELDS = {
#     "building_id", "name", "description", "latitude", "longitude",
#     "created_at", "updated_at"
# }

def _jsonify_row(row):
    """Convert psycopg2 DictRow -> plain dict with JSON-safe types."""
    out = {}
    for k, v in row.items():
        if isinstance(v, Decimal):
            out[k] = float(v)
        elif hasattr(v, "isoformat"):  # datetimes
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out

def get_offices():
    query = (
        Office
        .select(
            Office.name,
            Office.description,
            Office.room_number,
            Office.floor,
            Office.website,
            Building.name.alias('building_name'),
            Building.latitude.alias('building_latitude'),
            Building.longitude.alias('building_longitude'),
            Building.address.alias('building_address'),
            Building.accessibility_info.alias('building_accessibility_info'),
            Building.description.alias('building_description'),
            Contact.name.alias('contact_name'),
            Contact.email.alias('contact_email'),
            Contact.phone.alias('contact_phone'),
            Contact.role.alias('contact_role'),
            Contact.website.alias('contact_website'),
        )
        .join(Building)
        .switch(Office)
        .join(Contact)
        .order_by(Office.name)
        .dicts()
    )
    return list(query)
