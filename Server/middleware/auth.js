const jwt = require("jsonwebtoken");
const database = require("../config/database");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const actualToken = token.substring(7);
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    const db = database.getDb();
    db.get(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            success: false,
            message: "Invalid token.",
          });
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};

module.exports = {
  auth,
  adminAuth,
};
