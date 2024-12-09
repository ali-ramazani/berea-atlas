import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import ProfessorList from './components/ProfessorList';
import { supabase } from '../supabaseClient'; // Import the Supabase client
import buildingCoordinates from '../buildings.json'; // Load JSON for building coordinates
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  // Fetch professors from Supabase
  useEffect(() => {
    const fetchProfessors = async () => {
      const { data, error } = await supabase.from('faculty').select('*');
      if (error) {
        console.error('Error fetching professors:', error.message);
      } else {
        setProfessors(data);
      }
    };

    fetchProfessors();
  }, []);

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
            <div className="professor-photo-container">
              {selectedProfessor.profile_picture ? (
                <img
                  src={selectedProfessor.profile_picture}
                  alt={`${selectedProfessor.name}'s profile`}
                  className="professor-photo"
                />
              ) : (
                <div className="placeholder-photo">No Image</div>
              )}
            </div>
            <h2>{selectedProfessor.name}</h2>
            <p><strong>Department:</strong> {selectedProfessor.department}</p>
            <p><strong>Office:</strong> {selectedProfessor.office}</p>
            <p><strong>Building:</strong> {selectedProfessor.building}</p>
            <p><strong>Email:</strong> <a href={`mailto:${selectedProfessor.email}`}>{selectedProfessor.email}</a></p>
            <p><strong>Office Hours:</strong> {selectedProfessor.office_hours}</p>
            <p><strong>Class Schedule:</strong> {selectedProfessor.class_schedule ? selectedProfessor.class_schedule.join(', ') : 'N/A'}</p>
            <p><strong>Availability:</strong> {selectedProfessor.is_available ? 'Available' : 'Unavailable'}</p>
            <button onClick={handleReset}>Back to List</button>
          </div>
        ) : (
          <ProfessorList
            professors={professors}
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
