"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ProfileFormValues, profileSchema } from "@/validation/profile-schema"
import { ProfileInfo } from "@/types/profile.type"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type formProps = {
    user: ProfileInfo;
}

const ProfileAddForm = ({ user }: formProps) => {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            contact: "",
            dob: "",
            profilePicture: "",
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                username: user.username || "",
                email: user.email || "",
                contact: user.contact || "", // if `user.contact` exists, replace "" with user.contact
                dob: user.dob || "",
                profilePicture: user.profilePicture || "",
            })
            setImagePreview(user.profilePicture || null)
        }
    }, [user, reset])

    const onSubmit = async (data: ProfileFormValues) => {
        console.log("Submitted data:", data);
        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('dob', data.dob);
        formData.append('contact', data.contact);

        if (data.profilePicture && data.profilePicture instanceof FileList) {
            formData.append("image", data.profilePicture[0]);
        } else {
            formData.append("image", user.profilePicture);
        }

        const response = await axios.put(`/api/profile/${user?.username}/edit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response?.data?.success) {
            toast.success(response.data.message || 'Profile edit successfully!');
            router.push(`/profile/details/${user?.username}`);
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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
        >
            <h2 className="text-xl font-semibold">Edit Profile</h2>

            <div className="flex gap-4">
                <div className="w-1/2">
                    <Label className="mb-2">First Name</Label>
                    <Input {...register("firstName")} placeholder="Enter First name" />
                    {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                </div>
                <div className="w-1/2">
                    <Label className="mb-2">Last Name</Label>
                    <Input {...register("lastName")} placeholder="Enter Last name" />
                    {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-1/2">
                    <Label className="mb-2">Username</Label>
                    <Input {...register("username")} placeholder="Enter Username" />
                    {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
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

            <div className="flex gap-4">

                <div className="w-1/2">
                    <Label className="mb-2">Contact</Label>
                    <Input type="tel" {...register("contact")} placeholder="Enter Contact" />
                    {errors.contact && (
                        <p className="text-sm text-red-500">{errors.contact.message}</p>
                    )}
                </div>

                <div className="w-1/2">
                    <Label className="mb-2">Date of Birth</Label>
                    <Input type="date" {...register("dob")} />
                    {errors.dob && (
                        <p className="text-sm text-red-500">{errors.dob.message}</p>
                    )}
                </div>
            </div>


            <div>
                <Label>Profile Picture</Label>
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
            <div className="w-full text-right">
                <Button type="submit" className="">
                    Save Profile
                </Button>
            </div>
        </form>
    )
}

export default ProfileAddForm;
