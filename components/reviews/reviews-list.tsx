"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"
import RatingDisplay from "./rating-display"

interface Review {
  id: string
  rating: number
  feedback?: string
  created_at: string
  reviewer: {
    full_name: string
    role: "admin" | "freelancer"
  }
  job: {
    title: string
  }
}

interface ReviewsListProps {
  reviews: Review[]
  title?: string
}

export default function ReviewsList({ reviews, title = "Reviews" }: ReviewsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">Reviews will appear here after completed projects.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {review.reviewer.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.reviewer.full_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {review.reviewer.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  <RatingDisplay rating={review.rating} totalReviews={0} showText={false} />
                </div>

                <p className="text-sm text-muted-foreground">Project: {review.job.title}</p>

                {review.feedback && <p className="text-sm">{review.feedback}</p>}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
