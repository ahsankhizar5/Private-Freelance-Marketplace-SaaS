"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface UserGrowthChartProps {
  data: any[]
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Process user growth data
  const usersByMonth = data.reduce((acc: any, user) => {
    const month = new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    if (!acc[month]) {
      acc[month] = { freelancers: 0, admins: 0 }
    }
    if (user.role === "freelancer") {
      acc[month].freelancers++
    } else {
      acc[month].admins++
    }
    return acc
  }, {})

  const growthData = Object.entries(usersByMonth)
    .map(([month, counts]: [string, any]) => ({
      month,
      freelancers: counts.freelancers,
      admins: counts.admins,
      total: counts.freelancers + counts.admins,
    }))
    .slice(-6) // Last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New user registrations over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            freelancers: {
              label: "Freelancers",
              color: "hsl(var(--chart-1))",
            },
            admins: {
              label: "Admins",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="freelancers"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="admins"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
