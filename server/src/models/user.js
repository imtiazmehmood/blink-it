import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  name: { type: String },
  role: {
    type: String,
    enum: ["Customer", "Admin", "DeliveryPartner"],
    required: true,
  },
  isActivated: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
