import { connectDB } from "@/lib/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import Post from "@/lib/models/Post";
import { authOptions } from "@/lib/auth/options";


const uploadToCloudinary = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "posts" }, (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            })
            .end(buffer);
    });
};

export async function POST(req: Request) {
    const formData = await req.formData();

    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const imageFile = formData.get("image") as File | null;

        let imageUrl = "";

        if (imageFile && typeof imageFile === "object") {
            imageUrl = await uploadToCloudinary(imageFile);
        }

        if (!title || !content) {
            return NextResponse.json(
                { message: "All fields are required.", success: false },
                { status: 400 }
            );
        }

        const newPost = new Post({
            title,
            content,
            image: imageUrl,
            user: session?.user?.id,
        });

        await newPost.save();

        return NextResponse.json(
            { message: "Post created successfully", post: newPost, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }


}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "5");
        const skip = (page - 1) * limit;

        const posts = await Post.find({})
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit)
            .populate("user", "username profilePicture"); 

        return NextResponse.json({ posts, success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error!", success: false },
            { status: 500 }
        );
    }
}
