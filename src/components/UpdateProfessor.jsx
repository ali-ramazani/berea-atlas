import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Supabase client setup

function UpdateProfessor() {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [updatedData, setUpdatedData] = useState({
    name: '',
    office: '',
    building: '',
    department: '',
    office_hours: '',
  });

  // Handle PIN Submission
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('pin', pin)
      .single();

    setLoading(false);

    if (error) {
      setError('Invalid PIN. Please try again.');
    } else {
      setAuthenticated(true);
      setProfessor(data);

      // Pre-fill form with existing data
      setUpdatedData({
        name: data.name || '',
        office: data.office || '',
        building: data.building || '',
        department: data.department || '',
        office_hours: data.office_hours || '',
      });
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Update Submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('faculty')
      .update(updatedData)
      .eq('id', professor.id);

    setLoading(false);

    if (error) {
      setError('Failed to update information. Please try again.');
    } else {
      alert('Information updated successfully!');
    }
  };

  return (
    <div className="update-professor">
      {!authenticated ? (
        <form onSubmit={handlePinSubmit}>
          <h2>Enter Your PIN</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Enter your PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update Your Information</h2>
          {error && <p className="error">{error}</p>}
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Office:
            <input
              type="text"
              name="office"
              value={updatedData.office}
              onChange={handleChange}
            />
          </label>
          <label>
            Building:
            <input
              type="text"
              name="building"
              value={updatedData.building}
              onChange={handleChange}
            />
          </label>
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={updatedData.department}
              onChange={handleChange}
            />
          </label>
          <label>
            Office Hours:
            <textarea
              name="office_hours"
              value={updatedData.office_hours}
              onChange={handleChange}
            ></textarea>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Submit Changes'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateProfessor;
