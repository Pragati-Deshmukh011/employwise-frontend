// src/components/Users.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]); // Store users
  const [page, setPage] = useState(1); // Track page number
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [editUser, setEditUser] = useState(null); // Store user being edited
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(`https://reqres.in/api/users?page=${page}`);
        const data = await response.json();
        setUsers(data.data); // Store users
        setTotalPages(data.total_pages); // Update total pages
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page, navigate]); // Fetch users when `page` changes

  // Handle Edit Click
  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  // Handle Delete User
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });
      if (response.ok) {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Persist in localStorage
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Update User
  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user.id === editUser.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Store persistently
        setEditUser(null); // Close Modal
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">User List</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <img src={user.avatar} alt="User Avatar" className="user-avatar" />
              </td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEditClick(user)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="prev-button">Previous</button>
        <span className="page-info"> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="next-button">Next</button>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="modal-input" />
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="modal-input" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="modal-input" />
            <div className="modal-actions">
              <button onClick={handleUpdate} className="update-button">Update</button>
              <button onClick={() => setEditUser(null)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
