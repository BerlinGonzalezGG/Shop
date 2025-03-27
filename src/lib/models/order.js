import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  payment: Object,
  currency: Object,
  shipping: Object,
  discount: Object,
  status: Boolean,
  timestamp: Date,
  items: Array
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
