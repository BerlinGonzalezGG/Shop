import mongoose from "mongoose";

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    order: Boolean
});

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;
