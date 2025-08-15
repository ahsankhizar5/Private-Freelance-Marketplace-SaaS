"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, DollarSign, Clock, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Bid {
  id: string
  proposal: string
  bid_amount: number
  estimated_completion_time?: number
  status: "pending" | "accepted" | "rejected"
  cover_letter?: string
  created_at: string
  users: {
    full_name: string
    rating: number
    total_reviews: number
    skills?: string[]
    hourly_rate?: number
  }
}

interface BidsListProps {
  bids: Bid[]
  jobId: string
}

export default function BidsList({ bids, jobId }: BidsListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleBidAction = async (bidId: string, action: "accepted" | "rejected") => {
    setLoading(bidId)

    try {
      const { error } = await supabase.from("bids").update({ status: action }).eq("id", bidId)

      if (error) throw error

      // If accepting a bid, update job status and reject other bids
      if (action === "accepted") {
        await supabase.from("jobs").update({ status: "in_progress" }).eq("id", jobId)

        await supabase.from("bids").update({ status: "rejected" }).eq("job_id", jobId).neq("id", bidId)
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating bid:", error)
    } finally {
      setLoading(null)
    }
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
        <p className="text-muted-foreground">Freelancers will start submitting proposals soon. Check back later!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {bids.map((bid) => (
        <Card key={bid.id} className="border-l-4 border-l-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {bid.users.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{bid.users.full_name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {bid.users.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {bid.users.rating.toFixed(1)} ({bid.users.total_reviews} reviews)
                        </span>
                      </div>
                    )}
                    {bid.users.hourly_rate && <span>${bid.users.hourly_rate}/hr</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    bid.status === "accepted" ? "default" : bid.status === "pending" ? "secondary" : "destructive"
                  }
                >
                  {bid.status}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(bid.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bid Details */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${bid.bid_amount}</span>
              </div>
              {bid.estimated_completion_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{bid.estimated_completion_time} days</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {bid.users.skills && bid.users.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {bid.users.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Proposal */}
            <div>
              <p className="text-sm font-medium mb-2">Proposal:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bid.proposal}</p>
            </div>

            {/* Cover Letter */}
            {bid.cover_letter && (
              <div>
                <p className="text-sm font-medium mb-2">Cover Letter:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bid.cover_letter}</p>
              </div>
            )}

            {/* Actions */}
            {bid.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleBidAction(bid.id, "accepted")}
                  disabled={loading === bid.id}
                  className="flex-1"
                >
                  Accept Proposal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBidAction(bid.id, "rejected")}
                  disabled={loading === bid.id}
                  className="flex-1"
                >
                  Decline
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
