import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";


interface Token {
    id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
}


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {

                await dbConnect();
                try {

                    const user = await UserModel.findOne({ username: credentials?.username });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect Password")
                    }
                    return user


                } catch (error: any) {
                    throw new Error(error);
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Typing token to use the Token interface
                (token as Token).id = user.id;
                (token as Token).username = user.username;
                (token as Token).email = user.email;
                (token as Token).isVerified = user.isVerified;
                (token as Token).isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // Ensure session.user is correctly typed
                session.user.id = (token as Token).id;
                session.user.username = (token as Token).username;
                session.user.email = (token as Token).email;
                session.user.isVerified = (token as Token).isVerified;
                session.user.isAcceptingMessages = (token as Token).isAcceptingMessages;
            }
            return session;
        },
    },

    pages: {
        signIn: '/sign-in'
    }
    , session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,


}