const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// helper function to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER - Create new user account
const register = async (req, res) => {
  try {
    // Extract data from request body
    const { username, email, password } = req.body;

    // Validate that all required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username already exists in database
    const isUsernameExists = await User.findOne({ username });

    if (isUsernameExists) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Check if email already exists in database
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Hash the password for security (never store plain text passwords!)
    // 10 is the salt rounds (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database with hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // If user created successfully, call helper function (generateToken)
    // and Send success response with user data and token
    if (newUser) {
      const token = generateToken(newUser._id);

      return res.status(201).json({
        message: "User created successfully.",
        username: newUser.username,
        email: newUser.email,
        token, // Frontend will store this for authentication
      });
    }
  } catch (error) {
    console.error("Server Error while registration.", error);
    res.status(500).json({
      message: "Server Error while registration, Please Try Again Later",
    });
  }
};

// LOGIN - Authenticate existing user
const login = async (req, res) => {
  try {
    // Extract credentials from request body
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });

    // If user doesn't exist, return error immediately
    // (prevents trying to compare password when user is null)
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // Compare provided password with hashed password in database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // If credentials are valid, call the helper function "generateToken()"
    if (user && passwordMatch) {
      const token = generateToken(user._id);

      // Send success response with user data and token
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token, // Frontend will use this for subsequent authenticated requests
      });
    }
  } catch (error) {
    console.error("Server Error while login.", error);
    res.status(500).json({
      message: "Server Error while login, Please Try Again Later",
    });
  }
};

const getMe = async (req, res) => {
  return res
    .status(200)
    .json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
};

module.exports = { register, login, getMe };
