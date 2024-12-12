'use client';

import { Button } from '@/components/ui/button';
import { LayoutDashboardIcon, Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
    Carousel,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel';

export default function Home() {
    return (
        <>
            {/* Container to hold the main content and footer */}
            <div className="flex h-full flex-col bg-gray-800 text-white ">

                {/* Main content */}
                <main className=" flex flex-col items-center justify-center px-16">
                    <section className="text-center my-14 md:my-16 ">
                        <h1 className="text-4xl font-bold md:text-5xl">
                            Dive into the World of Anonymous Feedback
                        </h1>
                        <p className="mt-3 md:mt-4 text-base md:text-lg">
                            EchoBox - Where your identity remains a secret.
                        </p>
                    </section>

                    {/* Carousel for Messages */}
                    <Carousel
                        plugins={[Autoplay({ delay: 4000 })]}
                        className="w-full max-w-lg md:max-w-xl mt-4"
                    >
                        <CarouselContent>
                            {messages.map((message, index) => (
                                <CarouselItem key={index} className="p-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{message.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                                            <Mail className="flex-shrink-0" />
                                            <div>
                                                <p>{message.content}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {message.received}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    <Button
                        className="mt-11 py-8"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Go to Dashboard <LayoutDashboardIcon />
                    </Button>
                </main>

                {/* Footer */}
                <footer className="text-center p-8 mt-8 md:mt-12 bg-gray-900 text-white bottom-0 z-50 ">
                    © 2024 EchoBox. All rights reserved.
                </footer>
            </div>
        </>
    );
}
