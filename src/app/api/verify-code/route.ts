import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, verifyCode } = await req.json();
        const User = await UserModel.findOne({ username });
        if (!User) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        const isCodeValid = User.verifyCode === verifyCode;
        const isCodeNotExpired = User.verifyCodeExpiry > Date.now();
        if (isCodeValid && isCodeNotExpired) {
            User.isVerified = true;
            await User.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 });
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again."
            })
        }
        else {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 400 });
        }



    }
    catch (error: any) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Error verifying code"
        }, { status: 500 });
    }
}