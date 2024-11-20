import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameSchema } from "@/schemas/signUpSchema";

export async function GET(req: Request) {
    await dbConnect();
    try {
        const queryParams = new URL(req.url).searchParams;
        const username = queryParams.get("username");
        const result = usernameSchema.safeParse(username);
        console.log(result)
        if (!result.success) {
            const userNameError = result.error.format()._errors || [];
            return Response.json({
                success: false,
                message: userNameError
            }, { status: 400 });
        }
        const existingUser = await UserModel.findOne({ username, isVerified: true });
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 400 });
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        })


    } catch (error: any) {
        console.error(error);
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}