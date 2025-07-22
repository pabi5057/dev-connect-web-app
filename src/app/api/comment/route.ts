import { connectDB } from "@/lib/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Comment from "@/lib/models/Comment";
import { authOptions } from "@/lib/auth/options";



export async function POST(req: Request,) {
    try {
        await connectDB();
        const formData = await req.formData();
        const session = await getServerSession(authOptions);

        const comment = formData.get("comment") as string;
        const postId = formData.get("postId") as string;

        if (!comment || !postId) {
            return NextResponse.json(
                { message: "Comment and postId are required", success: false },
                { status: 400 }
            );
        }

        const newComment = new Comment({
            comment,
            user: session?.user?.id,
            post: postId,
        });

        await newComment.save();

        return NextResponse.json({ message: "comment Added successfull", success: true }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Sever error", success: "false" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ message: "postId is required", success: false }, { status: 400 });
        }

        const comments = await Comment.find({ post: postId }).populate("user", "username");

        return NextResponse.json({ comments, success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
