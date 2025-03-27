import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  image: Object,
  name: String,
  price: Number,
  quantity: Number,
  category: String,
  order: Number,
  status: Boolean,
  download: String
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
