"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "@/app/store/authSlice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")

        if (!res.ok) return

        const data = await res.json()
        dispatch(setUser(data.user))
      } catch {
        console.log("Not logged in")
      }
    }

    fetchUser()
  }, [dispatch])

  return <>{children}</>
}