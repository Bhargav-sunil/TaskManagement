import React, { useState, useEffect } from 'react'
import ApiService from '../../services/api'
import './TaskModal.css'

const TaskModal = ({ task, onSave, onClose, isAdmin, isOpen }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    user_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => {
    if (isAdmin && isOpen) {
      fetchUsers()
    }
  }, [isAdmin, isOpen])

  useEffect(() => {
    if (task) {
      const assignedUser = users.find(u => u.id === task.user_id)
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        user_id: task.user_id || ''
      })
      setUserSearch(assignedUser ? `${assignedUser.name} (${assignedUser.email})` : '')
    }
  }, [task, users])

  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    try {
      setUsersLoading(true)
      const response = await ApiService.getUsers({ limit: 100 }) 
      if (response.success) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleUserSearchChange = (e) => {
    const value = e.target.value
    setUserSearch(value)
    setShowUserDropdown(true)
    
    if (!value.trim()) {
      setFormData(prev => ({ ...prev, user_id: '' }))
    }
  }

  const selectUser = (user) => {
    setFormData(prev => ({ ...prev, user_id: user.id }))
    setUserSearch(`${user.name} (${user.email})`)
    setShowUserDropdown(false)
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters'
    }

    if (formData.due_date) {
      const dueDate = new Date(formData.due_date)
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = 'Invalid date format'
      } else if (dueDate < new Date().setHours(0, 0, 0, 0)) {
        newErrors.due_date = 'Due date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter task title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-control ${errors.description ? 'error' : ''}`}
              rows="3"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter task description (optional)"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <div className="char-count">
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="due_date" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              className={`form-control ${errors.due_date ? 'error' : ''}`}
              value={formData.due_date}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.due_date && <span className="error-message">{errors.due_date}</span>}
          </div>

          {isAdmin && (
            <div className="form-group">
              <label htmlFor="user_search" className="form-label">
                Assign to User
              </label>
              <div className="user-search-container">
                <input
                  type="text"
                  id="user_search"
                  className="form-control"
                  value={userSearch}
                  onChange={handleUserSearchChange}
                  onFocus={() => setShowUserDropdown(true)}
                  disabled={loading || usersLoading}
                  placeholder={usersLoading ? "Loading users..." : "Search users by name or email..."}
                />
                {usersLoading && (
                  <div className="users-loading">Loading users...</div>
                )}
                {showUserDropdown && userSearch && !usersLoading && (
                  <div className="user-dropdown">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className="user-option"
                          onClick={() => selectUser(user)}
                        >
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                          <div className={`user-role ${user.role}`}>{user.role}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-users">No users found</div>
                    )}
                  </div>
                )}
              </div>
              <div className="help-text">
                Start typing to search users by name or email. Leave empty to assign to yourself.
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  {task ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
