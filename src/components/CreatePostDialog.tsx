'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SquarePlus } from "lucide-react"
import { useState } from "react"

export default function CreatePostDialog() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newPost = { title, content, image }
        console.log("Submitted:", newPost)
        // You can send to backend here
        setTitle("")
        setContent("")
        setImage("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                    <SquarePlus size={20} />
            </DialogTrigger>

            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-gray-600/60 backdrop-blur-sm z-50" />
                <DialogContent className="sm:max-w-md ">
                    <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with the community.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder="Post content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />

                        <div className="text-right">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
