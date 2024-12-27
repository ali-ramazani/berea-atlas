// src/components/ProfessorDetails/ProfessorDetails.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProfessorDetails = ({ professor, onReset }) => {
  return (
    <div className="professor-details">
      <div className="professor-photo-container">
        {professor.profile_picture ? (
          <img
            src={professor.profile_picture}
            alt={`${professor.name}'s profile`}
            className="professor-photo"
            loading="lazy"
          />
        ) : (
          <div className="placeholder-photo">No Image</div>
        )}
      </div>
      <h2>{professor.name}</h2>
      <p>
        <strong>Department:</strong> {professor.department}
      </p>
      <p>
        <strong>Office:</strong> {professor.office}
      </p>
      <p>
        <strong>Building:</strong> {professor.building}
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href={`mailto:${professor.email}`}>{professor.email}</a>
      </p>
      <p>
        <strong>Office Hours:</strong> {professor.office_hours || 'N/A'}
      </p>
      <p>
        <strong>Class Schedule:</strong>{' '}
        {professor.class_schedule ? professor.class_schedule.join(', ') : 'N/A'}
      </p>
      <p>
        <strong>Availability:</strong> {professor.is_available ? 'Available' : 'Unavailable'}
      </p>
      <button onClick={onReset} className="back-button">
        Back to List
      </button>
    </div>
  );
};

ProfessorDetails.propTypes = {
  professor: PropTypes.object.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ProfessorDetails;
