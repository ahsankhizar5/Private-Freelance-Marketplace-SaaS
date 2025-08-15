"use client"

import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  totalReviews: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function RatingDisplay({ rating, totalReviews, size = "md", showText = true }: RatingDisplayProps) {
  const starSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= Math.floor(rating)
      const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0

      return (
        <div key={index} className="relative">
          <Star className={`${starSize} text-gray-300`} />
          {isFilled && <Star className={`${starSize} text-yellow-400 fill-current absolute top-0 left-0`} />}
          {isHalfFilled && (
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className={`${starSize} text-yellow-400 fill-current`} />
            </div>
          )}
        </div>
      )
    })
  }

  if (rating === 0 && totalReviews === 0) {
    return (
      <div className={`flex items-center gap-1 text-muted-foreground ${textSize}`}>
        <div className="flex">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={`${starSize} text-gray-300`} />
          ))}
        </div>
        {showText && <span>No reviews yet</span>}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <div className="flex">{renderStars()}</div>
      {showText && (
        <span className="text-muted-foreground">
          {rating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  )
}
