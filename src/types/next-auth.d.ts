// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      username: string
      email: string
      profilePicture: string
    }
  }

  interface User {
    id: string
    firstName: string
    lastName: string
    username: string
    email: string
    profilePicture: string
  }
}
