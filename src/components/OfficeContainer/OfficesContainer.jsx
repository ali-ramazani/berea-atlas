// src/components/OfficeContainer/OfficeContainer.jsx
import  { useState } from "react";
import PropTypes from "prop-types";
import useOffices from "../../hooks/useOffice.js";
import OfficeList from "../OfficeList/OfficeList.jsx";
import OfficeDetails from "../OfficeDetails/OfficeDetails.jsx";

export default function OfficeContainer({ onOfficeSelectForMap }) {
  const { offices, loading, error } = useOffices();
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleSelect = (office) => {
    setSelectedOffice(office);
    onOfficeSelectForMap?.(office); // notify parent for map fly-to
  };

  const handleReset = () => {
    setSelectedOffice(null);
    onOfficeSelectForMap?.(null);
  };

  if (loading) return <div className="office-container loading">Loading offices…</div>;
  if (error)   return <div className="office-container error">Error: {error}</div>;

  return (
    <div className="office-container">
      {selectedOffice ? (
        <OfficeDetails office={selectedOffice} onBack={handleReset} />
      ) : (
        <OfficeList offices={offices} onSelect={handleSelect} />
      )}
    </div>
  );
}

OfficeContainer.propTypes = {
  onOfficeSelectForMap: PropTypes.func,
};
