import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

// 👇 Fix for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Absolute path to .env.local
dotenv.config({ path: path.join(__dirname, "../../.env.local") });

console.log("URI:", process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

await mongoose.connect(process.env.MONGODB_URI);

const hashedPassword = await bcrypt.hash("Pa55word@tatvam", 10);

await Admin.create({
  email: "admin@tatvam.com",
  password: hashedPassword,
});

console.log("✅ Admin Created");
process.exit();