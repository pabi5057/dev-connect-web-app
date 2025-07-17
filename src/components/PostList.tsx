"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
    Bookmark,
    Heart,
    Loader2,
    MessageSquare,
    Send,
} from "lucide-react"

type Post = {
    id: number
    title: string
    content: string
    image: string
}

const fetchPosts = (page: number, limit: number = 2): Promise<Post[]> => {
    const allPosts: Post[] = [
        { id: 1, title: "Welcome to DevConnect", content: "A platform for devs.", image: "/images/post2.jpg" },
        { id: 2, title: "How to use ShadCN UI", content: "Let's build beautiful UIs.", image: "/images/bird.jpg" },
        { id: 3, title: "Next.js Tips", content: "Use app router!", image: "/images/post3.jpg" },
        { id: 4, title: "Tailwind Tricks", content: "Utility-first CSS magic.", image: "/images/bird.jpg" },
        { id: 5, title: "Deploying with Vercel", content: "So smooth.", image: "/images/post1.jpg" },
    ]

    return new Promise((resolve) => {
        setTimeout(() => {
            const start = (page - 1) * limit
            const end = start + limit
            resolve(allPosts.slice(start, end))
        }, 1000)
    })
}

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [likedPosts, setLikedPosts] = useState<number[]>([]) // Track liked posts
    const observerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true)
            const newPosts = await fetchPosts(page)
            setPosts(prev => [...prev, ...newPosts])
            setHasMore(newPosts.length > 0)
            setLoading(false)
        }
        loadPosts()
    }, [page])

    useEffect(() => {
        if (loading) return
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })
        if (observerRef.current) {
            observer.observe(observerRef.current)
        }
        return () => observer.disconnect()
    }, [loading, hasMore])

    const toggleLike = (postId: number) => {
        setLikedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        )
    }

    return (
        <div className="space-y-6 pb-10">
            {posts.map((post, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                    <Image
                        src={post.image}
                        alt="post"
                        width={200}
                        height={100}
                        className="w-full h-full object-cover rounded-md"
                    />

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleLike(post.id)}>
                                <Heart
                                    className={`w-5 h-5 transition-colors ${likedPosts.includes(post.id)
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-gray-600'
                                        }`}
                                />
                            </button>
                            <MessageSquare className="w-5 h-5 text-gray-600" />
                            <Send className="w-5 h-5 text-gray-600" />
                        </div>
                        <Bookmark className="w-5 h-5 text-gray-600" />
                    </div>

                    <h2 className="text-lg font-semibold mt-2">{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            ))}

            {loading && (
                <div className="flex justify-center">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                </div>
            )}

            <div ref={observerRef} className="h-4" />
        </div>
    )
}
