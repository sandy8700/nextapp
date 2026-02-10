import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { logoutAction } from "./action";

export default async function Dashboard() {
   const token = (await cookies()).get("token")?.value;

  if (!token) redirect("/auth/login");

  try {
    verifyToken(token);
  } catch {
    redirect("/auth/login");
  }
  
  return (
    <div className="flex w-full items-center justify-between p-3 md:p-5">
      <h1 className="text-2xl font-bold">Dashboard </h1>
      <form action={logoutAction}>
        <Button type="submit" variant="destructive">Logout</Button>
      </form>
    </div>
  );
}
