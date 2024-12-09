import React, { useState } from 'react';

function ProfessorList({ professors, onProfessorSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort professors based on the search term
  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.office.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProfessors = filteredProfessors.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="professor-list">
      <input
        type="text"
        placeholder="Search for a professor"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <ul>
        {sortedProfessors.map((professor) => (
          <li key={professor.id} onClick={() => onProfessorSelect(professor)}>
            <strong>{professor.name}</strong> <br />
            {professor.department} - {professor.office} <br />
            <em>{professor.building}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfessorList;
