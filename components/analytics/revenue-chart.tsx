"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface RevenueChartProps {
  data: any[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Process revenue data by month
  const revenueByMonth = data
    .filter((bid) => bid.status === "accepted")
    .reduce((acc: any, bid) => {
      const month = new Date(bid.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      acc[month] = (acc[month] || 0) + 50 // Assuming $50 platform fee per accepted bid
      return acc
    }, {})

  const revenueData = Object.entries(revenueByMonth)
    .map(([month, revenue]) => ({
      month,
      revenue: revenue as number,
    }))
    .slice(-6) // Last 6 months

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          Platform revenue over the last 6 months • Total: ${totalRevenue.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`$${value}`, "Revenue"]} />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
