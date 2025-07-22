import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

// Uploads a file to Cloudinary and returns the secure URL
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


export async function PUT(req: Request, { params }: { params: { username: string } }) {
    try {
        const { username } = params;
        const formData = await req.formData();

        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const contact = formData.get("contact") as string;
        const dob = formData.get("dob") as string;
        const imageFile = formData.get("image") as File | null;

        if (!firstName || !lastName || !email || !contact || !dob) {
            return NextResponse.json(
                { message: "All fields are required.", success: false },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        // Handle optional profile image upload
        let imageUrl = user.profilePicture;
        if (imageFile && typeof imageFile === "object") {
            imageUrl = await uploadToCloudinary(imageFile);
        }

        // Update user details
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.contact = contact;
        user.dob = dob;
        user.profilePicture = imageUrl;

        await user.save();

        return NextResponse.json(
            { message: "Profile updated successfully", user, success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
