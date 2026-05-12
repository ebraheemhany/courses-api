require("dotenv").config();

const express = require("express");
const courseRoutes = require("../src/modules/course.routes");
const userRoutes = require("../src/user.module/user.routes");
const apiResponse = require("../utailts/apiResponse");
const passport = require("./config/passport");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
// google auth passport middleware
app.use(passport.initialize());
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);

require("dotenv").config();
console.log("CALLBACK:", process.env.GOOGLE_CALLBACK_URL); // ← لازم يطبع الـ URL

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  apiResponse(res, statusCode, status, err.message);
});

module.exports = app;
