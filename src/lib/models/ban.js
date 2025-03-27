import mongoose from "mongoose";

const Schema = mongoose.Schema;

const banSchema = new Schema({
    email: String
});

const Ban = mongoose.models.Ban || mongoose.model("Ban", banSchema);
export default Ban;
