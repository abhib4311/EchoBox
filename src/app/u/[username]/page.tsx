"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const suggestedMessages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
    "What's a fun fact about you?",
    "If you could travel anywhere, where would it be?",
];

export default function SendMessage() {
    const { username } = useParams<{ username: string }>();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isValidUser, setIsValidUser] = useState(false);
    const [isCheckingUser, setIsCheckingUser] = useState(true);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch("content");

    const handleMessageClick = (message: string) => {
        form.setValue("content", message);
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/send-message`, {
                ...data,
                username,
            });
            if (!response.data.success) throw new Error(response.data.message);

            toast({
                title: "Success",
                description: "Message sent successfully!",
                variant: "default",
            });
            form.reset({ content: "" });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message || "Failed to send the message.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkUsernameValidity = async () => {
            setIsCheckingUser(true);
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                if (!response.data.alreadyExists) {
                    toast({
                        title: "Invalid Username",
                        description: "The username you provided is not valid.",
                        variant: "destructive",
                    });
                    return;
                }
                setIsValidUser(true);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                router.push("/");
            } finally {
                setIsCheckingUser(false);
            }
        };

        checkUsernameValidity();
    }, [username, toast, router]);

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl shadow-sm max-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Send Anonymous Message</h1>

            {isCheckingUser ? (
                <div className="flex flex-col items-center justify-center min-h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p className="ml-2 mt-2 text-lg">Validating username...</p>
                </div>
            ) : !isValidUser ? (
                <div className="text-center mt-16">
                    <p className="text-3xl font-bold mb-4">Invalid Username</p>
                    <p className="mb-6">Get Your Own Message Board</p>
                    <Link href="/sign-up">
                        <Button>Create Your Account</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Message to: <b>@{username.toUpperCase()}</b>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your anonymous message here"
                                                className="resize-none"
                                                {...field}
                                                aria-label="Message Input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-center">
                                {isLoading ? (
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={!messageContent || isLoading}
                                    >
                                        Send It
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>

                    <div className="my-8 space-y-4">
                        <Card>
                            <CardHeader>
                                <h3 className="text-xl font-semibold">Suggested Messages</h3>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-4">
                                {suggestedMessages.map((message, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        onClick={() => handleMessageClick(message)}
                                        aria-label={`Select message: ${message}`}
                                    >
                                        {message}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="my-6" />

                    <div className="text-center">
                        <p className="mb-4">Get Your Own Message Board</p>
                        <Link href="/sign-up">
                            <Button>Create Your Account</Button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
