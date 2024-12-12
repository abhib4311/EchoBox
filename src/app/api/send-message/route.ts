// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import { dbConnect } from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";

// import { Message } from "@/model/User";

// export async function POST(req: Request) {
//     await dbConnect();
//     const session = await getServerSession(authOptions);
//     const user = session?.user as User;
//     const userId = user.id;
//     if (!user) {
//         return Response.json({
//             success: false,
//             message: "Not authenticated"
//         }, { status: 401 });
//     }
//     const { content } = await req.json();
//     try {
//         const foundUser = await UserModel.findById(userId);
//         if (!foundUser) {
//             return Response.json({
//                 success: false,
//                 message: "User not found"
//             }, { status: 404 }
//             );
//         }
//         if (!foundUser.isAcceptingMessages) {
//             return Response.json({
//                 success: false,
//                 message: "User is not accepting messages"
//             }, { status: 404 }
//             );
//         }
//         const newMessage = { content, createdAt: new Date() };

//         foundUser.messages.push(newMessage as Message);

//         await foundUser.save();

//         return Response.json({
//             success: true,
//             message: "Message sent successfully"
//         }, { status: 200 });

//     } catch (error: any) {
//         return Response.json({
//             success: false,
//             message: "Failed to send message"
//         }, { status: 500 });
//     }
// }

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

import { Message } from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
    const { content, username } = await req.json();

    console.log(username)

    try {
        const foundUser = await UserModel.findOne({ username });
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 }
            );
        }
        if (!foundUser.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
                , content
            }, { status: 404 }
            );
        }
        const newMessage = { content, createdAt: new Date() };

        foundUser.messages.push(newMessage as Message);

        await foundUser.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });

    } catch (error: any) {
        return Response.json({
            success: false,
            message: "Failed to send message"
        }, { status: 500 });
    }
}