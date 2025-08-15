import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Briefcase, Users, DollarSign, TrendingUp, Activity, Target } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { UserGrowthChart } from "@/components/analytics/user-growth-chart"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verify user is admin
  const { data: profile } = await supabase.from("users").select("role, full_name").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/freelancer/dashboard")
  }

  // Platform-wide stats
  const { data: allJobs } = await supabase.from("jobs").select("status, created_at, budget_min, budget_max")
  const { data: allUsers } = await supabase.from("users").select("role, created_at")
  const { data: allBids } = await supabase.from("bids").select("status, amount, created_at")
  const { data: allReviews } = await supabase.from("reviews").select("rating, created_at")
  const { data: allTasks } = await supabase.from("tasks").select("status, created_at")

  // Calculate platform metrics
  const totalJobs = allJobs?.length || 0
  const activeJobs = allJobs?.filter((job) => job.status === "open" || job.status === "in_progress").length || 0
  const completedJobs = allJobs?.filter((job) => job.status === "completed").length || 0
  const totalFreelancers = allUsers?.filter((user) => user.role === "freelancer").length || 0
  const totalAdmins = allUsers?.filter((user) => user.role === "admin").length || 0
  const totalBids = allBids?.length || 0
  const acceptedBids = allBids?.filter((bid) => bid.status === "accepted").length || 0
  const avgRating = allReviews?.length
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : "0"

  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const jobsThisMonth = allJobs?.filter((job) => new Date(job.created_at) >= lastMonth).length || 0
  const usersThisMonth = allUsers?.filter((user) => new Date(user.created_at) >= lastMonth).length || 0
  const bidsThisWeek = allBids?.filter((bid) => new Date(bid.created_at) >= lastWeek).length || 0

  // Calculate revenue metrics
  const totalRevenue = acceptedBids * 50 // Assuming $50 average platform fee
  const monthlyRevenue =
    allBids?.filter((bid) => bid.status === "accepted" && new Date(bid.created_at) >= lastMonth).length * 50 || 0

  // Calculate completion rate
  const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0

  // Recent activity
  const { data: recentJobs } = await supabase
    .from("jobs")
    .select(`
      *,
      users!jobs_admin_id_fkey(full_name),
      bids(count)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">FreelanceHub Admin</h1>
            <p className="text-muted-foreground">Platform Administration Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin/users">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/jobs/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-primary" />${monthlyRevenue} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeJobs}</div>
              <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalFreelancers + totalAdmins}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-primary" />+{usersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{avgRating}/5.0</div>
              <p className="text-xs text-muted-foreground">
                {totalBids > 0 ? Math.round((acceptedBids / totalBids) * 100) : 0}% bid acceptance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueChart data={allBids || []} />
          <UserGrowthChart data={allUsers || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AnalyticsCharts jobs={allJobs || []} bids={allBids || []} reviews={allReviews || []} />
          </div>
          <PerformanceMetrics
            totalJobs={totalJobs}
            completedJobs={completedJobs}
            totalBids={totalBids}
            acceptedBids={acceptedBids}
            avgRating={Number.parseFloat(avgRating)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Latest job postings across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {recentJobs && recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          by {job.users?.full_name} • {job.bids?.[0]?.count || 0} bids
                        </p>
                        <Badge
                          variant={
                            job.status === "open" ? "default" : job.status === "completed" ? "secondary" : "outline"
                          }
                          className="mt-1"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No jobs posted yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>New user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers && recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{user.full_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant={user.role === "admin" ? "destructive" : "default"} className="mt-1">
                          {user.role}
                        </Badge>
                      </div>
                      <Link href={`/profile/${user.id}`}>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No users registered yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Manage All Users
                </Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View All Jobs
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Platform Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
