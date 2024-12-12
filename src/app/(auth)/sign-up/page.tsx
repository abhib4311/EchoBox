"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnique, setIsUnique] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message || '');
                    setIsUnique(response.data.success);
                } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                        setUsernameMessage('Error checking username availability.');
                    } else {
                        setUsernameMessage('An unexpected error occurred.');
                    }
                    setIsUnique(false);
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/sign-up`, data);
            if (response.status === 200) {
                toast({
                    title: "Signed up successfully",
                    description: response.data.message,
                });
                router.replace(`/verify/${data.username}`);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: error.response?.data.message || 'Failed to sign up.',
                });
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: 'An unexpected error occurred.',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-6 space-y-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 mb-6">Join EchoBox</h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                debounced(e.target.value);
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    {(username ? (
                                        <p className={`text-sm mt-1 ${isUnique ? "text-green-600" : "text-red-600"}`}>
                                            {usernameMessage}
                                        </p>
                                    ) : (
                                        <p className="text-sm mt-1 text-gray-500">Enter a unique username</p>
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting || isCheckingUsername} className="w-full">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" /> Please wait....
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>

                        <Link href="/sign-in" className="text-sm text-gray-500 hover:underline">Already have an account?</Link>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default SignUpPage;
