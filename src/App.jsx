// src/App.js
import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import ProfessorList from './components/ProfessorList';
import professorsData from '../offices.json';
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
        {selectedProfessor ? (
          <div className="professor-details">
            <h2>{selectedProfessor.name}</h2>
            <p><strong>Department:</strong> {selectedProfessor.department}</p>
            <p><strong>Office:</strong> {selectedProfessor.office}</p>
            <p><strong>Email:</strong> <a href={`mailto:${selectedProfessor.email}`}>{selectedProfessor.email}</a></p>
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
        <Map selectedProfessor={selectedProfessor} />
      </div>
    </div>
  );
}

export default App;
