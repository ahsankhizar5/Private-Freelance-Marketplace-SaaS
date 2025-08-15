import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, DollarSign, Search } from "lucide-react"
import Link from "next/link"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { search?: string; skill?: string }
}) {
  const supabase = createClient()

  // Get current user and verify freelancer role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "freelancer") {
    redirect("/admin/dashboard")
  }

  // Build query for jobs
  let query = supabase
    .from("jobs")
    .select(`
      *,
      users!jobs_admin_id_fkey(full_name),
      bids!left(id, freelancer_id)
    `)
    .eq("status", "open")

  // Filter out jobs the user has already bid on
  const { data: userBids } = await supabase.from("bids").select("job_id").eq("freelancer_id", user.id)

  const bidJobIds = userBids?.map((bid) => bid.job_id) || []

  if (bidJobIds.length > 0) {
    query = query.not("id", "in", `(${bidJobIds.join(",")})`)
  }

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  // Apply skill filter
  if (searchParams.skill) {
    query = query.contains("skills_required", [searchParams.skill])
  }

  const { data: jobs } = await query.order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Browse Jobs</h1>
              <p className="text-muted-foreground">Find your next opportunity</p>
            </div>
            <Link href="/freelancer/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex gap-4">
              <div className="flex-1">
                <Input
                  name="search"
                  placeholder="Search by title or description..."
                  defaultValue={searchParams.search}
                />
              </div>
              <div className="w-48">
                <Input name="skill" placeholder="Filter by skill..." defaultValue={searchParams.skill} />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job: any) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base line-clamp-3">{job.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Budget and Timeline */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {job.budget_min && job.budget_max && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            ${job.budget_min} - ${job.budget_max}
                          </span>
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      {job.job_type && (
                        <Badge variant="outline" className="text-xs">
                          {job.job_type === "fixed" ? "Fixed Price" : "Hourly"}
                        </Badge>
                      )}
                      {job.experience_level && (
                        <Badge variant="outline" className="text-xs">
                          {job.experience_level}
                        </Badge>
                      )}
                    </div>

                    {/* Skills */}
                    {job.skills_required && job.skills_required.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Skills required:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills_required.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Posted by */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Posted by {job.users?.full_name} • {new Date(job.created_at).toLocaleDateString()}
                      </div>
                      <Link href={`/freelancer/jobs/${job.id}`}>
                        <Button>View Details & Apply</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  {searchParams.search || searchParams.skill
                    ? "Try adjusting your search criteria"
                    : "Check back later for new opportunities"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
