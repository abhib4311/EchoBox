'use client';

import { signIn, useSession } from 'next-auth/react';

export default function Dashboard() {
    const { data: session } = useSession();

    return (
        <div>
            {session ? (
                <p>Welcome, {session.user.email}</p>
            ) : (<>
                <p>You are not signed in.</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => signIn()}>Sign in</button>
            </>
            )}
        </div>
    );
}
