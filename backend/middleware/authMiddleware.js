const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to protect routes - verifies JWT token
const protect = async (req, res, next) => {
  let token;
  // Check if Authorization header exists and starts with "Bearer"
  // Format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>" format
      // split(" ") creates ["Bearer", "<token>"]
      // [1] gets the second element (the actual token)
      token = req.headers.authorization.split(" ")[1];

      // Verify token with secret key
      // If valid, decoded contains the payload (user ID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database using ID from token
      // .select("-password") excludes password from result (security!)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Call next() to pass control to the next middleware/controller
      // req.user is now available in the route handler
      return next();
    } catch (error) {
      // If token is invalid or expired
      console.error("Unauthorized, invalid token", error);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  }

  // If no token found in headers
  return res.status(401).json({ message: "Unauthorized, no token." });
};

module.exports = { protect };
