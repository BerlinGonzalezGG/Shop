import mongoose from "mongoose";

const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: String,
  expires: Date,
  uses: Number,
  discount: Number,
  type: String,
  vbucks: Number
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;
