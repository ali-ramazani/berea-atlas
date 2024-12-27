// src/App.jsx
import React, { useState } from 'react';
import './styles/App.css'; // Ensure this imports the global CSS
import Header from './components/Header/Header';
import ProfessorContainer from './components/ProfessorContainer/ProfessorContainer';
import Map from './components/Map/Map';

function App() {
  // State to manage selected professor
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  // Handler to select a professor
  const handleProfessorSelect = (professor) => {
    setSelectedProfessor(professor);
  };

  // Handler to deselect a professor
  const handleReset = () => {
    setSelectedProfessor(null);
  };

  return (
    <div className="app-container">
      <div className="navigation-overlay">
        <Header />
        <ProfessorContainer
          selectedProfessor={selectedProfessor}
          onProfessorSelect={handleProfessorSelect}
          onReset={handleReset}
        />
      </div>
      <div className="map-container">
        <Map selectedProfessor={selectedProfessor} />
      </div>
    </div>
  );
}

export default App;
