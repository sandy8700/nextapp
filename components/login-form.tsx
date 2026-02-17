"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon} from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group" 
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success("Login Successful!", {
        description: "Welcome back!",
      });
      login(data.user);
      setTimeout(() => {
        router.push("/");
        router.refresh(); 
      }, 800);
    } else {
      toast.error("Login Failed!", {
        description: data.message,
      })
    }

    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <InputGroup>
                  <InputGroupInput id="password" type={show ? "text" : "password" } name="password" placeholder="******" required />
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
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm text-end underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
