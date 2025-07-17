'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import {
    Compass,
    Heart,
    Home,
    MessageCircle,
    Search,
    Menu,
    X,
} from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import CreatePostDialog from './CreatePostDialog'
import { useSession } from 'next-auth/react'


const Appbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <header className="w-full bg-white shadow px-4 md:px-6 py-4 sticky top-0 left-0 z-50">
            <div className="w-full md:w-[w-full] lg:w-[72%] xl:w-[72%] max-w-[1200px] mx-auto">
                <div className="flex items-center justify-between">
                    {/* Left - Logo */}
                    <h3 onClick={() => router.push("/")} className="text-2xl font-pacifico text-pink-600 cursor-pointer">DevHub</h3>
                    <div className="flex items-center gap-4">
                        {/* Hamburger on small screens */}
                        <Button
                            className="md:hidden"
                            variant="outline"
                            size="icon"
                            onClick={() => setMenuOpen(prev => !prev)}
                            aria-label="Menu"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>

                    {/* Middle - Search (hide on small screens) */}
                    {session && <div className="hidden md:block w-5/12">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search here"
                                className="pl-10 pr-4"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>}

                    {/* Right - Navigation icons (hide on small screens) */}
                    {session ? <ul className="hidden md:flex items-center gap-4">
                        <li className=' cursor-pointer' onClick={() => router.push("/")}>
                            <Home size={20} />
                        </li>
                        <li><MessageCircle size={20} /></li>
                        <li className=' cursor-pointer'><CreatePostDialog /></li>
                        <li>
                            <Compass size={20} />
                        </li>
                        <li><Heart size={20} /></li>
                    </ul> : <ul className="hidden md:flex items-center gap-4">
                        <li><Button variant="link" size="sm" className='text-blue-500'>Signup</Button></li>
                    </ul>}
                </div>
            </div>

            {/* Mobile Sidebar */}
            {menuOpen && (
                <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 px-6 py-4 md:hidden transition-transform">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-pacifico text-pink-600">DevHub</h3>
                    </div>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-center gap-2 text-gray-700 cursor-pointer" onClick={() => router.push("/")}><Home size={20} /> Home</li>
                        <li className="flex items-center gap-2 text-gray-700"><MessageCircle size={20} /> Messages</li>
                        <li className="flex items-center gap-2 text-gray-700 cursor-pointer"><CreatePostDialog /> Create</li>
                        <li className="flex items-center gap-2 text-gray-700"><Compass size={20} /> Explore</li>
                        <li className="flex items-center gap-2 text-gray-700"><Heart size={20} /> Activity</li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Appbar
