// src/components/ProfessorContainer/ProfessorContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import useProfessors from '../../hooks/useProfessors';
import ProfessorList from '../ProfessorList/ProfessorList';
import ProfessorDetails from '../ProfessorDetails/ProfessorDetails';

const ProfessorContainer = ({ selectedProfessor, onProfessorSelect, onReset }) => {
  const { professors, loading, error } = useProfessors();

  if (loading) {
    return <div className="professor-container loading">Loading professors...</div>;
  }

  if (error) {
    return <div className="professor-container error">Error: {error}</div>;
  }

  return (
    <div className="professor-container">
      {selectedProfessor ? (
        <ProfessorDetails professor={selectedProfessor} onReset={onReset} />
      ) : (
        <ProfessorList professors={professors} onProfessorSelect={onProfessorSelect} />
      )}
    </div>
  );
};

ProfessorContainer.propTypes = {
  selectedProfessor: PropTypes.object,
  onProfessorSelect: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ProfessorContainer;
