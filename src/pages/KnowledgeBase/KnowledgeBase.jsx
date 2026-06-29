import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardAnalytics from "./DashboardAnalytics";
import Activity from "../Activity/Activity";
import DocumentTable from "../Documents/DocumentTable";

const KB_TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "activity", label: "Activity" },
  { key: "documents", label: "Documents" },
];

function KnowledgeBase() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabClick = (key) => {
    navigate(`?tab=${key}`, { replace: true });
  };

  return (
    <main className="dashboard-container">
      <div className="dashboard-headings">
        <h4>Knowledge Base</h4>
        <p>Overview of system metrics, activity logs, and insights</p>
      </div>

      <div className="nlu-tabs">
        {KB_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`nlu-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && <DashboardAnalytics />}
      {activeTab === "activity" && <Activity />}
      {activeTab === "documents" && <DocumentTable />}
    </main>
  );
}

export default KnowledgeBase;
