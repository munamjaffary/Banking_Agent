import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

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
    <section className="nlu-analytics-section">
      <div className="nlu-summary-row">
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
            <div className="nlu-kpi-card">
              <span className="nlu-kpi-label">Handoff Rate</span>
              <span className="nlu-kpi-value">{stats.handoffRate}%</span>
              <small className="nlu-kpi-sub">
                {stats.handoffCount} of {stats.totalConversations}
              </small>
            </div>
            <div className="nlu-kpi-card">
              <span className="nlu-kpi-label">Avg Msgs / Session</span>
              <span className="nlu-kpi-value">{stats.avgMsgsPerSession}</span>
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
      </div>

      <div className="nlu-charts-row">
        <div className="nlu-chart-card">
          <div className="nlu-chart-card-header">
            <p>Daily Conversation Trend</p>
            <span>Conversations per day</span>
          </div>
          <div className="nlu-chart-card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.dailyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--text)" }}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--text)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Conversations"
                  fill="#008fd5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="nlu-chart-card">
          <div className="nlu-chart-card-header">
            <p>Handoff Overview</p>
            <span>AI vs Live Agent split</span>
          </div>
          <div className="nlu-chart-card-body nlu-handoff-chart-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "AI Handled",
                      value: stats.totalConversations - stats.handoffCount,
                      color: "#10b981",
                    },
                    {
                      name: "Live Agent",
                      value: stats.handoffCount,
                      color: "#f59e0b",
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={3}
                >
                  {[
                    { color: "#10b981" },
                    { color: "#f59e0b" },
                  ].map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="nlu-handoff-center">
              <span className="nlu-donut-center-value">
                {stats.handoffRate}%
              </span>
              <span className="nlu-donut-center-label">Handoff</span>
            </div>
            <div className="nlu-handoff-legend">
              <div className="nlu-handoff-legend-item">
                <span
                  className="nlu-handoff-dot"
                  style={{ background: "#10b981" }}
                />
                <span>AI Handled ({stats.totalConversations - stats.handoffCount})</span>
              </div>
              <div className="nlu-handoff-legend-item">
                <span
                  className="nlu-handoff-dot"
                  style={{ background: "#f59e0b" }}
                />
                <span>Live Agent ({stats.handoffCount})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="nlu-chart-card">
          <div className="nlu-chart-card-header">
            <p>Top Users</p>
            <span>Users with most conversations</span>
          </div>
          <div className="nlu-chart-card-body">
            <div className="nlu-top-users-list">
              {stats.topUsers.map(([email, count], idx) => {
                const pct = Math.round((count / stats.totalConversations) * 100);
                return (
                  <div key={email} className="nlu-top-user-row">
                    <span className="nlu-top-user-rank">{idx + 1}</span>
                    <span className="nlu-top-user-email">{email}</span>
                    <span className="nlu-top-user-count">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntentSummary;
