import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";



export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    const userId = user.id
    if (!user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    const { messageFlag } = await req.json();
    try {
        const foundUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: messageFlag }, { new: true });
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to update user to accept messages"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: "User updated to accept messages"
        }, { status: 200 });

    } catch (error: any) {
        return Response.json({
            success: false,
            message: "Failed to update user to accept messages"
        }, { status: 500 });

    }
}


export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    const userId = user.id
    if (!user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 404 });
    }
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        })
    } catch (error: any) {
        return Response.json({
            success: false,
            message: "Failed to update user to accept messages"
        }, { status: 500 });
    }
}