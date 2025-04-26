// components/hooks/use-toast.ts
"use client"

import { useContext } from "react"
import { ToastContext } from "../ui/toaster-context"

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
