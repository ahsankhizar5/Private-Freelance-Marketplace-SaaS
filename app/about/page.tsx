import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
            <Link href="/features" className="text-gray-600 hover:text-green-600">
              Features
            </Link>
            <Link href="/about" className="text-green-600 font-medium">
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
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">About FreelanceHub</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connecting Talent with
            <span className="text-green-600"> Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're building the future of freelancing by creating a trusted, efficient, and growth-focused platform where
            businesses and talented professionals thrive together.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize the freelancing industry by creating a platform that prioritizes quality, trust, and
                mutual success. We believe that when businesses and freelancers have the right tools and environment,
                extraordinary things happen.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Community First</h3>
                    <p className="text-sm text-gray-600">Building lasting relationships</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quality Focus</h3>
                    <p className="text-sm text-gray-600">Excellence in every project</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Trust & Security</h3>
                    <p className="text-sm text-gray-600">Safe, secure transactions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation</h3>
                    <p className="text-sm text-gray-600">Cutting-edge solutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-green-600">10K+</div>
                    <div className="text-sm text-gray-600">Active Freelancers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">5K+</div>
                    <div className="text-sm text-gray-600">Businesses Served</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">$2M+</div>
                    <div className="text-sm text-gray-600">Paid to Freelancers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a passionate team of entrepreneurs, developers, and designers committed to transforming the
              freelancing landscape.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                bio: "Former freelancer turned entrepreneur with 10+ years in the industry.",
                image: "/professional-woman-ceo.png",
              },
              {
                name: "Michael Chen",
                role: "CTO",
                bio: "Tech visionary with expertise in scalable platforms and AI integration.",
                image: "/professional-cto-developer.png",
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Community",
                bio: "Community builder focused on creating meaningful connections.",
                image: "/professional-woman-community-manager.png",
              },
            ].map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you're a business looking for talent or a freelancer seeking opportunities, we're here to help you
            succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
