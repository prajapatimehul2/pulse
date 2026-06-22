"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

export type TrendPoint = {
  day: string; // short label e.g. "Mon"
  value: number;
};

type Props = {
  data: TrendPoint[];
  color: string;
  target?: number;
  unit: string;
};

export function TrendChart({ data, color, target, unit }: Props) {
  const gradientId = `grad-${color.replace("#", "")}`;
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#262633" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#8b8ba7", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8b8ba7", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#13131c",
              border: "1px solid #262633",
              borderRadius: 12,
              color: "#ececf1",
            }}
            labelStyle={{ color: "#8b8ba7" }}
            formatter={(v: number) => [`${v} ${unit}`, "Total"]}
          />
          {target ? (
            <ReferenceLine
              y={target}
              stroke={color}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
          ) : null}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
