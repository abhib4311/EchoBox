import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    const userId = new mongoose.Types.ObjectId(user.id);
    if (!user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    try {
        const foundUser = await UserModel.aggregate([
            { $match: { userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]);



        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }


        return Response.json({
            success: true,
            messages: foundUser[0].messages
        }, { status: 200 });



    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get messages"
        })
    }
}