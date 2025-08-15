import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, TrendingUp, DollarSign, Users, Calendar, Quote } from "lucide-react"
import Link from "next/link"

const successStories = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "From Solo Freelancer to Agency Owner",
    avatar: "/professional-woman-diverse.png",
    role: "Full-Stack Developer",
    joinDate: "January 2022",
    achievement: "Built a 5-person development agency",
    revenue: "$250K+ annual revenue",
    story:
      "When I joined FreelanceHub, I was a solo developer struggling to find quality clients. The platform's community and networking features helped me connect with other professionals and eventually build a team. Today, my agency serves 20+ clients worldwide.",
    metrics: {
      projectsCompleted: 127,
      clientRating: 4.9,
      teamSize: 5,
      yearsActive: 2,
    },
    tags: ["Web Development", "Team Building", "Business Growth"],
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    title: "Scaling Design Services Globally",
    avatar: "/professional-man-developer.png",
    role: "UI/UX Designer",
    joinDate: "March 2021",
    achievement: "Expanded to international markets",
    revenue: "$180K+ annual revenue",
    story:
      "FreelanceHub's global reach allowed me to work with clients from 15+ countries. The platform's project management tools and secure payment system made international collaboration seamless. I've grown from $30K to $180K annual revenue.",
    metrics: {
      projectsCompleted: 89,
      clientRating: 4.8,
      teamSize: 3,
      yearsActive: 3,
    },
    tags: ["UI/UX Design", "International", "Remote Work"],
  },
  {
    id: 3,
    name: "Emily Watson",
    title: "Building a Sustainable Creative Business",
    avatar: "/professional-woman-designer.png",
    role: "Brand Designer",
    joinDate: "June 2022",
    achievement: "Achieved work-life balance while growing income",
    revenue: "$120K+ annual revenue",
    story:
      "As a mother of two, I needed flexible work that didn't compromise on income. FreelanceHub's quality client base and efficient project matching helped me build a sustainable business working just 25 hours per week.",
    metrics: {
      projectsCompleted: 64,
      clientRating: 5.0,
      teamSize: 1,
      yearsActive: 2,
    },
    tags: ["Brand Design", "Work-Life Balance", "Flexibility"],
  },
]

const communityImpact = {
  totalFreelancers: 5247,
  successfulProjects: 12847,
  totalEarnings: "$2.4M+",
  averageRating: 4.8,
}

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Success Stories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how freelancers and businesses have transformed their careers and achieved remarkable success
            through our platform
          </p>
        </div>

        {/* Community Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Freelancers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityImpact.totalFreelancers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Growing every day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {communityImpact.successfulProjects.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">With 98% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityImpact.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">Earned by our community</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{communityImpact.averageRating}/5.0</div>
              <p className="text-xs text-muted-foreground">Client satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <div className="space-y-12">
          {successStories.map((story, index) => (
            <Card key={story.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Story Content */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                        <AvatarFallback>
                          {story.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">{story.title}</h2>
                        <p className="text-lg text-muted-foreground mb-2">
                          {story.name} • {story.role}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {story.joinDate}
                          </span>
                          <Badge variant="secondary">{story.achievement}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                      <p className="text-muted-foreground leading-relaxed pl-6 italic">{story.story}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Sidebar */}
                  <div className="bg-muted/20 p-8 border-l">
                    <h3 className="font-semibold text-foreground mb-6">Key Achievements</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">{story.revenue}</div>
                        <p className="text-sm text-muted-foreground">Annual Revenue</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xl font-bold text-foreground">{story.metrics.projectsCompleted}</div>
                          <p className="text-xs text-muted-foreground">Projects</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-foreground">{story.metrics.clientRating}</div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-foreground">{story.metrics.teamSize}</div>
                          <p className="text-xs text-muted-foreground">Team Size</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-foreground">{story.metrics.yearsActive}</div>
                          <p className="text-xs text-muted-foreground">Years Active</p>
                        </div>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/profile/${story.name.toLowerCase().replace(" ", "-")}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-primary/5 border-primary/20">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful freelancers who have transformed their careers on FreelanceHub. Your success
              story could be next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
