// src/components/ProfessorList.js
import { useState } from 'react';

const ProfessorList = ({ professors, onProfessorSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort professors alphabetically by name
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
      />
      <ul>
        {sortedProfessors.map((professor) => (
            <li key={professor.id} onClick={() => onProfessorSelect(professor)}>
                {/*<img className="professor-photo" src={professor.photoURL}/>*/}
                <strong>{professor.name}</strong> <br/>

                {professor.department} - {professor.office}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessorList;
