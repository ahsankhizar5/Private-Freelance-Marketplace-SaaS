import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"

export default async function AdminUsersPage() {
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

  // Get all users with their stats
  const { data: users } = await supabase
    .from("users")
    .select(`
      *,
      jobs_admin:jobs!jobs_admin_id_fkey(count),
      bids:bids!bids_freelancer_id_fkey(count),
      reviews_received:reviews!reviews_reviewee_id_fkey(rating)
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
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage all platform users</p>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              All Users ({users?.length || 0})
            </CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {users && users.length > 0 ? (
              <div className="space-y-4">
                {users.map((userData: any) => {
                  const avgRating = userData.reviews_received?.length
                    ? (
                        userData.reviews_received.reduce((sum: number, review: any) => sum + review.rating, 0) /
                        userData.reviews_received.length
                      ).toFixed(1)
                    : null

                  return (
                    <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{userData.full_name}</h3>
                          <Badge variant={userData.role === "admin" ? "destructive" : "default"}>{userData.role}</Badge>
                          {avgRating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{avgRating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Joined {new Date(userData.created_at).toLocaleDateString()}</span>
                          {userData.role === "admin" && <span>{userData.jobs_admin?.[0]?.count || 0} jobs posted</span>}
                          {userData.role === "freelancer" && (
                            <span>{userData.bids?.[0]?.count || 0} bids submitted</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/profile/${userData.id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground">No users have registered yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
