import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import UserModal from "./UserModal";
import Pagination from "../Pagination/Pagination";
import "./UserManagement.css";

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pagination.currentPage]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "null" || dateString === "undefined") {
      return "Not available";
    }

    if (dateString instanceof Date && !isNaN(dateString)) {
      return dateString.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    if (typeof dateString === "string") {
      try {
        let date = new Date(dateString);

        if (isNaN(date.getTime())) {
          if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
            date = new Date(dateString.replace(" ", "T") + "Z");
          } else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = new Date(dateString + "T00:00:00Z");
          }
        }

        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      } catch (e) {
        console.error("Date parsing error:", e);
      }
    }

    return String(dateString).substring(0, 20);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      };

      const response = await ApiService.getUsers(params);
      if (response.success) {
        setUsers(response.data.users);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.pages,
          totalUsers: response.data.pagination.total,
        }));
      }
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await ApiService.createUser(userData);
      if (response.success) {
        setSuccess("User created successfully");
        setShowModal(false);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        fetchUsers();
      }
    } catch (error) {
      setError(error.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const response = await ApiService.updateUser(editingUser.id, userData);
      if (response.success) {
        setSuccess("User updated successfully");
        setShowModal(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      setError(error.message || "Failed to update user");
    }
  };

  const handleDelete = async (userId) => {
    if (userId === user.id) {
      setError("Cannot delete your own account");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await ApiService.deleteUser(userId);
      setSuccess("User deleted successfully");

      if (users.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
        }));
      } else {
        fetchUsers();
      }
    } catch (error) {
      setError(error.message || "Failed to delete user");
    }
  };

  const handleEdit = (userData) => {
    setEditingUser(userData);
    setShowModal(true);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const getRoleBadgeClass = (role) => {
    return role === "admin" ? "badge-admin" : "badge-user";
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage system users and administrators</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-close" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
          <button className="alert-close" onClick={() => setSuccess("")}>
            ×
          </button>
        </div>
      )}

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="form-control search-input"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => handleSearchChange("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="users-table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by adding the first user"}
            </p>
            {!searchTerm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Add User
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr key={userItem.id}>
                      <td className="user-id">{userItem.id}</td>
                      <td className="user-name">
                        <div className="name">{userItem.name}</div>
                      </td>
                      <td className="user-email">{userItem.email}</td>
                      <td>
                        <span
                          className={`badge ${getRoleBadgeClass(
                            userItem.role
                          )}`}
                        >
                          {userItem.role}
                        </span>
                      </td>
                      <td className="user-created">
                        {formatDate(userItem.created_at)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(userItem)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(userItem.id)}
                            disabled={userItem.id === user.id}
                            title={
                              userItem.id === user.id
                                ? "Cannot delete your own account"
                                : "Delete user"
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalUsers}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onSave={editingUser ? handleUpdateUser : handleCreateUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          currentUserId={user.id}
        />
      )}
    </div>
  );
};

export default UserManagement;
