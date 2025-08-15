import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Briefcase, Clock, Star, DollarSign } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"

export default async function FreelancerDashboard() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verify user is freelancer
  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name, rating, total_reviews")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "freelancer") {
    redirect("/admin/dashboard")
  }

  // Get freelancer's bids
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      *,
      jobs(title, status, budget_min, budget_max)
    `)
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get available jobs (not applied to)
  const { data: availableJobs } = await supabase
    .from("jobs")
    .select(`
      *,
      bids!left(freelancer_id)
    `)
    .eq("status", "open")
    .is("bids.freelancer_id", null)
    .order("created_at", { ascending: false })
    .limit(6)

  // Get bid stats
  const { data: bidStats } = await supabase.from("bids").select("status").eq("freelancer_id", user.id)

  const totalBids = bidStats?.length || 0
  const acceptedBids = bidStats?.filter((bid) => bid.status === "accepted").length || 0
  const pendingBids = bidStats?.filter((bid) => bid.status === "pending").length || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">FreelanceHub</h1>
            <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/freelancer/jobs">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
            <form action={signOut}>
              <Button variant="outline" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBids}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBids}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalBids > 0 ? Math.round((acceptedBids / totalBids) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.rating > 0 ? profile.rating.toFixed(1) : "N/A"}</div>
              <p className="text-xs text-muted-foreground">{profile.total_reviews} reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bids */}
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Bids</CardTitle>
              <CardDescription>Track your proposal status</CardDescription>
            </CardHeader>
            <CardContent>
              {bids && bids.length > 0 ? (
                <div className="space-y-4">
                  {bids.map((bid: any) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{bid.jobs?.title}</h4>
                        <p className="text-sm text-muted-foreground">Bid: ${bid.bid_amount}</p>
                      </div>
                      <Badge
                        variant={
                          bid.status === "accepted" ? "default" : bid.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {bid.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No bids submitted yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Available Jobs</CardTitle>
              <CardDescription>New opportunities for you</CardDescription>
            </CardHeader>
            <CardContent>
              {availableJobs && availableJobs.length > 0 ? (
                <div className="space-y-4">
                  {availableJobs.slice(0, 3).map((job: any) => (
                    <div key={job.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">{job.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          ${job.budget_min} - ${job.budget_max}
                        </span>
                        <Link href={`/freelancer/jobs/${job.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No available jobs right now</p>
                </div>
              )}
              <div className="mt-4">
                <Link href="/freelancer/jobs">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
