import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import TaskModal from "./TaskModal";
import Pagination from "../Pagination/Pagination";
import "./TaskManagement.css";

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    fetchTasks();
  }, [filters.status, filters.priority, pagination.currentPage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [filters.search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      };

      const response = await ApiService.getTasks(params);
      if (response.success) {
        setTasks(response.data.tasks);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.pages,
          totalTasks: response.data.pagination.total,
        }));
      }
    } catch (error) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await ApiService.createTask(taskData);
      if (response.success) {
        setSuccess("Task created successfully");
        setShowModal(false);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        fetchTasks();
      }
    } catch (error) {
      setError(error.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await ApiService.updateTask(editingTask.id, taskData);
      if (response.success) {
        setSuccess("Task updated successfully");
        setShowModal(false);
        setEditingTask(null);
        fetchTasks();
      }
    } catch (error) {
      setError(error.message || "Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await ApiService.deleteTask(taskId);
      setSuccess("Task deleted successfully");

      if (tasks.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
        }));
      } else {
        fetchTasks();
      }
    } catch (error) {
      setError(error.message || "Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "in progress":
        return "badge-warning";
      case "pending":
        return "badge-secondary";
      default:
        return "badge-secondary";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  if (loading) {
    return (
      <div className="task-management-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-management-container">
      <div className="page-header">
        <div>
          <h1>Task Management</h1>
          <p>Create and manage your tasks efficiently</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create Task
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

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="form-control"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="form-control"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="filter-group">
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="tasks-table-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks found</h3>
            <p>Get started by creating your first task</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Create Task
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="task-title-cell">
                        <div className="task-title">{task.title}</div>
                      </td>
                      <td className="task-description-cell">
                        {task.description || "-"}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getPriorityBadgeClass(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        {task.due_date ? (
                          <span className="due-date">
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="no-date">Not set</span>
                        )}
                      </td>
                      <td>{task.user_name || "Self"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          {user.role === "admin" && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(task.id)}
                            >
                              Delete
                            </button>
                          )}
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
              totalItems={pagination.totalTasks}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          isAdmin={user.role === "admin"}
        />
      )}
    </div>
  );
};

export default TaskManagement;
