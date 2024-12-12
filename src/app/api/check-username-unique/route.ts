import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameSchema } from "@/schemas/signUpSchema";

export async function GET(req: Request) {
    await dbConnect();
    try {
        const queryParams = new URL(req.url).searchParams;
        const username = queryParams.get("username");
        const result = usernameSchema.safeParse(username);

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
                message: "Username already exists",
                alreadyExists: true
            });
        }

        return Response.json({
            success: true,
            message: "Username is unique",
            alreadyExists: false
        }, { status: 200 });

    } catch (error: unknown) {
        // Ensure error is of type Error
        if (error instanceof Error) {
            console.error(error);
            return Response.json({
                success: false,
                message: error.message
            }, { status: 500 });
        } else {
            // Handle case where error is not an instance of Error
            console.error('Unknown error occurred', error);
            return Response.json({
                success: false,
                message: 'An unexpected error occurred.'
            }, { status: 500 });
        }
    }
}
