import React from "react";

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

function IntentSummary({ stats }) {
  return (
    <section className="widgets-container">
      <div className="widgets">
        <div className="widgets-body">
          <div className="nlu-summary-grid">
            <div className="nlu-summary-card">
              <span className="nlu-summary-label">Total Conversations</span>
              <span className="nlu-summary-value">{stats.totalConversations}</span>
            </div>
            <div className="nlu-summary-card">
              <span className="nlu-summary-label">Unique Sessions</span>
              <span className="nlu-summary-value">{stats.uniqueSessions}</span>
            </div>
            <div className="nlu-summary-card">
              <span className="nlu-summary-label">Unique Users</span>
              <span className="nlu-summary-value">{stats.uniqueUsers}</span>
            </div>
            <div className="nlu-summary-card">
              <span className="nlu-summary-label">Top Intent</span>
              <span className="nlu-summary-value" style={{ color: intentColors[stats.topIntent?.[0]] || "#333" }}>
                {stats.topIntent?.[0] ? stats.topIntent[0].charAt(0).toUpperCase() + stats.topIntent[0].slice(1) : "—"}
                <small style={{ fontSize: "0.5em", opacity: 0.7, marginLeft: 6 }}>
                  ({stats.topIntent?.[1] || 0})
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="widgets" style={{ flex: 2 }}>
        <div className="widgets-claim-body">
          <div className="widget-claim-row">
            <div className="widget-claim-headings">
              <p>Intent Distribution</p>
              <span>Detected intents across conversations</span>
            </div>
          </div>
          <div className="nlu-intent-bar-container">
            {Object.entries(intentColors).map(([key, color]) => {
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <div key={key} className="nlu-intent-bar-row">
                  <span className="nlu-intent-bar-label">{label}</span>
                  <div className="nlu-intent-bar-track">
                    <div
                      className="nlu-intent-bar-fill"
                      style={{
                        width: `${Math.max(8, (stats.intentCounts?.[key] || 0) / stats.totalConversations * 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className="nlu-intent-bar-count">{stats.intentCounts?.[key] || 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntentSummary;
