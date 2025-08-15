import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Join thousands of successful businesses and freelancers who have found their perfect match on FreelanceHub.
          Start your journey today and experience the difference.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/auth/sign-up">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
