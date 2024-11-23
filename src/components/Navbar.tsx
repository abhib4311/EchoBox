"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Site Name */}
                <Link href="/" className="font-bold text-xl">
                    EchoBox
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center">
                    {session?.user ? (
                        <>
                            {/* Show username or fallback to email */}
                            <span className="mr-4 text-sm text-gray-600">
                                Logged in as {session?.user?.username || session?.user?.email}
                            </span>
                            <Button className="md:w-auto" onClick={() => signOut()}>
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="md:w-auto">Sign in</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
