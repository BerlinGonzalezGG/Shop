import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ipSchema = new Schema({
    ip: String,
    email: String,
    location: String
});

const Ip = mongoose.models.Ip || mongoose.model("Ip", ipSchema);
export default Ip;
