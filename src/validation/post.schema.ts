import z from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(2, "Content is required"),
    image: z.any().refine((file) => file?.[0], "Profile picture is required").optional(),
});

export type PostFormvalue = z.infer<typeof postSchema>;

