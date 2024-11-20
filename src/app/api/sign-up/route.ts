import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();


        const existingUserbyUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserbyUsername) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 400 });
        }


        const existingUserbyEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already exists"
                }, { status: 400 });
            }
            else {
                existingUserbyEmail.password = await bcrypt.hash(password, 10);
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
                await existingUserbyEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save();
        }


        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "User registered successfully.please check your email for verification"
        }, { status: 200 });


    } catch (error) {

        console.error("Error registering user:", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 });
    }
}