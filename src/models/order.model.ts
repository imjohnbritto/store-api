import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Order", OrderSchema);
