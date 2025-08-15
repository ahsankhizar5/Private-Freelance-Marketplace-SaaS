import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star } from "lucide-react"

interface PremiumBadgeProps {
  plan: "Professional" | "Business" | "Enterprise"
  size?: "sm" | "md" | "lg"
}

export function PremiumBadge({ plan, size = "md" }: PremiumBadgeProps) {
  const planConfig = {
    Professional: {
      icon: Zap,
      label: "Pro",
      variant: "default" as const,
    },
    Business: {
      icon: Crown,
      label: "Business",
      variant: "secondary" as const,
    },
    Enterprise: {
      icon: Star,
      label: "Enterprise",
      variant: "outline" as const,
    },
  }

  const config = planConfig[plan]
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <config.icon className={iconSize} />
      <span>{config.label}</span>
    </Badge>
  )
}
