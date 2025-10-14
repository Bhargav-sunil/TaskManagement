const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/database");

dotenv.config();
database.init();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/v1/auth", require("./routes/authRoutes"));
app.use("/v1/users", require("./routes/usersRoutes"));
app.use("/v1/tasks", require("./routes/tasksRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
