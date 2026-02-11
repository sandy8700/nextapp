"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

export default function ResetPasswordPage({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const password = form.get("password");
        const confirm = form.get("confirm-password");

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                password,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success(data.message || "Password updated 🎉");
            router.push("/auth/login");
        } else {
            toast.error(data.message);
        }

        setLoading(false);
    }

    if (!token) {
        return (
            <div className="text-center mt-20 text-red-500">
                Invalid or expired reset link
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>

                            <Field>
                                <FieldLabel htmlFor="password">
                                    New Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput id="password" type={show ? "text" : "password"} name="password" placeholder="Enter new password" required />
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
                                <FieldLabel htmlFor="confirm">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput id="confirm-password" type={confirmPassword ? "text" : "password"} name="confirm-password" placeholder="Confirm password" required />
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

                            <Field>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </Button>
                            </Field>

                            <Field>
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-muted-foreground underline text-center block"
                                >
                                    Back to login
                                </Link>
                            </Field>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}