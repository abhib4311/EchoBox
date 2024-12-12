"use client";

import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

const VerifyAccount = () => { // Ensure the component name is PascalCase
    const router = useRouter();
    const { username } = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifyCode: '',
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        console.log(data);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username,
                verifyCode: data.verifyCode
            });
            if (response.status === 200) {
                console.log(response.data.message);
                toast({
                    title: "Verified successfully",
                    description: response.data.message,
                });
                router.replace(`/sign-in`);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Error during verification",
                    variant: "destructive",
                    description: error.response?.data.message || 'Failed to verify account.',
                });
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: 'An unexpected error occurred.',
                });
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-6 space-y-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 mb-6">Verify your account</h1>
                    <p className="mb-4">Enter the verification code sent to your email.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default VerifyAccount;
