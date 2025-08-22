"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardHeading } from "@/components/ui/card"

interface TaskStats {
  month: string
  total: number
  completed: number
}

export function DashboardCharts({ data }: { data: TaskStats[] }) {
  return (
    <Card>
      <CardHeader>
        <CardHeading>Task Overview</CardHeading>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#072427",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar dataKey="total" name="Total Tasks" fill="#F5532C" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#00848B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
