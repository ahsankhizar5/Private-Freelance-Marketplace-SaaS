"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import RatingForm from "./rating-form"

interface JobCompletionRatingProps {
  jobId: string
  currentUserId: string
  currentUserRole: "admin" | "freelancer"
  otherUserId: string
  otherUserName: string
  jobTitle: string
}

export default function JobCompletionRating({
  jobId,
  currentUserId,
  currentUserRole,
  otherUserId,
  otherUserName,
  jobTitle,
}: JobCompletionRatingProps) {
  const [hasRated, setHasRated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkIfRated()
  }, [jobId, currentUserId, otherUserId])

  const checkIfRated = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id")
        .eq("job_id", jobId)
        .eq("reviewer_id", currentUserId)
        .eq("reviewee_id", otherUserId)
        .single()

      setHasRated(!!data)
    } catch (error) {
      setHasRated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingSuccess = () => {
    setHasRated(true)
  }

  if (loading) {
    return null
  }

  if (hasRated) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Review Submitted</p>
            <p className="text-sm text-green-600">Thank you for rating {otherUserName}!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Star className="h-5 w-5" />
          Project Completed!
        </CardTitle>
        <CardDescription className="text-blue-600">
          How was your experience working with {otherUserName} on "{jobTitle}"?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RatingForm
          jobId={jobId}
          revieweeId={otherUserId}
          revieweeName={otherUserName}
          reviewerRole={currentUserRole}
          onSuccess={handleRatingSuccess}
        />
      </CardContent>
    </Card>
  )
}
