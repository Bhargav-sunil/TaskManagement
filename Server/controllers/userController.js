const bcrypt = require("bcryptjs");
const database = require("../config/database");
const {
  validateUserCreate,
  validateUserUpdate,
} = require("../validators/userValidators");

const getAllUsers = (req, res) => {
  try {
    const db = database.getDb();
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT id, name, email, role, created_at FROM users WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const params = [];
    const countParams = [];

    if (search) {
      query += " AND (name LIKE ? OR email LIKE ?)";
      countQuery += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    // For non-admin users, only show themselves
    if (req.user.role !== "admin") {
      query += " AND id = ?";
      countQuery += " AND id = ?";
      params.push(req.user.id);
      countParams.push(req.user.id);
    }

    query += " ORDER BY id ASC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    // First get total count
    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        console.error("Database error in getAllUsers count:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      // Then get paginated users
      db.all(query, params, (err, users) => {
        if (err) {
          console.error("Database error in getAllUsers:", err);
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        const total = countResult.total;
        const pages = Math.ceil(total / limit);

        res.json({
          success: true,
          data: {
            users,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: total,
              pages: pages,
            },
          },
        });
      });
    });
  } catch (error) {
    console.error("Server error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createUser = (req, res) => {
  try {
    const validation = validateUserCreate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { name, email, password, role = "user" } = req.body;
    const db = database.getDb();

    // Check if user already exists
    db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (row) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error creating user",
            });
          }

          res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
              user: {
                id: this.lastID,
                name,
                email,
                role,
              },
            },
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating user",
    });
  }
};

const updateUser = (req, res) => {
  try {
    const validation = validateUserUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { id } = req.params;
    const { name, email, role } = req.body;
    const db = database.getDb();

    // Check if user exists
    db.get("SELECT id FROM users WHERE id = ?", [id], (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if email is already taken by another user
      if (email) {
        db.get(
          "SELECT id FROM users WHERE email = ? AND id != ?",
          [email, id],
          (err, emailRow) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Database error",
              });
            }

            if (emailRow) {
              return res.status(400).json({
                success: false,
                message: "Email already taken by another user",
              });
            }

            updateUserData();
          }
        );
      } else {
        updateUserData();
      }
    });

    const updateUserData = () => {
      const updates = [];
      const params = [];

      if (name) {
        updates.push("name = ?");
        params.push(name);
      }
      if (email) {
        updates.push("email = ?");
        params.push(email);
      }
      if (role) {
        updates.push("role = ?");
        params.push(role);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      params.push(id);

      db.run(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        params,
        function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error updating user",
            });
          }

          res.json({
            success: true,
            message: "User updated successfully",
          });
        }
      );
    };
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating user",
    });
  }
};

const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const db = database.getDb();

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error deleting user",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting user",
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
