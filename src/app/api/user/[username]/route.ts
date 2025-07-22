import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { username: string } }) {
    const username = params.username;
    try {
        await connectDB();
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 })
        }

        return NextResponse.json({ user, success: true }, { status: 200 });
    } catch (error) {
        console.log(error);

    }
}

// export async function PATCH(req:Request,{params}:{params:{username:string}}){
//    const username=params.username;
//    const formdata=await req.formData();
//    const firstName=formdata.get("firstName");
//    const lastName=formdata.get("lastName");
   
//    try {
    
//    } catch (error) {
    
//    }
// }