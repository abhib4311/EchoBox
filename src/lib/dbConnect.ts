import mongoose from "mongoose";

type ConnectObject = {
    isConncted?: boolean
}
const connection: ConnectObject = {}

export async function dbConnect(): Promise<void> {
    if (connection.isConncted) {
        console.log("Already connected")
        return
    };
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConncted = db.connections[0].readyState === 1
        console.log("Connected to DB")
    } catch (error: any) {

        console.log(error.message)
        process.exit(1);

    }
}