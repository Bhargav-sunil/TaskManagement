const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../config/database");
const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidators");

const register = (req, res) => {
  try {
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { name, email, password } = req.body;
    const db = database.getDb();

    // Exists
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
        [name, email, hashedPassword, "user"],
        function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error creating user",
            });
          }

          const token = jwt.sign(
            { id: this.lastID, email, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
              token,
              user: {
                id: this.lastID,
                name,
                email,
                role: "user",
              },
            },
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

const login = (req, res) => {
  try {
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { email, password } = req.body;
    const db = database.getDb();

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

const getMe = (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

module.exports = {
  register,
  login,
  getMe,
};
