def parse_payload(raw_payload):
    # normalize
    if hasattr(raw_payload, "to_dict"):
        raw = raw_payload.to_dict(flat=True)
    elif isinstance(raw_payload, dict):
        raw = dict(raw_payload)
    else:
        raw = dict(raw_payload)

    def first(*keys):
        for k in keys:
            v = raw.get(k)
            if isinstance(v, str):
                v = v.strip()
            if v not in (None, "", []):
                return v
        return None

    def clean(d):
        return {k: v for k, v in d.items() if v not in (None, "", [])}

    office = clean({
        "building_id": first("building_id"),
        "name":        first("office_name", "name"),
        "room_number": first("room_number"),
        "floor":       first("floor"),
        "description": first("office_description", "description"),
        "website":     first("office_website", "website"),
    })

    contact = clean({
        "name":    first("contact_name", "name"),
        "email":   first("contact_email", "email"),
        "phone":   first("contact_phone", "phone"),
        "role":    first("contact_role"),
        "website": first("contact_website"),
    })

    return office, contact
