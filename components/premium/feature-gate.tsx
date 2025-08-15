"use client"

import type { ReactNode } from "react"
import { UpgradePrompt } from "./upgrade-prompt"

interface FeatureGateProps {
  children: ReactNode
  feature: string
  description: string
  plan: "Professional" | "Business"
  userPlan?: string
  fallback?: ReactNode
}

export function FeatureGate({
  children,
  feature,
  description,
  plan,
  userPlan = "Starter",
  fallback,
}: FeatureGateProps) {
  const planHierarchy = {
    Starter: 0,
    Professional: 1,
    Business: 2,
    Enterprise: 3,
  }

  const hasAccess = planHierarchy[userPlan as keyof typeof planHierarchy] >= planHierarchy[plan]

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return <UpgradePrompt feature={feature} description={description} plan={plan} />
}
