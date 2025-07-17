import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/config/db"
import { compare } from "bcryptjs"

import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import User from "@/lib/models/User"

// Extend the default token and session types
interface ExtendedToken extends JWT {
    id?: string;
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}

interface CustomUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  profilePicture: string
}



interface ExtendedSession extends Session {
    user: {
        name?: string | null;
        email?: string | null;
        id?: string;
        profilePicture?: string | null;
        firstName?: string;
        lastName?: string;
        username?: string;
    };
}

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing email or password")
                }

                await connectDB()

                const user = await User.findOne({ email: credentials.email })

                if (!user) {
                    throw new Error("No user found with this email.")
                }

                const isValid = await compare(credentials.password, user.password)
                if (!isValid) {
                    throw new Error("Invalid credentials.")
                }

                return {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as CustomUser;
                token.id = u.id;
                token.profilePicture = u.profilePicture;
                token.firstName = u.firstName;
                token.lastName = u.lastName;
                token.username = u.username;
            }
            return token
        },
        async session({ session, token }) {
            const typedSession = session as ExtendedSession
            typedSession.user.id = (token as ExtendedToken).id
            typedSession.user.profilePicture = (token as ExtendedToken).profilePicture
            typedSession.user.firstName=(token as ExtendedToken).firstName
            typedSession.user.lastName=(token as ExtendedToken).lastName
            typedSession.user.username=(token as ExtendedToken).username
            return typedSession
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
