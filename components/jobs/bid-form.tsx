"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface BidFormProps {
  jobId: string
}

export default function BidForm({ jobId }: BidFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [bidAmount, setBidAmount] = useState("")
  const [proposal, setProposal] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const bidData = {
        job_id: jobId,
        freelancer_id: user.id,
        proposal: proposal.trim(),
        bid_amount: Number.parseFloat(bidAmount),
        cover_letter: coverLetter.trim() || null,
        estimated_completion_time: estimatedTime ? Number.parseInt(estimatedTime) : null,
        status: "pending",
      }

      const { error: insertError } = await supabase.from("bids").insert(bidData)

      if (insertError) {
        throw insertError
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to submit bid")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium mb-2">
              Your Bid Amount (USD) *
            </label>
            <Input
              id="bidAmount"
              type="number"
              step="0.01"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="e.g., 500"
              required
            />
          </div>

          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium mb-2">
              Estimated Completion Time (days)
            </label>
            <Input
              id="estimatedTime"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g., 7"
            />
          </div>

          <div>
            <label htmlFor="proposal" className="block text-sm font-medium mb-2">
              Project Proposal *
            </label>
            <Textarea
              id="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Describe your approach to this project..."
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium mb-2">
              Cover Letter
            </label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the client why you're the right fit..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Proposal...
              </>
            ) : (
              "Submit Proposal"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
