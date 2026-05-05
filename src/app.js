const express = require("express");
const courseRoutes = require("../src/modules/course.routes");

const apiResponse = require("../utailts/apiResponse");
// const ApiError = require("../utailts/ApiError");

const app = express();

app.use(express.json());

app.use("/api/courses", courseRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  apiResponse(res, statusCode, status, err.message);
});

module.exports = app;
