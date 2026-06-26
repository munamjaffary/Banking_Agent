import React, { useState } from "react";
import MessageDetail from "./MessageDetail";

const intentBadgeColors = {
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

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SessionCard({ session, expanded, onToggle, viewMode }) {
  const [expandedMessages, setExpandedMessages] = useState({});

  const toggleMessage = (msgId) => {
    setExpandedMessages((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const displayMessages = viewMode === "detailed" ? session.filteredMessages : session.filteredMessages.slice(0, 1);

  return (
    <div className={`nlu-session-card ${expanded ? "is-expanded" : ""}`}>
      <div className="nlu-session-header" onClick={onToggle}>
        <div className="nlu-session-info">
          <div className="nlu-session-user">
            <div className="nlu-avatar">{session.user_email.charAt(0).toUpperCase()}</div>
            <div className="nlu-session-meta">
              <span className="nlu-session-email">{session.user_email}</span>
              <span className="nlu-session-id">ID: {session.session_id.length > 35 ? session.session_id.slice(0, 35) + "..." : session.session_id}</span>
            </div>
          </div>
          <div className="nlu-session-stats">
            <span className="nlu-stat-badge">
              {session.messageCount} message{session.messageCount !== 1 ? "s" : ""}
            </span>
            <span className="nlu-stat-badge">{formatTimestamp(session.timestamps.start)}</span>
          </div>
        </div>

        <div className="nlu-session-header-right">
          <div className="nlu-session-intents">
            {session.intentSummary.slice(0, 3).map((intent) => (
              <span
                key={intent.name}
                className="nlu-intent-badge"
                style={{ backgroundColor: intentBadgeColors[intent.name] || "#6b7280" }}
              >
                {intent.name}
                {viewMode === "detailed" && <small>{intent.count}</small>}
              </span>
            ))}
            {session.intentSummary.length > 3 && (
              <span className="nlu-intent-badge nlu-intent-more">+{session.intentSummary.length - 3}</span>
            )}
          </div>
          <div className="nlu-conv-expand-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <path d="M2 5L7 10L12 5" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="nlu-session-body">
          {viewMode === "summary" && (
            <div className="nlu-session-summary">
              <div className="nlu-session-summary-item">
                <span className="nlu-summary-item-label">Total Messages</span>
                <span className="nlu-summary-item-value">{session.messageCount}</span>
              </div>
              <div className="nlu-session-summary-item">
                <span className="nlu-summary-item-label">First Message</span>
                <span className="nlu-summary-item-value">{formatTimestamp(session.timestamps.start)}</span>
              </div>
              <div className="nlu-session-summary-item">
                <span className="nlu-summary-item-label">Last Message</span>
                <span className="nlu-summary-item-value">{formatTimestamp(session.timestamps.end)}</span>
              </div>
              <div className="nlu-session-summary-item">
                <span className="nlu-summary-item-label">Duration</span>
                <span className="nlu-summary-item-value">
                  {Math.round((new Date(session.timestamps.end) - new Date(session.timestamps.start)) / 60000)} min
                </span>
              </div>
              <div className="nlu-session-summary-item">
                <span className="nlu-summary-item-label">Primary Intent</span>
                <span className="nlu-summary-item-value" style={{ color: intentBadgeColors[session.intentSummary[0]?.name] || "#333" }}>
                  {session.intentSummary[0]?.name ? session.intentSummary[0].name.charAt(0).toUpperCase() + session.intentSummary[0].name.slice(1) : "—"}
                </span>
              </div>
              <div className="nlu-session-summary-item">
                <span className="nlu-summary-item-label">Unique Intents</span>
                <span className="nlu-summary-item-value">{session.intentSummary.length}</span>
              </div>
            </div>
          )}

          {displayMessages.map((msg, idx) => (
            <div key={msg._id} className="nlu-message-row" style={{ "--msg-index": idx }}>
              <MessageDetail
                msg={msg}
                expanded={!!expandedMessages[msg._id]}
                onToggle={() => toggleMessage(msg._id)}
                index={idx}
                viewMode={viewMode}
              />
            </div>
          ))}

          {viewMode === "summary" && session.filteredMessages.length > 1 && (
            <div className="nlu-show-all" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              <button
                className="nlu-show-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMessages((prev) => {
                    const next = { ...prev };
                    session.filteredMessages.forEach((m) => { next[m._id] = true; });
                    return next;
                  });
                }}
              >
                Show all {session.filteredMessages.length} messages
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionCard;
