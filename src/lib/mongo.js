import mongoose from "mongoose";

const conn = {
  isConnected: false
};

export async function connectDB() {
  if (conn.isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    conn.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("Mongoose connection error", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

mongoose.connection.on("connected", () => {
});

mongoose.connection.on("error", error => {
});
