import mongoose from "mongoose";
import { userSchema } from "./user.js";

const customerSchema = mongoose.Schema({
  ...userSchema.obj,
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Customer"], default: "Customer" },
  liveLocation: {
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  address: { type: String },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
