"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileInfo } from '@/types/profile.type'
import { Camera, Pencil } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type profileProps = {
    user: ProfileInfo;
}

const ProfileSection = ({ user }: profileProps) => {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const imageUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(imageUrl)
        }
    }


    return (
        <div>
            <div className='w-full mb-5'>
                {/* cover photo */}
                <div className='w-full h-30 sm:h-60 md:h-38 lg-h-52 relative'>
                    <Image
                        src={previewUrl || "/images/post1.jpg"}
                        alt="Cover Photo"
                        fill
                        className="object-cover rounded-b-md"
                    />
                    <label className="absolute bottom-3 right-3 bg-white bg-opacity-80 p-2 rounded-full cursor-pointer hover:bg-opacity-100 transition">
                        <Camera className="text-gray-700 w-5 h-5" />
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                <div className='relative w-full'>
                    <div className='absolute left-4 sm:left-8 -top-12 sm:-top-10'>
                        <Image
                            src={user?.profilePicture || "/images/post3.jpg"}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full border-3 border-white shadow-md w-24 h-24 sm:w-20 sm:h-20 object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className='mt-[3.5rem]'>
                <div className='flex items-center gap-4'>
                    <Link href={`/profile/details/${user?.username}`} className='text-xl font-medium hover:text-blue-700'>Profile info</Link>
                    <Button variant="link" size="icon" className=' cursor-pointer hover:text-blue-700' onClick={() => router.push(`/profile/edit/${user?.username}`)}><Pencil color='#325ea8' /></Button>

                </div>
                <p className="text-sm font-semibold mt-1 ml-2">
                    {user?.firstName} {user?.lastName}
                    {user?.username && (
                        <span className="text-sm text-gray-500"> @{user?.username}</span>
                    )}
                </p>

                <div className='flex items-center justify-between my-3'>
                    <Button variant="outline" className=''>52 Followers</Button>
                    <Button variant="link" size="sm" className='text-red-500' onClick={() => signOut({ callbackUrl: "/login" })}>Signout</Button>
                </div>
            </div>
        </div>
    )
}

export default ProfileSection
