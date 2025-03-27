import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  accountId: String,
  deviceId: String,
  secret: String,
  name: String,
  token: Object
});

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
export default Client;
