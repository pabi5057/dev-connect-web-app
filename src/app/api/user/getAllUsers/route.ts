import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
       await connectDB()
        const users = await User.find({});     
        return NextResponse.json({ users, success: true }, { status: 200 });

    } catch (error) {
        console.log(error);
    }

}