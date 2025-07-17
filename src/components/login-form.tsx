"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { loginFormValues, loginSchema } from "@/validation/user-schema"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LoginForm = () => {
    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: loginFormValues) => {
        const res = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (res?.error) {
            setErrorMsg("Invalid email or password.")
            toast.error(errorMsg);
        } else {
            toast.success("Login successfully!")
            router.push("/")
        }
    }


    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto  p-6 bg-white shadow-md rounded-md space-y-4"
            >
                <h2 className="text-xl font-semibold">Login</h2>

                <div className="">
                    <Label className="mb-2">Email</Label>
                    <Input type="email" {...register("email")} placeholder="Enter Email" />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="">
                    <Label className="mb-2">Password</Label>
                    <Input {...register("password")} placeholder="Enter password" />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <Button variant="destructive" type="submit" className="">
                    Login
                </Button>

            </form>
            <div className="max-w-md mx-auto mt-2">
                <p>Create an account ? <Link className="text-blue-500" href="/signup">signup</Link></p>
            </div>
        </>
    )
}

export default LoginForm;
