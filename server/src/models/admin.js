import mongoose from "mongoose";
import { userSchema } from "./user.js";

const adminSchema = mongoose.Schema({
  ...userSchema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], default: "Admin" },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
