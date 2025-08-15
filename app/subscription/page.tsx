import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Calendar, TrendingUp, Briefcase, MessageSquare, BarChart3, Crown } from "lucide-react"
import Link from "next/link"

export default async function SubscriptionPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Mock subscription data (in real app, this would come from payment provider)
  const subscription = {
    plan: "Professional",
    status: "active",
    nextBilling: "2024-02-15",
    amount: 29,
    features: {
      projectApplications: { used: 15, limit: -1 }, // -1 means unlimited
      messaging: { used: 45, limit: -1 },
      analytics: true,
      prioritySupport: true,
    },
  }

  const usageData = [
    {
      name: "Project Applications",
      used: subscription.features.projectApplications.used,
      limit: subscription.features.projectApplications.limit,
      icon: Briefcase,
    },
    {
      name: "Messages Sent",
      used: subscription.features.messaging.used,
      limit: subscription.features.messaging.limit,
      icon: MessageSquare,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your plan, billing, and usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <span>Current Plan</span>
                    </CardTitle>
                    <CardDescription>Your active subscription details</CardDescription>
                  </div>
                  <Badge variant="default">{subscription.plan}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">${subscription.amount}</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground mb-1 capitalize">{subscription.status}</div>
                    <p className="text-sm text-muted-foreground">Status</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground mb-1">
                      {new Date(subscription.nextBilling).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Next billing</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/pricing">Change Plan</Link>
                  </Button>
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Billing History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Usage This Month</span>
                </CardTitle>
                <CardDescription>Track your feature usage and limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {usageData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.used} {item.limit === -1 ? "/ Unlimited" : `/ ${item.limit}`}
                        </span>
                      </div>
                      {item.limit !== -1 && <Progress value={(item.used / item.limit) * 100} className="h-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Features */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <CardDescription>What's included in your {subscription.plan} plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Unlimited project applications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Advanced messaging & video calls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Priority in search results</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Advanced analytics dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Custom portfolio showcase</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full" asChild>
                    <Link href="/pricing">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Link>
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
