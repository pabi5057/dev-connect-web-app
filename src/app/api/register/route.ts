import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const uploadToCloudinary = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "profile" }, (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            })
            .end(buffer);
    });
};

export async function POST(req: Request) {
    try {

        const formData = await req.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get("password") as string;
        const imageFile = formData.get("image") as File | null;


        if (!firstName || !lastName || !username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required.", success: false },
                { status: 400 }
            );
        }

        let imageUrl = "";
        if (imageFile && typeof imageFile === "object") {
            imageUrl = await uploadToCloudinary(imageFile);
        }

        await connectDB();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists", success: false }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            profilePicture: imageUrl
        });
        await newUser.save();
        return NextResponse.json(
            { message: "User created successfully", user: newUser, success: true },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
}