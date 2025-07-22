"use client"

import React, { useEffect, useState } from 'react'
import ProfileAddForm from '@/features/profile/profile-add-form'
import { useParams } from 'next/navigation'
import { ProfileInfo } from '@/types/profile.type'
import axios from 'axios'

const ProfileEditPage = () => {
    const { username } = useParams();
    const [user,setUser]=useState();
  
    const handleDetails = async () => {
        const res = await axios.get(`/api/user/${username}`);

        if (res?.data?.success) {
            setUser(res?.data?.user)
        }
    }

    useEffect(() => {
        if (!user) {
            handleDetails();
        }
    });

    return (
        <div className='mt-4'>
            <ProfileAddForm user={user}/>
        </div>
    )
}

export default ProfileEditPage