"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

export default function WeekdayChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  return (
    <div style={{ width: "100%", height: 110 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "oklch(0.55 0.02 50)" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={16}>
            {data.map((d) => (
              <Cell key={d.label} fill="oklch(0.60 0.13 40)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
