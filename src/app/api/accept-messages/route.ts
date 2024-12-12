import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// POST request to accept messages
export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    const { acceptMessages } = await req.json();  // You can use req here if needed
    try {
        const foundUser = await UserModel.findByIdAndUpdate(user.id, { isAcceptingMessages: acceptMessages }, { new: true });

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

    } catch (error: unknown) { // Type error as Error
        if (error instanceof Error) {
            console.error(error.message); // You can log or handle the error more specifically
        }
        return Response.json({
            success: false,
            message: "Failed to update user to accept messages"
        }, { status: 500 });
    }
}

// GET request to check if the user accepts messages
export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 404 });
    }

    try {
        const foundUser = await UserModel.findById(user.id);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        });
    } catch (error: unknown) { // Type error as Error
        if (error instanceof Error) {
            console.error(error.message); // You can log or handle the error more specifically
        }
        return Response.json({
            success: false,
            message: "Failed to retrieve user information"
        }, { status: 500 });
    }
}
