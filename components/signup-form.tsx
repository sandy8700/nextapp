"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/authSlice";

export function SignupForm({ className, ...props }: React.ComponentProps<typeof Card>) {
                 const dispatch = useDispatch();

    const router = useRouter();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const form = new FormData(e.currentTarget);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                password: form.get("password"),
                confirmPassword: form.get("confirm-password"),
            }),
        });

        const data = await res.json();

        if (res.ok) {
            dispatch(setUser(data.user));
            toast.success(data.message);
            router.push("/auth/login");
        } else {
            toast.error(data.message);
        }
        setLoading(false)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your information below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input id="name" type="text" name="name" placeholder="Full Name" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    name="email"
                                    required
                                />

                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput id="password" type={show ? "text" : "password"} name="password" placeholder="******" required />
                                    <InputGroupAddon align="inline-end">
                                        <button
                                            type="button"
                                            onClick={() => setShow(!show)}
                                            className="cursor-pointer text-muted-foreground hover:text-foreground"
                                        >
                                            {show ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>

                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirm-password">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput id="confirm-password" type={confirmPassword ? "text" : "password"} name="confirm-password" placeholder="******" required />
                                    <InputGroupAddon align="inline-end">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmPassword(!confirmPassword)}
                                            className="cursor-pointer text-muted-foreground hover:text-foreground"
                                        >
                                            {confirmPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                            <FieldGroup>
                                <Field>
                                    <Button type="submit" disabled={loading}> {loading ? "Creating..." : "Create Account"}</Button>
                                    
                                    <FieldDescription className="px-6 text-center">
                                        Already have an account? <Link href="/auth/login">Login</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
