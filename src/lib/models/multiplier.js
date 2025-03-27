import mongoose from "mongoose";

const Schema = mongoose.Schema;

const multiplierSchema = new Schema({
  price: Number
});

const Multiplier =
  mongoose.models.Multiplier || mongoose.model("Multiplier", multiplierSchema);
export default Multiplier;
