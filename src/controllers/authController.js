const {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
  } = require("../models/User");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcryptjs");
  
  const registerUser = async (req, res) => {
    const { name, email, password, role, location, preferredCategories } =
      req.body;
  
    if (!name || !email || !password || !location || !preferredCategories) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await createUser(
        name,
        email,
        hashedPassword,
        role || "user",
        location,
        preferredCategories
      );
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          preferredCategories: user.preferred_categories,
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user", error });
    }
  };
  
  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          preferredCategories: user.preferred_categories,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  };
  
  const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { latitude, longitude, preferredCategories } = req.body;
  
    if (!latitude || !longitude || !preferredCategories) {
      return res.status(400).json({
        message: "Latitude, longitude, and preferred categories are required",
      });
    }
  
    try {
      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const updatedUser = await updateUser(userId, {
        latitude,
        longitude,
        preferredCategories,
      });
  
      res.status(200).json({
        message: "User profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          location: updatedUser.location,
          preferredCategories: updatedUser.preferred_categories,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Error updating user profile", error });
    }
  };
  
  module.exports = { registerUser, loginUser, updateUserProfile };
  