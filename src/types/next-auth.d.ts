import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            isVerified: boolean;
            isAcceptingMessages: boolean;
        };
    }

    interface User {
        id: string;
        username: string;
        email: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
    }
}

