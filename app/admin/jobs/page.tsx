import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"

export default async function AdminJobsPage() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verify user is admin
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/freelancer/dashboard")
  }

  // Get all jobs with admin info and bid counts
  const { data: jobs } = await supabase
    .from("jobs")
    .select(`
      *,
      users!jobs_admin_id_fkey(full_name),
      bids(count)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Jobs</h1>
              <p className="text-muted-foreground">Manage all platform jobs</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              All Jobs ({jobs?.length || 0})
            </CardTitle>
            <CardDescription>View and manage all jobs posted on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge
                          variant={
                            job.status === "open" ? "default" : job.status === "completed" ? "secondary" : "outline"
                          }
                        >
                          {job.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">by {job.users?.full_name}</span>
                        <span className="text-sm text-muted-foreground">{job.bids?.[0]?.count || 0} bids</span>
                        {job.budget_min && job.budget_max && (
                          <span className="text-sm text-muted-foreground">
                            ${job.budget_min} - ${job.budget_max}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">No jobs have been posted yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
