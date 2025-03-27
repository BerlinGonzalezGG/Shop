import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
  role:String
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
