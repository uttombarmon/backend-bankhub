import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI as string);

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Listen for connection errors after initial connection
mongoose.connection.on("error", (err: any) => {
  console.error(`Database connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Database disconnected. Attempting to reconnect...");
});

export default connectDB;
