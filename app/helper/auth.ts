import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { User } from "@/types/auth"

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    return decoded
  } catch {
    return null
  }
}

