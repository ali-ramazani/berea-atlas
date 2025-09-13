import PropTypes from "prop-types";
import {withHttp, pick} from '../../utils/utils.js'


export default function OfficeDetails({ office, onBack }) {
  // Office core
  const officeName = pick(office, "office_name", "name") || "Office";
  const officeDesc = pick(office, "office_description", "description");
  const officeWebsite = withHttp(pick(office, "office_website", "website"));

  // Building
  const buildingName = pick(office, "building_name");
  const buildingAddress = pick(office, "building_address");

  // Office
  const room = pick(office, "room_number");
  const floor = pick(office, "floor");

  // Contacts
  let contacts = Array.isArray(office.contacts) ? office.contacts : null;
  if (!contacts) {
    const anyFlat =
      office.contact_name || office.contact_email || office.contact_phone || office.contact_role || office.contact_website;
    if (anyFlat) {
      contacts = [
        {
          contact_id: office.contact_id,
          name: office.contact_name,
          email: office.contact_email,
          phone: office.contact_phone,
          role: office.contact_role,
          website: office.contact_website,
        },
      ];
    }
  }

  return (
    <div className="office-details card">
      <div className="office-header">
        <h2 className="office-title">{officeName}</h2>
        {officeWebsite && (
          <a className="btn-link" href={officeWebsite} target="_blank" rel="noreferrer">
            Visit site ↗
          </a>
        )}
      </div>

      <div className="meta-grid">
        {buildingName && (
          <div className="meta-row">
            <span className="label">Building</span>
            <span className="value">{buildingName}</span>
          </div>
        )}
        {buildingAddress && (
          <div className="meta-row">
            <span className="label">Address</span>
            <span className="value">{buildingAddress}</span>
          </div>
        )}
        {room && (
          <div className="meta-row">
            <span className="label">Room</span>
            <span className="value">{room}</span>
          </div>
        )}
        {floor && (
          <div className="meta-row">
            <span className="label">Floor</span>
            <span className="value">{floor}</span>
          </div>
        )}
      </div>

      {officeDesc && <p className="muted">{officeDesc}</p>}

      <div className="section">
        <h3 className="section-title">Contacts</h3>
        {contacts?.length ? (
          <ul className="contact-list">
            {contacts.map((c) => {
              const site = withHttp(c?.website);
              return (
                <li key={c?.contact_id ?? c?.email ?? c?.name} className="contact-item">
                  <div className="contact-name">
                    <strong>{c?.name || "Unnamed"}</strong>
                    {c?.role ? <span className="role"> — {c.role}</span> : null}
                  </div>
                  <div className="contact-meta">
                    {c?.email && (
                      <a className="chip" href={`mailto:${c.email}`}>
                        {c.email}
                      </a>
                    )}
                    {c?.phone && <span className="chip">{c.phone}</span>}
                    {site && (
                      <a className="chip" href={site} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted">No contacts listed.</p>
        )}
      </div>

      <button onClick={onBack} className="back-button">Back to List</button>
    </div>
  );
}

OfficeDetails.propTypes = {
  office: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};
