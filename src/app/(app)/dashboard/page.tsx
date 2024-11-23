'use client';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { useToast } from '@/hooks/use-toast';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();
    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    // Fetch accept messages status
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages);
        } catch (error) {
            handleAxiosError(error, 'Failed to fetch message settings');
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    // Fetch messages
    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: 'Refreshed Messages',
                        description: 'Showing the latest messages.',
                    });
                }
            } catch (error) {
                handleAxiosError(error, 'Failed to fetch messages');
            } finally {
                setIsLoading(false);
            }
        },
        [toast]
    );

    // Handle errors gracefully
    const handleAxiosError = (error: unknown, defaultMessage: string) => {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: 'Error',
            description: axiosError.response?.data.message ?? defaultMessage,
            variant: 'destructive',
        });
    };

    // Toggle accept messages
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: 'Success',
                description: response.data.message,
            });
        } catch (error) {
            handleAxiosError(error, 'Failed to update message settings');
        }
    };

    // Copy profile URL
    const copyToClipboard = () => {
        try {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            const { username } = session?.user as User;
            const profileUrl = `${baseUrl}/u/${username}`;
            navigator.clipboard.writeText(profileUrl);
            toast({
                title: 'URL Copied!',
                description: 'Profile URL has been copied to the clipboard.',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to copy URL to clipboard.',
                variant: 'destructive',
            });
        }
    };

    // Initial data fetch
    useEffect(() => {
        if (!session?.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [session, fetchMessages, fetchAcceptMessages]);

    if (!session?.user) {
        return <div>Please log in to view your dashboard.</div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            {/* Copy URL */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={`${window.location.protocol}//${window.location.host}/u/${session.user.username}`}
                        readOnly
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            {/* Accept Messages Switch */}
            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>

            <Separator />

            {/* Refresh Messages Button */}
            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                <span className="ml-2">Refresh Messages</span>
            </Button>

            {/* Messages List */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={(id) => setMessages((prev) => prev.filter((msg) => msg._id !== id))}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
