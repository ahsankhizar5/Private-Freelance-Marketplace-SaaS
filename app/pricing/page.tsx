import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Star, Zap, Crown, Rocket } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for freelancers just getting started",
    icon: Star,
    popular: false,
    features: [
      { name: "Create professional profile", included: true },
      { name: "Apply to 5 projects per month", included: true },
      { name: "Basic messaging", included: true },
      { name: "Payment protection", included: true },
      { name: "Community access", included: true },
      { name: "Priority support", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Custom branding", included: false },
      { name: "API access", included: false },
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For serious freelancers and growing businesses",
    icon: Zap,
    popular: true,
    features: [
      { name: "Everything in Starter", included: true },
      { name: "Unlimited project applications", included: true },
      { name: "Advanced messaging & video calls", included: true },
      { name: "Priority in search results", included: true },
      { name: "Advanced analytics dashboard", included: true },
      { name: "Custom portfolio showcase", included: true },
      { name: "Priority support", included: true },
      { name: "Team collaboration tools", included: true },
      { name: "API access", included: false },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
  },
  {
    name: "Business",
    price: "$99",
    period: "/month",
    description: "For agencies and businesses hiring at scale",
    icon: Crown,
    popular: false,
    features: [
      { name: "Everything in Professional", included: true },
      { name: "Post unlimited projects", included: true },
      { name: "Advanced candidate filtering", included: true },
      { name: "Team management & roles", included: true },
      { name: "Custom branding & white-label", included: true },
      { name: "Advanced reporting & insights", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "API access & integrations", included: true },
      { name: "SLA guarantee", included: true },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with specific needs",
    icon: Rocket,
    popular: false,
    features: [
      { name: "Everything in Business", included: true },
      { name: "Custom integrations", included: true },
      { name: "Advanced security & compliance", included: true },
      { name: "Custom workflows", included: true },
      { name: "On-premise deployment option", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Custom training & onboarding", included: true },
      { name: "Volume discounts", included: true },
      { name: "Custom SLA", included: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
]

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. Your access continues until the end of your billing period.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-20 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              💰 Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Choose Your Perfect Plan</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Start free and scale as you grow. All plans include our core features with no hidden fees. Upgrade anytime
              to unlock advanced capabilities.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`border-border relative ${
                  plan.popular ? "border-primary shadow-lg scale-105 bg-primary/5" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.ctaVariant} asChild>
                    <Link href="/auth/sign-up">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <Card className="mb-20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Feature Comparison</CardTitle>
              <CardDescription>
                Compare all features across our plans to find the perfect fit for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Features</th>
                      {plans.map((plan) => (
                        <th key={plan.name} className="text-center py-4 px-4">
                          <div className="flex flex-col items-center">
                            <plan.icon className="h-5 w-5 text-primary mb-2" />
                            <span className="font-semibold">{plan.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Profile creation",
                      "Project applications",
                      "Messaging system",
                      "Payment protection",
                      "Analytics dashboard",
                      "Priority support",
                      "Custom branding",
                      "API access",
                      "Team management",
                    ].map((feature, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{feature}</td>
                        {plans.map((plan) => {
                          const planFeature = plan.features.find((f) =>
                            f.name.toLowerCase().includes(feature.toLowerCase().split(" ")[0]),
                          )
                          return (
                            <td key={plan.name} className="text-center py-3 px-4">
                              {planFeature?.included ? (
                                <Check className="h-5 w-5 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Got questions? We've got answers. If you can't find what you're looking for, contact our support team.
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 py-16 bg-primary/5 rounded-2xl">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful freelancers and businesses. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
