/*
 * FreelanceHub Landing Page
 * Developed by: Ahsan Khizar
 * GitHub: https://github.com/ahsankhizar5
 */

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingPreview } from "@/components/landing/pricing-preview"
import { CTASection } from "@/components/landing/cta-section"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default async function HomePage() {
  // If Supabase is not configured, show the landing page in demo mode
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <TestimonialsSection />
          <PricingPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    )
  }

  // Check if user is authenticated
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to appropriate dashboard
  if (user) {
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profile?.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/freelancer/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
