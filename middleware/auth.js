const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // ✅
    next();
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
      data: null,
    });
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden - Not enough permissions",
        data: null,
      });
    }
    next();
  };

module.exports = { protect, authorize };
