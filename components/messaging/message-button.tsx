"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

interface MessageButtonProps {
  jobId: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function MessageButton({ jobId, variant = "outline", size = "sm", className }: MessageButtonProps) {
  return (
    <Link href={`/messages/${jobId}`}>
      <Button variant={variant} size={size} className={className}>
        <MessageCircle className="h-4 w-4 mr-2" />
        Messages
      </Button>
    </Link>
  )
}
