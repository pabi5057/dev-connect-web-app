import { z } from "zod"

export const userSchema=z.object({
    firstName:z.string().min(1,"First name is required"),
    lastName:z.string().min(1,"Last name is required"),
    username:z.string().min(1,"Username is required"),
    email:z.email("First name is required"),
    password:z.string().min(1,"Password is required"),
     profilePicture: z
        .any()
        .refine((file) => file?.[0], "Profile picture is required").optional(),
});

export type userFormValues=z.infer<typeof userSchema>

export const loginSchema=z.object({
    email:z.email("First name is required"),
    password:z.string().min(1,"Password is required"),
});

export type loginFormValues=z.infer<typeof loginSchema>