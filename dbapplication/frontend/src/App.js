import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap for styling
import AddUser from './AddUser';
import ViewUsers from './ViewUsers';

const App = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [name, setName] = useState(''); // State for the name input
  const [email, setEmail] = useState(''); // State for the email input
  const [editUserId, setEditUserId] = useState(null); // State to track the user being edited

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Set the form to edit mode
  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditUserId(user.id);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management App</h1>

      {/* Add/Edit User Form */}
      <AddUser
        fetchUsers={fetchUsers}
        editUserId={editUserId}
        setEditUserId={setEditUserId}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
      />

      {/* Users List */}
      <ViewUsers
        users={users}
        fetchUsers={fetchUsers}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default App;