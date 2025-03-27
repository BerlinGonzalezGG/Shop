import mongoose from "mongoose";

const Schema = mongoose.Schema;

const currencySchema = new Schema({
  value: String,
  price: Number,
  label: String,
  lastUpdate: Date,
  flag: String
});

const Currency =
  mongoose.models.Currency || mongoose.model("Currency", currencySchema);
export default Currency;
