import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MessageSquare,
  Shield,
  BarChart3,
  Users,
  Clock,
  Star,
  Zap,
  CheckCircle,
  Globe,
  CreditCard,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      icon: Search,
      title: "Smart Job Matching",
      description:
        "AI-powered matching system connects you with the perfect projects and talent based on skills, experience, and preferences.",
      category: "Core Features",
    },
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description:
        "Seamless communication with built-in chat, file sharing, and project discussions to keep everyone aligned.",
      category: "Communication",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Protected transactions with escrow services, milestone payments, and dispute resolution for peace of mind.",
      category: "Security",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive insights into project performance, earnings, and growth metrics to optimize your success.",
      category: "Analytics",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built-in project management tools with task tracking, team coordination, and progress monitoring.",
      category: "Collaboration",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Integrated time tracking with automated invoicing and detailed reporting for accurate project billing.",
      category: "Productivity",
    },
    {
      icon: Star,
      title: "Rating System",
      description:
        "Transparent feedback system that builds trust and helps maintain high-quality standards across the platform.",
      category: "Quality",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Stay updated with real-time alerts for new opportunities, messages, and project milestones.",
      category: "Communication",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Rigorous vetting process and quality checks ensure only top-tier professionals join our community.",
      category: "Quality",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with talent and opportunities worldwide with multi-currency support and localization.",
      category: "Global",
    },
    {
      icon: CreditCard,
      title: "Flexible Billing",
      description: "Multiple payment options, subscription plans, and custom billing arrangements to fit your needs.",
      category: "Billing",
    },
    {
      icon: Award,
      title: "Certification System",
      description: "Earn and showcase verified skills and achievements to stand out in the competitive marketplace.",
      category: "Recognition",
    },
  ]

  const categories = [...new Set(features.map((f) => f.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            FreelanceHub
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-gray-600 hover:text-green-600">
              Pricing
            </Link>
            <Link href="/features" className="text-green-600 font-medium">
              Features
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-green-600">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-green-600">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">Platform Features</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="text-green-600"> Succeed</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the comprehensive suite of tools and features designed to streamline your freelancing journey and
            maximize your potential.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {categories.map((category, categoryIndex) => (
            <div key={category} className={categoryIndex > 0 ? "mt-16" : ""}>
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4 border-green-200 text-green-700">
                  {category}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features
                  .filter((feature) => feature.category === category)
                  .map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with your favorite tools and services to create a unified workflow.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {[
              "Slack",
              "Zoom",
              "Google Drive",
              "Dropbox",
              "Trello",
              "Asana",
              "PayPal",
              "Stripe",
              "QuickBooks",
              "Calendly",
              "GitHub",
              "Figma",
            ].map((integration, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{integration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using FreelanceHub to grow their careers and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
