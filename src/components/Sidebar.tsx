"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import { useState } from "react"
import ProfileSection from "@/features/profile/profile-section"

const users = [
    {
        id: 1,
        fullName: "Prem Achary",
        username: "prem12",
        image: "/images/post1.jpg",
        isFollowing: true,
    },
    {
        id: 2,
        fullName: "Jane Smith",
        username: "janesmith",
        image: "/images/post2.jpg",
        isFollowing: false,
    },
    {
        id: 3,
        fullName: "Dev Ninja",
        username: "devninja",
        image: "/images/post3.jpg",
        isFollowing: false,
    },
]

export default function Sidebar() {
    const [userList, setUserList] = useState(users)

    const toggleFollow = (id: number) => {
        setUserList(prev =>
            prev.map(user =>
                user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
            )
        )
    }

    return (
        <aside className="w-full lg:w-80 h-full max-h-[calc(100vh-100px)] overflow-y-auto border-l bg-gray-50 p-4 hidden md:block rounded-md shadow-sm">
            {/* Top Profile Section */}
            <ProfileSection />

            {/* Suggestion Header */}
            <div className="flex items-center justify-between mt-6 mb-3">
                <p className="text-base font-semibold text-gray-700">Suggested for you</p>
                <button className="text-sm text-blue-500 hover:underline">See all</button>
            </div>

            {/* Suggested Users */}
            <div className="space-y-4">
                {userList.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src={user.image}
                                alt="profile"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">{user.fullName}</h3>
                                <p className="text-xs text-gray-500">@{user.username}</p>
                            </div>
                        </div>

                        <Button
                            variant="link"
                            size="sm"
                            className="text-sm text-blue-600"
                            onClick={() => toggleFollow(user.id)}
                        >
                            {user.isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    </div>
                ))}
            </div>
        </aside>
    )
}
