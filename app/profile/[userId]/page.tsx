import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, LinkIcon, Github, Linkedin, DollarSign } from "lucide-react"
import Link from "next/link"
import RatingDisplay from "@/components/reviews/rating-display"
import ReviewsList from "@/components/reviews/reviews-list"

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect("/auth/login")
  }

  // Get profile user
  const { data: profileUser } = await supabase.from("users").select("*").eq("id", params.userId).single()

  if (!profileUser) {
    notFound()
  }

  // Get reviews for this user
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:users!reviews_reviewer_id_fkey(full_name, role),
      job:jobs!reviews_job_id_fkey(title)
    `)
    .eq("reviewee_id", params.userId)
    .order("created_at", { ascending: false })

  // Get job statistics
  let jobStats = null
  if (profileUser.role === "admin") {
    const { data: adminJobs } = await supabase.from("jobs").select("status").eq("admin_id", params.userId)

    jobStats = {
      total: adminJobs?.length || 0,
      completed: adminJobs?.filter((job) => job.status === "completed").length || 0,
    }
  } else {
    const { data: freelancerBids } = await supabase
      .from("bids")
      .select(`
        status,
        jobs!inner(status)
      `)
      .eq("freelancer_id", params.userId)
      .eq("status", "accepted")

    jobStats = {
      total: freelancerBids?.length || 0,
      completed: freelancerBids?.filter((bid) => bid.jobs.status === "completed").length || 0,
    }
  }

  const isOwnProfile = currentUser.id === params.userId

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {isOwnProfile ? "Your Profile" : `${profileUser.full_name}'s Profile`}
            </h1>
            <Link href={profileUser.role === "admin" ? "/admin/dashboard" : "/freelancer/dashboard"}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">
                    {profileUser.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{profileUser.full_name}</CardTitle>
                <CardDescription>
                  <Badge variant={profileUser.role === "admin" ? "default" : "secondary"}>
                    {profileUser.role === "admin" ? "Project Owner" : "Freelancer"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="text-center">
                  <RatingDisplay rating={profileUser.rating} totalReviews={profileUser.total_reviews} size="lg" />
                </div>

                {/* Bio */}
                {profileUser.bio && (
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">{profileUser.bio}</p>
                  </div>
                )}

                {/* Location */}
                {profileUser.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}

                {/* Hourly Rate (for freelancers) */}
                {profileUser.role === "freelancer" && profileUser.hourly_rate && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">${profileUser.hourly_rate}/hour</span>
                  </div>
                )}

                {/* Links */}
                <div className="space-y-2">
                  {profileUser.portfolio_url && (
                    <a
                      href={profileUser.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Portfolio
                    </a>
                  )}
                  {profileUser.linkedin_url && (
                    <a
                      href={profileUser.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {profileUser.github_url && (
                    <a
                      href={profileUser.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills (for freelancers) */}
            {profileUser.role === "freelancer" && profileUser.skills && profileUser.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {profileUser.role === "admin" ? "Projects Posted" : "Projects Completed"}
                  </span>
                  <span className="font-medium">{jobStats?.completed || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Reviews</span>
                  <span className="font-medium">{profileUser.total_reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium">{new Date(profileUser.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2">
            <ReviewsList reviews={reviews || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
