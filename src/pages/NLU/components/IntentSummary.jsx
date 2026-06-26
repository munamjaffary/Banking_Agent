import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const intentColors = {
  rates: "#008fd5",
  hours: "#009591",
  loans: "#f59e0b",
  membership: "#8b5cf6",
  payments: "#10b981",
  cards: "#ef4444",
  fraud: "#dc2626",
  account: "#6366f1",
  general: "#6b7280",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div className="nlu-donut-tooltip">
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
          marginRight: 6,
        }}
      />
      <strong>{label}</strong>: {value} conversation{value !== 1 ? "s" : ""}
    </div>
  );
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) {
  const RAD = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RAD);
  const y = cy + radius * Math.sin(-midAngle * RAD);
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  const pct = `${(percent * 100).toFixed(0)}%`;

  return (
    <text
      x={x}
      y={y}
      fill="var(--text, #333)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={500}
    >
      {pct} {label}
    </text>
  );
}

function IntentSummary({ stats }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = Object.entries(intentColors)
    .map(([key, color]) => ({
      name: key,
      value: stats.intentCounts?.[key] || 0,
      color,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <section className="nlu-summary-row">
      <div className="nlu-kpi-container">
        <div className="nlu-kpi-grid">
          <div className="nlu-kpi-card">
            <span className="nlu-kpi-label">Total Conversations</span>
            <span className="nlu-kpi-value">{stats.totalConversations}</span>
          </div>
          <div className="nlu-kpi-card">
            <span className="nlu-kpi-label">Unique Sessions</span>
            <span className="nlu-kpi-value">{stats.uniqueSessions}</span>
          </div>
          <div className="nlu-kpi-card">
            <span className="nlu-kpi-label">Unique Users</span>
            <span className="nlu-kpi-value">{stats.uniqueUsers}</span>
          </div>
          <div className="nlu-kpi-card">
            <span className="nlu-kpi-label">Top Intent</span>
            <span className="nlu-kpi-value">
              {stats.topIntent?.[0]
                ? stats.topIntent[0].charAt(0).toUpperCase() +
                  stats.topIntent[0].slice(1)
                : "—"}
              <small className="nlu-kpi-sub">
                ({stats.topIntent?.[1] || 0})
              </small>
            </span>
          </div>
        </div>
      </div>

      <div className="nlu-donut-container">
        <div className="nlu-donut-header">
          <p>Intent Distribution</p>
          <span>Detected intents across conversations</span>
        </div>
        <div className="nlu-donut-body">
          <div className="nlu-donut-chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={{
                    stroke: "var(--border-color, #ccc)",
                    strokeWidth: 1,
                  }}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  activeIndex={activeIndex}
                  activeShape={(props) => {
                    const {
                      cx,
                      cy,
                      innerRadius,
                      outerRadius,
                      startAngle,
                      endAngle,
                      fill,
                    } = props;
                    return (
                      <g>
                        <Pie
                          {...props}
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius - 2}
                          outerRadius={outerRadius + 6}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                          stroke="none"
                        />
                      </g>
                    );
                  }}
                  stroke="none"
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="nlu-donut-center">
              <span className="nlu-donut-center-value">{total}</span>
              <span className="nlu-donut-center-label">Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntentSummary;
