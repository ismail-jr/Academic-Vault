require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const testRoutes = require("./src/routes/test.routes");
const submissionRoutes = require("./src/routes/submission.routes");
const userRoutes = require("./src/routes/user.routes");

const app = express();

// Connect database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/user", userRoutes);

// Root Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
