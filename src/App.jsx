// src/App.jsx
import  { useState} from 'react';
import './styles/App.css';
import Header from './components/Header/Header';
import OfficeContainer from './components/OfficeContainer/OfficesContainer.jsx';
import Map from './components/Map/Map';

function App() {
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleOfficeSelect = (office) => setSelectedOffice(office);

  return (
    <div className="app-container">
      <div className="navigation-overlay">
        <Header />
        <OfficeContainer
            onOfficeSelectForMap={handleOfficeSelect}
        />
      </div>
      <div className="map-container">
    <Map selectedOffice={selectedOffice}   />
      </div>
    </div>
  );
}

export default App;
