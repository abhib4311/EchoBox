import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    const user = session.user as User;
    const userId = new mongoose.Types.ObjectId(user.id);

    try {
        // Fetching user with their messages from the database
        const foundUser = await UserModel.aggregate([
            { $match: { _id: userId } },  // Match by userId field
            { $unwind: "$messages" },     // Unwind messages array
            { $sort: { "messages.createdAt": -1 } },  // Sort messages by creation date in descending order
            {
                $group: {
                    _id: "$_id",  // Group by userId
                    messages: { $push: "$messages" },  // Collect all messages
                }
            }
        ]);
        // console.log(foundUser[0])
        if (!foundUser || foundUser.length === 0) {
            return Response.json({
                success: true,
                message: "No messages available"
            }, { status: 200 });
        }

        // Log the messages for debugging purposes
        // console.log(foundUser[0].messages);

        // Return messages as response
        return Response.json({
            success: true,
            messages: foundUser[0].messages
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching messages:", error);
        return Response.json({
            success: false,
            message: "Failed to get messages",
            error: error.message || "Unknown error"
        }, { status: 500 });
    }
}
