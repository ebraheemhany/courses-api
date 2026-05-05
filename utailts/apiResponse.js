const apiResponse = (res, statusCode, status, message = null, data = null) => {
  res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = apiResponse;
