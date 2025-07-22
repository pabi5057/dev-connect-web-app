import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/config/db";

export async function POST(
    req: NextRequest,
    context: { params: { postId: string } }
) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        const post = await Post.findById(context.params.postId);
        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        const liked = post.likes.includes(user._id);
        if (liked) {
            post.likes.pull(user._id);
        } else {
            post.likes.push(user._id);
        }

        await post.save();

        return NextResponse.json({
            success: true,
            liked: !liked,
            totalLikes: post.likes.length,
        });
    } catch (err) {
        console.error("LIKE POST ERROR:", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
