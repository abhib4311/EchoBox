import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import { dbConnect } from '@/lib/dbConnect';

export async function DELETE(
    request: NextRequest, // Use NextRequest for better type support
    { params }: { params: { messageid: string } }
) {
    const { messageid } = await params;

    // console.log(messageid);
    await dbConnect();

    const session = await getServerSession(authOptions);

    // Null check for session and session user
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401 }
        );
    }

    const _user: User = session.user;
    // console.log(_user.id);

    try {
        const updateResult = await UserModel.updateOne(
            { _id: _user.id },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updateResult.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ message: 'Message not found or already deleted', success: false }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Message deleted', success: true }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return new Response(
            JSON.stringify({ message: 'Error deleting message', success: false }),
            { status: 500 }
        );
    }
}
