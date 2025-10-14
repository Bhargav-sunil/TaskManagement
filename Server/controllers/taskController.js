const database = require("../config/database");
const {
  validateTaskCreate,
  validateTaskUpdate,
} = require("../validators/taskValidators");

const getAllTasks = (req, res) => {
  try {
    const db = database.getDb();
    const { page = 1, limit = 10, status, priority, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, u.name as user_name, uc.name as created_by_name 
      FROM tasks t 
      LEFT JOIN users u ON t.user_id = u.id 
      LEFT JOIN users uc ON t.created_by = uc.id 
      WHERE 1=1
    `;
    let countQuery = "SELECT COUNT(*) as total FROM tasks t WHERE 1=1";
    const params = [];

    // Role based
    if (req.user.role === "user") {
      query += " AND (t.user_id = ? OR t.created_by = ?)";
      countQuery += " AND (t.user_id = ? OR t.created_by = ?)";
      params.push(req.user.id, req.user.id);
    }

    if (status) {
      query += " AND t.status = ?";
      countQuery += " AND t.status = ?";
      params.push(status);
    }

    if (priority) {
      query += " AND t.priority = ?";
      countQuery += " AND t.priority = ?";
      params.push(priority);
    }

    if (search) {
      query += " AND (t.title LIKE ? OR t.description LIKE ?)";
      countQuery += " AND (t.title LIKE ? OR t.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY t.created_at DESC LIMIT ? OFFSET ?";
    const countParams = [...params];
    params.push(parseInt(limit), offset);

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      db.all(query, params, (err, tasks) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        res.json({
          success: true,
          data: {
            tasks,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: countResult.total,
              pages: Math.ceil(countResult.total / limit),
            },
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching tasks",
    });
  }
};

const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const db = database.getDb();

    let query = `
      SELECT t.*, u.name as user_name, uc.name as created_by_name 
      FROM tasks t 
      LEFT JOIN users u ON t.user_id = u.id 
      LEFT JOIN users uc ON t.created_by = uc.id 
      WHERE t.id = ?
    `;
    const params = [id];

    // Role based
    if (req.user.role === "user") {
      query += " AND (t.user_id = ? OR t.created_by = ?)";
      params.push(req.user.id, req.user.id);
    }

    db.get(query, params, (err, task) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        data: { task },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching task",
    });
  }
};

const createTask = (req, res) => {
  try {
    const validation = validateTaskCreate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const {
      title,
      description,
      priority = "medium",
      status = "pending",
      due_date,
      user_id,
    } = req.body;
    const db = database.getDb();

    // user tasks
    const assignedUserId =
      req.user.role === "admin" ? user_id || req.user.id : req.user.id;

    db.run(
      `INSERT INTO tasks (title, description, priority, status, due_date, user_id, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        priority,
        status,
        due_date,
        assignedUserId,
        req.user.id,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error creating task",
          });
        }

        res.status(201).json({
          success: true,
          message: "Task created successfully",
          data: {
            task: {
              id: this.lastID,
              title,
              description,
              priority,
              status,
              due_date,
              user_id: assignedUserId,
              created_by: req.user.id,
            },
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating task",
    });
  }
};

const updateTask = (req, res) => {
  try {
    const validation = validateTaskUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { id } = req.params;
    const { title, description, priority, status, due_date, user_id } =
      req.body;
    const db = database.getDb();

    let query = "SELECT * FROM tasks WHERE id = ?";
    const checkParams = [id];

    if (req.user.role === "user") {
      query += " AND (user_id = ? OR created_by = ?)";
      checkParams.push(req.user.id, req.user.id);
    }

    db.get(query, checkParams, (err, task) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      // updates
      const updates = [];
      const updateParams = [];

      if (title) {
        updates.push("title = ?");
        updateParams.push(title);
      }
      if (description !== undefined) {
        updates.push("description = ?");
        updateParams.push(description);
      }
      if (priority) {
        updates.push("priority = ?");
        updateParams.push(priority);
      }
      if (status) {
        updates.push("status = ?");
        updateParams.push(status);
      }
      if (due_date !== undefined) {
        updates.push("due_date = ?");
        updateParams.push(due_date);
      }
      if (user_id && req.user.role === "admin") {
        updates.push("user_id = ?");
        updateParams.push(user_id);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      updates.push("updated_at = CURRENT_TIMESTAMP");
      updateParams.push(id);

      db.run(
        `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
        updateParams,
        function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error updating task",
            });
          }

          res.json({
            success: true,
            message: "Task updated successfully",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating task",
    });
  }
};

const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const db = database.getDb();

    // admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can delete tasks.",
      });
    }

    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error deleting task",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        message: "Task deleted successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting task",
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
