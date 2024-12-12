"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut, SignpostIcon, User2Icon } from "lucide-react";

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="w-full p-4 top-0 z-50 sticky  bg-white md:p-6 shadow-md  ">
            <div className="max-w-9xl flex items-center justify-between md:mx-auto">

                {/* Site Name */}
                <Link href="/" className="font-bold text-2xl text-gray-800 hover:text-gray-950 transition ml-8">
                    EchoBox
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-4">
                    {session?.user ? (
                        <>
                            {/* User Info */}
                            <div className="flex items-center space-x-2 text-gray-700">
                                <User2Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {session.user.username?.toUpperCase() || session.user.email?.toUpperCase()}
                                </span>
                            </div>

                            {/* Sign Out Button */}
                            <Button onClick={() => signOut()}>

                                <LogOut />
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
