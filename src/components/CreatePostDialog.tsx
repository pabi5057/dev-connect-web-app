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
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PostFormvalue, postSchema } from "@/validation/post.schema"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CreatePostDialog() {
    const [open, setOpen] = useState(false)
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();

    const { register, setValue, reset, handleSubmit, formState: { errors }, } = useForm<PostFormvalue>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            content: "",
            image: "",
        },
    })

    const onSubmit = async (data: PostFormvalue) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        if (data.image && data.image instanceof FileList && data.image.length > 0) {
            formData.append("image", data.image[0]);
        }

        const res = await axios.post("/api/posts", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (res?.data?.success) {
            toast.success(res?.data?.message || "post create successfull!");
            router.push("/")
        } else {
            toast.error(res?.data?.message);
        }
        reset();
        setPreview(null);
        setOpen(false);
    }


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreview(imageURL);
        }
    };

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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input placeholder="Post title" {...register("title")} />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}

                        <Textarea placeholder="Post content..." {...register("content")} />
                        {errors.content && (
                            <p className="text-sm text-red-500">{errors.content.message}</p>
                        )}

                        <label className="block text-sm font-medium">Upload Image</label>
                        <Input type="file" {...register("image")} accept="image/*" onChange={handleImageUpload} />

                        {preview && (
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground">Image Preview:</p>
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 mt-2 rounded-md border"
                                />
                            </div>
                        )}

                        <div className="text-right">
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
