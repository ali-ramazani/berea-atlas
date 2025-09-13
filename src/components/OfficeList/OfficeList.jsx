import  { useMemo, useState } from "react";
import PropTypes from "prop-types";

export default function OfficeList({ offices, onSelect }) {
  const [q, setQ] = useState("");

  console.log(offices)

  const rows = useMemo(() => {
    const needle = q.toLowerCase();
    return (offices ?? [])
      .filter(o =>
        [
          o.name,
          o.building_name,
          o.room_number,
          o.floor,
          o.office_description,
          o.building_address,
        ]
          .map(v => String(v ?? "").toLowerCase())
          .some(s => s.includes(needle))
      )
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [offices, q]);

  return (
    <div className="office-list">
      <input
        className="search-bar"
        placeholder="Search offices or buildings..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search offices"
      />
      {rows.length ? (
        <ul className="list">
          {rows.map((o) => (
            <li
              key={`${o.name}-${o.room_number ?? ""}-${o.building_name}`}
              className="list-item"
              role="button"
              tabIndex={0}
              onClick={() => onSelect(o)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(o)}
              title="Show on map"
            >
              <strong>{o.name}</strong><br />
              <i>{o.building_name} - {o.building_address}</i>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-results">No offices match your search.</p>
      )}
    </div>
  );
}

OfficeList.propTypes = {
  offices: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
