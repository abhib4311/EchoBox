import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),

    email: z.string()
        .email({ message: "Invalid email address" })
        .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, { message: "Invalid email address format" }),

    password: z.string()
        .min(5, { message: "Password must be at least 5 characters long" })

});