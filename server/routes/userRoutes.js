const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/getUsers", async (req, res) => {
  const { firebaseId } = req.body;
  
  if (!firebaseId) {
    return res.status(400).json({ error: "firebaseId is required" });
  }

  try {
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users except the current user
router.get("/getUsers", async (req, res) => {
    const { currentUserId } = req.query;
  
    if (!currentUserId) {
      return res.status(400).json({ error: "currentUserId is required" });
    }
  
    try {
      const users = await User.find({ firebaseId: { $ne: currentUserId } });
      if (!users.length) {
        return res.status(404).json({ error: "No users found" });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });
  
router.post("/getUser", async (req, res) => {
    const { firebaseId } = req.body;
    if (!firebaseId) {
      return res.status(400).json({ error: "firebaseId is required" });
    }
    try {
      const user = await User.findOne({ firebaseId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Retrieve a single user by firebaseId
  router.get("/getUser/:firebaseId", async (req, res) => {
    const { firebaseId } = req.params;
  
    try {
      const user = await User.findOne({ firebaseId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.post("/addUser", async (req, res) => {
    const { firebaseId, email, fullName, avatar, description } = req.body;
  
    // Check if all required fields are provided
    if (!firebaseId || !email || !fullName || !avatar) {
      return res
        .status(400)
        .json({ error: "firebaseId, email, fullName, and avatar are required" });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ firebaseId });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      // Create and save the new user
      const newUser = new User({ firebaseId, email, fullName, avatar, description });
      await newUser.save();
  
      // Send success response
      res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ error: "An error occurred while adding the user" });
    }
  });


  router.use(express.json());

  router.post("/update/:firebaseId", async (req, res) => {
    try {
      const { firebaseId } = req.params;
      const { fullName } = req.body;
  
      // Validate the request data
      if (!fullName) {
        return res.status(400).json({ message: "Full name is required" });
      }
  
      // Find user by firebaseId
      const user = await User.findOne({ firebaseId: firebaseId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's full name
      user.fullName = fullName;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating user:", error); // Detailed logging
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  

module.exports = router;