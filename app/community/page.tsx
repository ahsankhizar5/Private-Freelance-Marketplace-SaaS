import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, BookOpen, Calendar, TrendingUp, Star, Plus } from "lucide-react"
import Link from "next/link"

export default async function CommunityPage() {
  const supabase = createClient()

  // Mock community data (in real app, this would come from database)
  const communityStats = {
    totalMembers: 5247,
    activeDiscussions: 342,
    knowledgeArticles: 156,
    upcomingEvents: 8,
  }

  const forumCategories = [
    {
      id: 1,
      name: "General Discussion",
      description: "General topics and community chat",
      posts: 1234,
      lastActivity: "2 minutes ago",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      id: 2,
      name: "Job Opportunities",
      description: "Share and discuss job opportunities",
      posts: 856,
      lastActivity: "5 minutes ago",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      id: 3,
      name: "Skill Development",
      description: "Learn new skills and share knowledge",
      posts: 642,
      lastActivity: "12 minutes ago",
      icon: BookOpen,
      color: "text-purple-500",
    },
    {
      id: 4,
      name: "Success Stories",
      description: "Share your freelancing success stories",
      posts: 298,
      lastActivity: "1 hour ago",
      icon: Star,
      color: "text-yellow-500",
    },
  ]

  const recentDiscussions = [
    {
      id: 1,
      title: "Best practices for client communication",
      author: "Sarah Chen",
      avatar: "/professional-woman-diverse.png",
      category: "General Discussion",
      replies: 23,
      likes: 45,
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "How to price your freelance services effectively",
      author: "Marcus Rodriguez",
      avatar: "/professional-man-developer.png",
      category: "Skill Development",
      replies: 18,
      likes: 67,
      timeAgo: "4 hours ago",
    },
    {
      id: 3,
      title: "Remote work tools that changed my productivity",
      author: "Emily Watson",
      avatar: "/professional-woman-designer.png",
      category: "Success Stories",
      replies: 31,
      likes: 89,
      timeAgo: "6 hours ago",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Freelancer Networking Meetup",
      date: "2025-08-10",
      time: "6:00 PM EST",
      attendees: 45,
      type: "Virtual",
    },
    {
      id: 2,
      title: "Web Development Workshop",
      date: "2025-08-12",
      time: "2:00 PM EST",
      attendees: 78,
      type: "Online",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">FreelanceHub Community</h1>
          <p className="text-muted-foreground">
            Connect, learn, and grow with fellow freelancers and businesses in our thriving community
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityStats.totalMembers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityStats.activeDiscussions}</div>
              <p className="text-xs text-muted-foreground">+8% this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityStats.knowledgeArticles}</div>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityStats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Forum Categories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Discussion Forums</CardTitle>
                  <CardDescription>Join conversations in our community forums</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/community/forums/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forumCategories.map((category) => (
                    <Link key={category.id} href={`/community/forums/${category.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <category.icon className={`h-5 w-5 ${category.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{category.posts} posts</p>
                          <p className="text-xs text-muted-foreground">{category.lastActivity}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>Latest conversations from the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDiscussions.map((discussion) => (
                    <Link key={discussion.id} href={`/community/discussions/${discussion.id}`}>
                      <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Avatar>
                          <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.author} />
                          <AvatarFallback>
                            {discussion.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">{discussion.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>by {discussion.author}</span>
                            <Badge variant="secondary">{discussion.category}</Badge>
                            <span>{discussion.timeAgo}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {discussion.replies} replies
                            </span>
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {discussion.likes} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Events</span>
                </CardTitle>
                <CardDescription>Don't miss these community events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">{event.title}</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </p>
                        <p>
                          {event.attendees} attending • {event.type}
                        </p>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Join Event
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/community/events">View All Events</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/community/knowledge-base">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Knowledge Base
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/community/members">
                      <Users className="h-4 w-4 mr-2" />
                      Member Directory
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/community/success-stories">
                      <Star className="h-4 w-4 mr-2" />
                      Success Stories
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/community/guidelines">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Community Guidelines
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Spotlight */}
            <Card>
              <CardHeader>
                <CardTitle>Community Spotlight</CardTitle>
                <CardDescription>Featured member of the month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src="/professional-woman-diverse.png" alt="Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">Sarah Chen</h3>
                  <p className="text-sm text-muted-foreground mb-3">Full-Stack Developer</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "FreelanceHub helped me grow from a solo freelancer to running a successful development agency with
                    5 team members."
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 bg-transparent" asChild>
                    <Link href="/profile/sarah-chen">View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
