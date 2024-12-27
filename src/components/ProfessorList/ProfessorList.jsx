// src/components/ProfessorList/ProfessorList.jsx
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const ProfessorList = ({ professors, onProfessorSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedProfessors = useMemo(() => {
    return professors
      .filter((professor) =>
        ['name', 'department', 'office', 'building'].some((key) =>
          professor[key].toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [professors, searchTerm]);

  return (
    <div className="professor-list">
      <input
        type="text"
        placeholder="Search for a professor or department"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
        aria-label="Search for a professor"
      />
      {filteredAndSortedProfessors.length > 0 ? (
        <ul className="list">
          {filteredAndSortedProfessors.map((professor) => (
            <li
              key={professor.id}
              onClick={() => onProfessorSelect(professor)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') onProfessorSelect(professor);
              }}
              className="list-item"
            >
              <strong>{professor.name}</strong> <br />
              {professor.department} - {professor.office} <br />
              <em>{professor.building}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-results">No professors found matching your search.</p>
      )}
    </div>
  );
};

ProfessorList.propTypes = {
  professors: PropTypes.array.isRequired,
  onProfessorSelect: PropTypes.func.isRequired,
};

export default ProfessorList;
