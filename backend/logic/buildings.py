# logic/buildings.py
from decimal import Decimal
from typing import Iterable, Optional
from backend.database import get_db_connection

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

def list_buildings(fields: Optional[Iterable[str]] = None):
    cols = ALLOWED_FIELDS if not fields else (set(fields) & ALLOWED_FIELDS)
    if not cols:
        cols = {"building_id", "name"}
    col_sql = ", ".join(sorted(cols))
    sql = f"SELECT {col_sql} FROM {TABLE} ORDER BY name;"
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
            return [_jsonify_row(r) for r in rows]
    finally:
        conn.close()

# logic/buildings.py
def get_building(building_id: int):
    sql = f"""SELECT building_id, name, description, latitude, longitude,
                     created_at, updated_at
              FROM {TABLE} WHERE building_id = %s;"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (building_id,))
            row = cur.fetchone()
            return _jsonify_row(row) if row else None
    finally:
        conn.close()