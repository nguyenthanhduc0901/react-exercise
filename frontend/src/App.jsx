import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

const API_URL = 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: { search: searchTerm }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Cannot fetch users');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Add or update user
  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser.id}`, userData);
        alert('User updated successfully!');
      } else {
        await axios.post(API_URL, userData);
        alert('User added successfully!');
      }
      fetchUsers();
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + (error.response?.data?.error || error.message));
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Cannot delete user');
      }
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">User Listing</h1>
        
        {!showForm ? (
          <>
            <div className="header">
              <input
                type="text"
                className="search-input"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn-add"
                onClick={() => setShowForm(true)}
              >
                Add New User
              </button>
            </div>

            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <UserList 
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            )}
          </>
        ) : (
          <UserForm
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
}

export default App;
