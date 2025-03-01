import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ fetchUsers, editUserId, setEditUserId, name, setName, email, setEmail }) => {
  // Add or update a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (editUserId) {
        // Update user
        await axios.put(`http://localhost:3000/users/${editUserId}`, { name, email });
        alert('User updated successfully!');
      } else {
        // Add user
        await axios.post('http://localhost:3000/users', { name, email });
        alert('User added successfully!');
      }
      setName('');
      setEmail('');
      setEditUserId(null); // Reset edit mode
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to perform the operation. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2>{editUserId ? 'Edit User' : 'Add User'}</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {editUserId ? 'Update User' : 'Add User'}
      </button>
      {editUserId && (
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => {
            setName('');
            setEmail('');
            setEditUserId(null);
          }}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
};

export default AddUser;