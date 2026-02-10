import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to validate password strength
const isStrongPassword = (password) => {
  // At least 6 characters, one uppercase, one lowercase, one number, one special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  return regex.test(password);
};

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      connections,
      location,
    } = req.body;

    // Check if picture was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "Profile picture is required." });
    }

    const picturePath = req.file.filename;

    // Password strength check
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      userType,
      picturePath,
      connections,
      location,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Exclude password before sending user object back
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};