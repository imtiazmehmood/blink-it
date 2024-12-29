import mongoose from "mongoose";

// Branch Schema
const branchSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    liveLocation: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
    },
    address: { type: String },
    deliveryPartners: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
    ],
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
