import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import ProfessorList from './components/ProfessorList';
import professorsData from '../offices.json';
import buildingCoordinates from '../buildings.json'; // Load JSON for building coordinates
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const handleProfessorSelect = (professor) => {
    setSelectedProfessor(professor);
  };

  const handleReset = () => {
    setSelectedProfessor(null);
  };

  return (
    <div className="app-container">
      <div className="navigation-overlay">
        {/* Textual Header */}
        <header className="app-header">
          <h1 className="app-title">Berea Atlas</h1>
        </header>

        {selectedProfessor ? (
          <div className="professor-details">
            <h2>{selectedProfessor.name}</h2>
            <p><strong>Department:</strong> {selectedProfessor.department}</p>
            <p><strong>Office:</strong> {selectedProfessor.office}</p>
            <p><strong>Building:</strong> {selectedProfessor.building}</p>
            <p><strong>Email:</strong> <a href={`mailto:${selectedProfessor.email}`}>{selectedProfessor.email}</a></p>
            <p><strong>Office Hours:</strong> {selectedProfessor.office_hours}</p>
            <p><strong>Class Schedule:</strong> {selectedProfessor.class_schedule ? selectedProfessor.class_schedule.join(', ') : 'N/A'}</p>
            {selectedProfessor.profile_picture && (
              <img
                src={selectedProfessor.profile_picture}
                alt={`${selectedProfessor.name}'s profile`}
                className="professor-photo"
              />
            )}
            <button onClick={handleReset}>Back to List</button>
          </div>
        ) : (
          <ProfessorList
            professors={professorsData}
            onProfessorSelect={handleProfessorSelect}
          />
        )}
      </div>
      <div className="map-container">
        <Map
          selectedProfessor={selectedProfessor}
          buildingCoordinates={buildingCoordinates}
        />
      </div>
    </div>
  );
}

export default App;
