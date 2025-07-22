// /app/api/me/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ user: null });

  const user = await User.findOne({ email: session.user.email }).select("_id username profilePicture");
  return NextResponse.json({ user });
}
