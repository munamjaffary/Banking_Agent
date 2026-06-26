import React from "react";

const intentBadgeColors = {
  rates: "#008fd5", hours: "#009591", loans: "#f59e0b",
  membership: "#8b5cf6", payments: "#10b981", cards: "#ef4444",
  fraud: "#dc2626", account: "#6366f1", general: "#6b7280",
};

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function MessageDetail({ msg, expanded, onToggle, index }) {
  return (
    <div className="nlu-msg-card" onClick={onToggle}>
      <div className="nlu-msg-header">
        <div className="nlu-msg-query">
          <span className="nlu-msg-index">#{index + 1}</span>
          <span className="nlu-msg-text">
            {msg.query.length > 90 ? msg.query.slice(0, 90) + "..." : msg.query}
          </span>
        </div>
        <div className="nlu-msg-header-right">
          <div className="nlu-msg-time">{formatTimestamp(msg.timestamp)}</div>
          {msg.intents.map((intent) => (
            <span
              key={intent.name}
              className="nlu-intent-badge nlu-intent-sm"
              style={{ backgroundColor: intentBadgeColors[intent.name] || "#6b7280" }}
            >
              {Math.round(intent.confidence * 100)}%
            </span>
          ))}
          <div className="nlu-conv-expand-icon">
            <svg
              width="12" height="12" viewBox="0 0 14 14"
              fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <path d="M2 5L7 10L12 5" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="nlu-msg-body" onClick={(e) => e.stopPropagation()}>
          <div className="nlu-msg-section">
            <div className="nlu-msg-section-label">User Query</div>
            <div className="nlu-msg-section-content">{msg.query}</div>
          </div>
          <div className="nlu-msg-section">
            <div className="nlu-msg-section-label">Bot Response</div>
            <div className="nlu-msg-section-content">{msg.response}</div>
          </div>
          <div className="nlu-msg-detail-grid">
            <div className="nlu-msg-detail-field">
              <span className="nlu-detail-label">Entry ID</span>
              <span className="nlu-detail-value">{msg._id}</span>
            </div>
            <div className="nlu-msg-detail-field">
              <span className="nlu-detail-label">Timestamp</span>
              <span className="nlu-detail-value">{formatTimestamp(msg.timestamp)}</span>
            </div>
            <div className="nlu-msg-detail-field">
              <span className="nlu-detail-label">Intent</span>
              <span className="nlu-detail-value">
                {msg.intents.map((i) => `${i.name} (${Math.round(i.confidence * 100)}%)`).join(", ")}
              </span>
            </div>
            {msg.references?.length > 0 && (
              <div className="nlu-msg-detail-field nlu-msg-detail-full">
                <span className="nlu-detail-label">References ({msg.references.length})</span>
                <ul className="nlu-ref-list">
                  {msg.references.map((ref, idx) => (
                    <li key={idx}>{ref.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageDetail;
