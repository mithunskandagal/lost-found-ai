import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error reason:", error.reason?.message || "No reason provided");

    process.exit(1);
  }
}