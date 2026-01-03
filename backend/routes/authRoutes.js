// 1. Imports (express, middleware, controller)
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { register, login, getMe } = require("../controllers/authController");

// 2. Create router
const router = express.Router();

// 3. Define routes (POST /register, POST /login, GET /me)
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// 4. Export router
module.exports = router;
