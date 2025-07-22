"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Heart, MessageSquare, Send, Bookmark, Loader2 } from "lucide-react";
import { Post } from "@/types/post.type";


export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (page: number, limit = 5) => {
    try {
      const res = await axios.get(`/api/posts?page=${page}&limit=${limit}`);
      return res.data?.posts || [];
    } catch (err) {
      console.error("Error fetching posts", err);
      return [];
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/me");
      setUserId(res.data?.user?._id);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const res = await axios.get(`/api/comment?postId=${postId}`);
      const comments = res.data?.comments?.map((c: { comment: string }) => c.comment) || [];

      setCommentsMap((prev) => ({
        ...prev,
        [postId]: comments,
      }));
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const newPosts = await fetchPosts(page);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const unique = newPosts.filter((p: Post) => !existingIds.has(p._id));
        return [...prev, ...unique];
      });

      for (const post of newPosts) {
        await fetchComments(post._id);
      }
      setHasMore(newPosts.length > 0);
      setLoading(false);
    };
    loadPosts();
    fetchUser();
  }, [page]);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) setPage((prev) => prev + 1);
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const handleLike = async (postId: string) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`);
      const { liked } = res.data;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
              ...post,
              likes: liked
                ? [...(post.likes || []), userId!]
                : post.likes?.filter((id) => id !== userId),
            }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    try {
      const formData = new FormData();
      formData.append("comment", comment);
      formData.append("postId", postId);

      const res = await axios.post(`/api/comment`, formData);

      if (res.data.success) {
        setCommentsMap((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), comment],
        }));
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {posts.map((post) => {
        const isLiked = post.likes?.includes(userId || "");

        return (
          <div key={post._id} className="p-4 border rounded-lg shadow-sm bg-white">
            <Image
              src={post.image}
              alt="post"
              width={400}
              height={300}
              className="w-full h-60 object-cover rounded"
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <button onClick={() => handleLike(post._id)}>
                  <Heart
                    className={`w-5 h-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                  />
                </button>
                <span className="text-xs ml-1">{post.likes?.length} Likes</span>
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <Send className="w-5 h-5 text-gray-600" />
              </div>
              <Bookmark className="w-5 h-5 text-gray-600" />
            </div>

            <h2 className="text-lg font-semibold mt-2">{post.title}</h2>
            <p>{post.content}</p>

            {/* Comment input (controlled) */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add comment..."
                value={commentInputs[post._id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                className="flex-1 border-b-2 focus:outline-none px-2 py-1 text-sm"
              />
              <button
                onClick={() => handleAddComment(post._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Add
              </button>
            </div>

            {/* Comment list */}
            <div className="mt-3 space-y-2">
              {(commentsMap[post._id] || []).map((comment, i) => (
                <div key={i} className="text-sm text-gray-800 bg-gray-100 p-2 rounded">
                  {comment}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      )}

      <div ref={observerRef} className="h-4" />
    </div>
  );
}
