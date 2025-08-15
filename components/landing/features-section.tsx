import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Target, Shield, BarChart3, Users, Zap } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Smart Matching",
    description:
      "Our AI-powered system matches projects with the perfect freelancers based on skills, experience, and availability.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Communication",
    description:
      "Built-in messaging system with file sharing, video calls, and project discussions to keep everyone connected.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Escrow protection, milestone-based payments, and automated invoicing ensure secure transactions for everyone.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards with project insights, performance metrics, and detailed reporting tools.",
  },
  {
    icon: Users,
    title: "Private Community",
    description: "Exclusive access to vetted professionals and businesses in a trusted, invitation-only environment.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Streamlined workflows and project management tools help deliver high-quality work faster than ever.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make freelancing and hiring seamless, secure, and successful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
