import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, TrendingUp, Clock, Star, Users } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Getting Started",
    description: "Essential guides for new freelancers",
    articles: 24,
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    id: 2,
    name: "Client Management",
    description: "Tips for managing client relationships",
    articles: 18,
    icon: Users,
    color: "text-primary",
  },
  {
    id: 3,
    name: "Pricing & Contracts",
    description: "How to price your work and create contracts",
    articles: 15,
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    id: 4,
    name: "Marketing & Growth",
    description: "Grow your freelance business",
    articles: 21,
    icon: Star,
    color: "text-yellow-500",
  },
]

const featuredArticles = [
  {
    id: 1,
    title: "The Complete Guide to Freelance Pricing",
    description: "Learn how to price your services competitively while ensuring profitability",
    author: "Marcus Rodriguez",
    readTime: "12 min read",
    category: "Pricing & Contracts",
    views: 2847,
    likes: 156,
  },
  {
    id: 2,
    title: "Building Long-term Client Relationships",
    description: "Strategies for turning one-time clients into long-term partnerships",
    author: "Sarah Chen",
    readTime: "8 min read",
    category: "Client Management",
    views: 1923,
    likes: 98,
  },
  {
    id: 3,
    title: "Essential Tools for Remote Freelancers",
    description: "Must-have tools and software to boost your productivity",
    author: "Emily Watson",
    readTime: "15 min read",
    category: "Getting Started",
    views: 3156,
    likes: 203,
  },
]

const popularArticles = [
  { title: "How to Write Winning Proposals", views: 4521, category: "Marketing & Growth" },
  { title: "Managing Multiple Projects Effectively", views: 3892, category: "Client Management" },
  { title: "Tax Tips for Freelancers", views: 3654, category: "Getting Started" },
  { title: "Creating a Professional Portfolio", views: 3201, category: "Marketing & Growth" },
  { title: "Negotiating Better Rates", views: 2987, category: "Pricing & Contracts" },
]

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Comprehensive guides, tutorials, and resources to help you succeed as a freelancer
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles, guides, and tutorials..." className="pl-10 h-12 text-base" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
                <CardDescription>Find articles organized by topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/community/knowledge-base/${category.id}`}>
                      <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <category.icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{category.articles} articles</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Articles</CardTitle>
                <CardDescription>Hand-picked articles from our community experts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {featuredArticles.map((article) => (
                    <Link key={article.id} href={`/community/knowledge-base/articles/${article.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{article.category}</Badge>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">{article.title}</h3>
                        <p className="text-muted-foreground mb-3">{article.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>by {article.author}</span>
                          <div className="flex items-center space-x-4">
                            <span>{article.views.toLocaleString()} views</span>
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {article.likes}
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
            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Popular Articles</span>
                </CardTitle>
                <CardDescription>Most viewed this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularArticles.map((article, index) => (
                    <Link key={index} href={`/community/knowledge-base/articles/${index + 1}`}>
                      <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contribute */}
            <Card>
              <CardHeader>
                <CardTitle>Contribute to Knowledge Base</CardTitle>
                <CardDescription>Share your expertise with the community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have valuable insights to share? Help other freelancers by contributing to our knowledge base.
                </p>
                <Button className="w-full">Submit Article</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Articles</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contributors</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="font-semibold">89.2K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-semibold">+12 articles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
