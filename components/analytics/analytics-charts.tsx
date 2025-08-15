"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface AnalyticsChartsProps {
  jobs: any[]
  bids: any[]
  reviews: any[]
}

export function AnalyticsCharts({ jobs, bids, reviews }: AnalyticsChartsProps) {
  // Process data for charts
  const jobStatusData = [
    { name: "Open", value: jobs.filter((j) => j.status === "open").length, fill: "hsl(var(--chart-1))" },
    { name: "In Progress", value: jobs.filter((j) => j.status === "in_progress").length, fill: "hsl(var(--chart-2))" },
    { name: "Completed", value: jobs.filter((j) => j.status === "completed").length, fill: "hsl(var(--chart-3))" },
    { name: "Cancelled", value: jobs.filter((j) => j.status === "cancelled").length, fill: "hsl(var(--chart-4))" },
  ]

  // Monthly job creation trend
  const monthlyJobs = jobs.reduce((acc: any, job) => {
    const month = new Date(job.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const jobTrendData = Object.entries(monthlyJobs)
    .map(([month, count]) => ({
      month,
      jobs: count,
    }))
    .slice(-6) // Last 6 months

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Star`,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
    fill: `hsl(var(--chart-${rating}))`,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Status Distribution</CardTitle>
          <CardDescription>Current status of all jobs on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Jobs",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Creation Trend</CardTitle>
          <CardDescription>Number of jobs posted over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              jobs: {
                label: "Jobs",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={jobTrendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Distribution of ratings across all reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Reviews",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <XAxis dataKey="rating" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
