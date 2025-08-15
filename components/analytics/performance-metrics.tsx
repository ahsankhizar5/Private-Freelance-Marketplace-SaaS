import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react"

interface PerformanceMetricsProps {
  totalJobs: number
  completedJobs: number
  totalBids: number
  acceptedBids: number
  avgRating: number
}

export function PerformanceMetrics({
  totalJobs,
  completedJobs,
  totalBids,
  acceptedBids,
  avgRating,
}: PerformanceMetricsProps) {
  const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0
  const acceptanceRate = totalBids > 0 ? (acceptedBids / totalBids) * 100 : 0
  const satisfactionRate = (avgRating / 5) * 100

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return "text-primary"
    if (rate >= 60) return "text-yellow-500"
    return "text-destructive"
  }

  const getPerformanceIcon = (rate: number) => {
    return rate >= 70 ? TrendingUp : TrendingDown
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Performance Metrics</span>
        </CardTitle>
        <CardDescription>Key performance indicators for the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Project Completion Rate</span>
            <div className="flex items-center space-x-1">
              {React.createElement(getPerformanceIcon(completionRate), {
                className: `h-4 w-4 ${getPerformanceColor(completionRate)}`,
              })}
              <span className={`text-sm font-bold ${getPerformanceColor(completionRate)}`}>
                {completionRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedJobs} of {totalJobs} projects completed
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bid Acceptance Rate</span>
            <div className="flex items-center space-x-1">
              {React.createElement(getPerformanceIcon(acceptanceRate), {
                className: `h-4 w-4 ${getPerformanceColor(acceptanceRate)}`,
              })}
              <span className={`text-sm font-bold ${getPerformanceColor(acceptanceRate)}`}>
                {acceptanceRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <Progress value={acceptanceRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {acceptedBids} of {totalBids} bids accepted
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User Satisfaction</span>
            <div className="flex items-center space-x-1">
              <Award className={`h-4 w-4 ${getPerformanceColor(satisfactionRate)}`} />
              <span className={`text-sm font-bold ${getPerformanceColor(satisfactionRate)}`}>
                {avgRating.toFixed(1)}/5.0
              </span>
            </div>
          </div>
          <Progress value={satisfactionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">Based on user reviews and ratings</p>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Performance Status</h4>
          <div className="space-y-2">
            <Badge
              variant={completionRate >= 80 ? "default" : completionRate >= 60 ? "secondary" : "destructive"}
              className="w-full justify-center"
            >
              {completionRate >= 80 ? "Excellent" : completionRate >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
