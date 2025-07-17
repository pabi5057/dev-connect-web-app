"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { userFormValues, userSchema } from "@/validation/user-schema"
import Link from "next/link"
import axios from 'axios';
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const SignupForm = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<userFormValues>({
        resolver: zodResolver(userSchema),
    })

    const onSubmit = async (data: userFormValues) => {
        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);

        if (data.profilePicture && data.profilePicture instanceof FileList) {
            formData.append("image", data.profilePicture[0]);
        }

        const response = await axios.post('api/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response?.data?.success) {
            toast.success(response.data.message || 'User created successfully!');
            router.push("/login");
        } else {
            toast.error("Something went wrong!");
        }

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setImagePreview(imageUrl)
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
            >
                <h2 className="text-xl font-semibold">Signup</h2>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <Label className="mb-2">First Name</Label>
                        <Input {...register("firstName")} placeholder="Enter First name" />
                        {errors.firstName && (
                            <p className="text-sm text-red-500">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="w-1/2">
                        <Label className="mb-2" >Last Name</Label>
                        <Input {...register("lastName")} placeholder="Enter Last name" />
                        {errors.lastName && (
                            <p className="text-sm text-red-500">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>
                <div>
                    <Label className="mb-2">Username</Label>
                    <Input {...register("username")} placeholder="Enter Username" />
                    {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <Label className="mb-2">Password</Label>
                        <Input {...register("password")} placeholder="Enter password" />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="w-1/2">
                        <Label className="mb-2">Email</Label>
                        <Input type="email" {...register("email")} placeholder="Enter Email" />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label className="mb-2">Profile Picture</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        {...register("profilePicture")}
                        onChange={handleImageChange}
                    />
                    {errors.profilePicture && (
                        <p className="text-sm text-red-500">{errors.profilePicture.message?.toString()}</p>
                    )}
                    {imagePreview && (
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-full mt-2 object-cover"
                        />
                    )}
                </div>
                <div className="w-full text-left">
                    <Button variant="default" type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
                        Signup
                    </Button>
                </div>
            </form>
            <div className="max-w-xl mx-auto mt-2">
                <p>Already have an account ? <Link className="text-red-500" href="/login">Login</Link></p>
            </div>
        </>
    )
}

export default SignupForm;
