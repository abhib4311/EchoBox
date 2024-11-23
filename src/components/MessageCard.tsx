"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import axios from "axios"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}


const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();

    const handleMessageDelete = async () => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`)
            if (response.status !== 200) {
                throw new Error("Failed to delete message")
            }
            onMessageDelete(message._id)
            toast({
                title: "Message Deleted",
                description: response.data.message,
            })
        } catch (error) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to delete message",
            })
        }
    }


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"  ><XIcon className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleMessageDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>

        </div>
    )
}

export default MessageCard
