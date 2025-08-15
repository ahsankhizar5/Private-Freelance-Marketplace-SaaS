"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface RatingFormProps {
  jobId: string
  revieweeId: string
  revieweeName: string
  reviewerRole: "admin" | "freelancer"
  onSuccess?: () => void
}

export default function RatingForm({ jobId, revieweeId, revieweeName, reviewerRole, onSuccess }: RatingFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setLoading(true)
    setError("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      // Insert the review
      const { error: insertError } = await supabase.from("reviews").insert({
        job_id: jobId,
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        rating: rating,
        feedback: feedback.trim() || null,
      })

      if (insertError) {
        throw insertError
      }

      // Update the reviewee's rating
      await updateUserRating(revieweeId)

      // Reset form and close dialog
      setRating(0)
      setFeedback("")
      setOpen(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRating = async (userId: string) => {
    // Calculate new average rating
    const { data: reviews } = await supabase.from("reviews").select("rating").eq("reviewee_id", userId)

    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      await supabase
        .from("users")
        .update({
          rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
          total_reviews: reviews.length,
        })
        .eq("id", userId)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= (hoveredRating || rating)

      return (
        <button
          key={index}
          type="button"
          className={`text-2xl transition-colors ${
            isFilled ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star className={`h-6 w-6 ${isFilled ? "fill-current" : ""}`} />
        </button>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Star className="h-4 w-4 mr-2" />
          Rate {revieweeName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate & Review</DialogTitle>
          <DialogDescription>Share your experience working with {revieweeName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 && `${rating} star${rating !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Feedback (Optional)
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`Share your experience working with ${revieweeName}...`}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || rating === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
