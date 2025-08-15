import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
  feature: string
  description: string
  plan: "Professional" | "Business"
  className?: string
}

export function UpgradePrompt({ feature, description, plan, className }: UpgradePromptProps) {
  const planDetails = {
    Professional: {
      price: "$29/month",
      icon: Zap,
      color: "text-primary",
    },
    Business: {
      price: "$99/month",
      icon: Crown,
      color: "text-yellow-600",
    },
  }

  const details = planDetails[plan]

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardHeader className="text-center">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <details.icon className={`h-6 w-6 ${details.color}`} />
        </div>
        <Badge variant="secondary" className="mb-2">
          {plan} Feature
        </Badge>
        <CardTitle className="text-xl">{feature}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <span className="text-2xl font-bold text-foreground">{details.price}</span>
        </div>
        <Button asChild className="w-full">
          <Link href="/pricing">
            Upgrade to {plan} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
