"use client"

import { Button } from "@/components/ui/button"
import { Kanban } from "lucide-react"
import Link from "next/link"

interface WorkroomButtonProps {
  jobId: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function WorkroomButton({ jobId, variant = "outline", size = "sm", className }: WorkroomButtonProps) {
  return (
    <Link href={`/workroom/${jobId}`}>
      <Button variant={variant} size={size} className={className}>
        <Kanban className="h-4 w-4 mr-2" />
        Workroom
      </Button>
    </Link>
  )
}
