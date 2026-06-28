import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import Activity from "../Activity/Activity";

const KB_TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "activity", label: "Activity" },
];

function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "activity" && <Activity />}
    </main>
  );
}

export default KnowledgeBase;
