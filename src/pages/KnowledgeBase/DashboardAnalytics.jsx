import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useGetQuery } from "../../api/apiSlice";
import { endpoints } from "../../api/config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

function DashboardAnalytics() {
  const { data: docsData, isLoading } = useGetQuery({
    endpoint: endpoints.document.documenttable,
    params: { skip: 0, limit: 100 },
  });

  const { data: catData } = useGetQuery({
    endpoint: endpoints.document.documentcategories,
  });

  const documents = docsData?.documents || [];
  const totalDocuments = docsData?.total || 0;
  const categories = catData?.categories || [];

  const activeDocs = documents.filter(
    (d) => d.status !== "archived" && d.status !== "deleted",
  ).length;

  const recentUploads = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [documents]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    documents.forEach((d) => {
      const cat = d.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      data: Object.values(counts),
    };
  }, [documents]);

  const statusCounts = useMemo(() => {
    const counts = {};
    documents.forEach((d) => {
      const s = d.status || "unknown";
      counts[s] = (counts[s] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      data: Object.values(counts),
    };
  }, [documents]);

  const statusColors = {
    approved: "#10b981",
    pending: "#f59e0b",
    archived: "#6b7280",
    deleted: "#ef4444",
    active: "#10b981",
    inactive: "#6b7280",
  };

  const kpis = [
    { label: "Total Documents", value: String(totalDocuments), sub: `${documents.length} loaded` },
    { label: "Active Docs", value: String(activeDocs), sub: `${categories.length} categories` },
    { label: "Categories", value: String(categories.length), sub: categories.slice(0, 3).join(", ") + (categories.length > 3 ? " ..." : "") },
    { label: "Avg Rating", value: "4.2", sub: "/ 5.0 from 89 reviews" },
    { label: "Uploads Today", value: "12", sub: "+3 vs yesterday" },
    { label: "Top Contributor", value: "Sarah", sub: "24 docs this month" },
  ];

  if (isLoading) {
    return (
      <section className="kb-dashboard">
        <div className="kb-loading">Loading dashboard data...</div>
      </section>
    );
  }

  return (
    <section className="kb-dashboard">
      <div className="kb-kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kb-kpi-card">
            <span className="kb-kpi-label">{kpi.label}</span>
            <span className="kb-kpi-value">{kpi.value}</span>
            <span className="kb-kpi-sub">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="kb-charts-row">
        <div className="kb-chart-card">
          <div className="kb-chart-header">
            <p>Daily Uploads</p>
            <span>Document upload activity for this week</span>
          </div>
          <div className="kb-chart-body">
            <div style={{ height: 240 }}>
              <Bar
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  datasets: [{
                    label: "Uploads",
                    data: [24, 18, 31, 27, 22, 8, 5],
                    backgroundColor: "#009591",
                    borderRadius: 6,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="kb-chart-card">
          <div className="kb-chart-header">
            <p>Documents by Category</p>
            <span>Distribution across knowledge base categories</span>
          </div>
          <div className="kb-chart-body">
            <div style={{ height: 240, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 240 }}>
                <Doughnut
                  data={{
                    labels: categoryCounts.labels,
                    datasets: [{
                      data: categoryCounts.data,
                      backgroundColor: ["#008fd5", "#009591", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#6366f1"],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "60%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { padding: 12, usePointStyle: true },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kb-charts-row">
        <div className="kb-chart-card">
          <div className="kb-chart-header">
            <p>Document Status</p>
            <span>Status breakdown of all documents</span>
          </div>
          <div className="kb-chart-body">
            <div style={{ height: 200, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 220 }}>
                <Doughnut
                  data={{
                    labels: statusCounts.labels,
                    datasets: [{
                      data: statusCounts.data,
                      backgroundColor: statusCounts.labels.map((l) => statusColors[l] || "#6b7280"),
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { padding: 12, usePointStyle: true },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="kb-chart-card">
          <div className="kb-chart-header">
            <p>Recent Uploads</p>
            <span>Latest documents added to the knowledge base</span>
          </div>
          <div className="kb-chart-body">
            {recentUploads.length === 0 ? (
              <div className="kb-loading">No documents uploaded yet</div>
            ) : (
              <div className="kb-recent-list">
                {recentUploads.map((doc, i) => {
                  const name = doc.filename || doc.name || doc._id || "Untitled";
                  const ext = name.includes(".") ? name.split(".").pop().toUpperCase() : "—";
                  const uploader = doc.uploaded_by?.name || doc.uploaded_by || doc.uploader || "Unknown";
                  const time = doc.createdAt
                    ? (() => {
                        const diff = Date.now() - new Date(doc.createdAt).getTime();
                        const hrs = Math.floor(diff / 3600000);
                        if (hrs < 1) return "Just now";
                        if (hrs < 24) return `${hrs}h ago`;
                        return `${Math.floor(hrs / 24)}d ago`;
                      })()
                    : "";
                  return (
                    <div key={doc._id || i} className="kb-recent-row">
                      <span className="kb-recent-ext">{ext}</span>
                      <div className="kb-recent-info">
                        <span className="kb-recent-name">{name}</span>
                        <span className="kb-recent-meta">{uploader} &middot; {time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardAnalytics;
