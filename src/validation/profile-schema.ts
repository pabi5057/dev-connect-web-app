import { z } from "zod"

export const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    contact: z.string().min(10, "Contact number is required"),
    dob: z.string().min(1, "Date of birth is required"),
    profilePicture: z
        .any()
        .refine((file) => file?.[0], "Profile picture is required"),
});

export type ProfileFormValues=z.infer<typeof profileSchema>