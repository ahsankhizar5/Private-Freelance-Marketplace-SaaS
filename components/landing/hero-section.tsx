/*
 * Hero Section Component - FreelanceHub
 * Developed by: Ahsan Khizar
 * Part of the FreelanceHub SaaS Marketplace Platform
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Briefcase, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto text-center max-w-4xl">
        <Badge variant="secondary" className="mb-6">
          🚀 Trusted by 10,000+ professionals
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Connect with Top Talent in Your
          <span className="text-primary"> Private Community</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          FreelanceHub is the premier private marketplace where businesses find exceptional freelancers and talented
          professionals discover meaningful projects. Join our exclusive community today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/auth/sign-up">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">5,000+ Active Freelancers</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">10,000+ Projects Completed</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">4.9/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
