# logic/buildings.py
from decimal import Decimal
from backend.models.models import Building

TABLE = "public.building"

ALLOWED_FIELDS = {
    "building_id", "name", "description", "latitude", "longitude",
    "created_at", "updated_at"
}

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

def get_buildings():
    buildings = Building.select().order_by(Building.name)
    return [_jsonify_row(b.__data__) for b in buildings]