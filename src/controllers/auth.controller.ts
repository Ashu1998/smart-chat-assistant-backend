import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body;
  
  // Check for existing user by email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.status(400).json({ message: "Email already registered" });

  // Check for existing user by username if provided
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ 
    email, 
    password: hashed,
    ...(username && { username }) // Only include username if it's provided
  });

  return res.status(201).json({ message: "Registered successfully", user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "");
  return res.json({ token });
}
