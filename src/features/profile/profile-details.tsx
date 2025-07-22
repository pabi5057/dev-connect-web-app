"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileInfo } from '@/types/profile.type'
import axios from 'axios'
import { Camera, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProfileDetails = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [user, setUser] = useState<ProfileInfo | null>(null)
    const { username } = useParams();

    const router=useRouter();

    const handleDetails = async () => {
        const res = await axios.get(`/api/user/${username}`);

        if (res?.data?.success) {
            setUser(res?.data?.user)
        }

    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const imageUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(imageUrl)
        }
    }

    useEffect(() => {
        if (!user) {
            handleDetails();
        }
    });
    return (
        <div>
            <div className='w-full mb-5'>
                {/* cover photo */}
                <div className='w-full h-48 sm:h-60 md:h-72 lg:h-72 max-h-72 relative'>
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
                    <div className='absolute left-4 sm:left-8 -top-12 sm:-top-16'>
                        <Image
                            src={user?.profilePicture || "/images/post3.jpg"}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="rounded-full border-3 border-white shadow-md w-24 h-24 sm:w-32 sm:h-32 object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className='mt-[5rem] mb-2'>
                <div className='flex items-center gap-4'>
                    <h1 className='text-2xl font-medium'>Profile info</h1>
                    <Button variant="link" size="icon" className=' cursor-pointer hover:text-blue-700' onClick={()=>router.push(`/profile/edit/${username}`)}><Pencil color='#325ea8' /></Button>
                </div>
                <p className="text-sm font-semibold mt-1 ml-2">
                    {user?.firstName} {user?.lastName}
                    {user?.username && (
                        <span className="text-sm text-gray-500"> @{user?.username}</span>
                    )}
                </p>
                <div className='flex items-center justify-between my-3'>
                    <Button variant="outline" className=''>52 Followers</Button>
                    <Button variant="link" size="sm" className='text-red-500'>Signout</Button>
                </div>
            </div>

            <div className='border-t-2 mt-5 mb-4'>
                <h1 className='text-xl font-medium mt-5'>Personl Details</h1>
                <div className='mt-4 space-y-2'>
                    <p className='font-semibold'>Name: <span className='text-gray-500'> {user?.firstName} {user?.lastName}</span></p>
                    <p className='font-semibold'>DOB: <span className='text-gray-500'>{user?.dob}</span></p>
                </div>
            </div>
        </div>
    )
}

export default ProfileDetails
