import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: boolean; // Corrected the typo
};

const connection: ConnectObject = {};

// Database connection function
export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected");
        return;
    }

    try {
        // Ensure MONGODB_URI is set in environment variables
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MongoDB URI is not defined in environment variables.");
        }

        // Connect to the database
        const db = await mongoose.connect(mongoURI);

        // Check connection state
        connection.isConnected = db.connections[0].readyState === 1;
        console.log("Connected to DB");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Database connection error:", error.message); // More specific error logging
        } else {
            console.error("Unknown error during DB connection");
        }

        // Exit the process if unable to connect
        process.exit(1);
    }
}
