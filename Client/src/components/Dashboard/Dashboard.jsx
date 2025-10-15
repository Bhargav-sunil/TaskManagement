import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get overall task counts (without pagination for stats)
      const tasksResponse = await ApiService.getTasks({ limit: 1000 }); // Large limit to get all tasks for counting

      // Get recent tasks for display (limited to 5)
      const recentTasksResponse = await ApiService.getTasks({ limit: 5 });

      if (tasksResponse.success) {
        const allTasks = tasksResponse.data.tasks;
        const totalTasks =
          tasksResponse.data.pagination?.total || allTasks.length;

        // Count tasks by status from ALL tasks, not just recent ones
        const pendingTasks = allTasks.filter(
          (task) => task.status === "pending"
        ).length;
        const inProgressTasks = allTasks.filter(
          (task) => task.status === "in progress"
        ).length;
        const completedTasks = allTasks.filter(
          (task) => task.status === "completed"
        ).length;

        setStats({
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        });
      }

      if (recentTasksResponse.success) {
        setRecentTasks(recentTasksResponse.data.tasks);
      }
    } catch (error) {
      setError("Failed to load dashboard data");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's your task overview and recent activities</p>
        </div>
        <Link to="/tasks" className="btn btn-primary">
          Manage Tasks
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-tasks">
            <i>📋</i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-tasks">
            <i>⏳</i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress-tasks">
            <i>🚀</i>
          </div>
          <div className="stat-content">
            <h3>{stats.inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed-tasks">
            <i>✅</i>
          </div>
          <div className="stat-content">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="recent-tasks-section">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="view-all-link">
            View All →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet</h3>
            <p>Get started by creating your first task</p>
            <Link to="/tasks" className="btn btn-primary">
              Create Task
            </Link>
          </div>
        ) : (
          <div className="tasks-list">
            {recentTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-main">
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-description">
                    {task.description || "No description provided"}
                  </p>
                  <div className="task-meta">
                    <span
                      className={`badge ${getStatusBadgeClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`badge ${getPriorityBadgeClass(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="task-due">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-assignee">
                  {task.user_name && (
                    <span className="assignee">
                      Assigned to: {task.user_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin*/}
      {user.role === "admin" && (
        <div className="admin-actions-section">
          <div className="section-header">
            <h2>Admin Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <Link to="/users" className="action-card">
              <div className="action-icon">👥</div>
              <h3>Manage Users</h3>
              <p>View and manage all system users</p>
            </Link>
            <Link to="/tasks" className="action-card">
              <div className="action-icon">📊</div>
              <h3>View All Tasks</h3>
              <p>Monitor all tasks across the system</p>
            </Link>
            <div className="action-card">
              <div className="action-icon">📈</div>
              <h3>Reports</h3>
              <p>Generate system reports (Coming Soon)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
