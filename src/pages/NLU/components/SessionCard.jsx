import React, { useState } from "react";
import MessageDetail from "./MessageDetail";
import { downloadCSV } from "../../../utils/downloadCSV";

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

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "..." : str;
}

const PAGE_SIZE = 5;

function SessionCard({ session, expanded, onToggle, viewMode }) {
  const [expandedMessages, setExpandedMessages] = useState({});
  const [msgPage, setMsgPage] = useState(1);

  const toggleMessage = (msgId) => {
    setExpandedMessages((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handoffCount = session.filteredMessages.filter((m) => m.handoff).length;

  const totalMsgPages = Math.ceil(
    (session.filteredMessages?.length || 1) / PAGE_SIZE,
  );
  const paginatedMessages = (session.filteredMessages || []).slice(
    (msgPage - 1) * PAGE_SIZE,
    msgPage * PAGE_SIZE,
  );

  return (
    <div className={`nlu-session-card ${expanded ? "is-expanded" : ""}`}>
      <div className="nlu-session-header" onClick={onToggle}>
        <div className="nlu-session-info">
          <div className="nlu-session-user">
            <span className="nlu-session-id" title={session.session_id}>
              {session.session_id}
            </span>
          </div>
          <div className="nlu-session-stats">
            <span className="nlu-stat-badge">
              {session.messageCount} message
              {session.messageCount !== 1 ? "s" : ""}
            </span>
            {handoffCount > 0 && (
              <span className="nlu-stat-badge nlu-stat-handoff">
                {handoffCount} handoff{handoffCount !== 1 ? "s" : ""}
              </span>
            )}
            <span className="nlu-stat-badge">
              {formatTimestamp(session.timestamps.start)}
            </span>
          </div>
        </div>

        <div className="nlu-session-header-right">
          <div className="nlu-session-intents">
            {session.intentSummary.slice(0, 3).map((intent) => (
              <span
                key={intent.name}
                className="nlu-intent-badge"
                style={{
                  backgroundColor: intentBadgeColors[intent.name] || "#6b7280",
                }}
              >
                {intent.name}
                {viewMode === "detailed" && <small>{intent.count}</small>}
              </span>
            ))}
            {session.intentSummary.length > 3 && (
              <span className="nlu-intent-badge nlu-intent-more">
                +{session.intentSummary.length - 3}
              </span>
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
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <path d="M2 5L7 10L12 5" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="nlu-session-body">
          {viewMode === "summary" ? (
            <>
              <div className="nlu-compact-table-wrap">
                <table className="nlu-compact-table">
                  <thead>
                    <tr>
                      <th className="nlu-col-num">#</th>
                      <th className="nlu-col-query">Query</th>
                      <th className="nlu-col-intent">Intent</th>
                      <th className="nlu-col-handoff">Status</th>
                      <th className="nlu-col-response">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMessages.map((msg, idx) => {
                      const globalIdx =
                        (msgPage - 1) * PAGE_SIZE + idx + 1;
                      return (
                        <tr key={msg._id}>
                          <td className="nlu-col-num">{globalIdx}</td>
                          <td className="nlu-col-query" title={msg.query}>
                            {truncate(msg.query, 70)}
                          </td>
                          <td className="nlu-col-intent">
                            {msg.intents.map((i) => (
                              <span
                                key={i.name}
                                className="nlu-intent-badge nlu-intent-tiny"
                                style={{
                                  backgroundColor:
                                    intentBadgeColors[i.name] || "#6b7280",
                                }}
                              >
                                {i.name}
                              </span>
                            ))}
                          </td>
                          <td className="nlu-col-handoff">
                            {msg.handoff ? (
                              <span
                                className="nlu-handoff-badge handoff-yes"
                                title={msg.handoffReason || ""}
                              >
                                Live Agent
                              </span>
                            ) : (
                              <span className="nlu-handoff-badge handoff-no">
                                AI
                              </span>
                            )}
                          </td>
                          <td
                            className="nlu-col-response"
                            title={msg.response}
                          >
                            {truncate(msg.response, 80)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {totalMsgPages > 1 && (
                <div className="nlu-pagination">
                  <button
                    className="nlu-page-btn"
                    disabled={msgPage <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMsgPage((p) => Math.max(1, p - 1));
                    }}
                  >
                    &laquo; Prev
                  </button>
                  <span className="nlu-page-info">
                    Page {msgPage} of {totalMsgPages}
                  </span>
                  <button
                    className="nlu-page-btn"
                    disabled={msgPage >= totalMsgPages}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMsgPage((p) => Math.min(totalMsgPages, p + 1));
                    }}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
              <div className="nlu-compact-footer">
                <button
                  className="nlu-session-dl-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const data = session.filteredMessages.map((m) => ({
                      Session: session.session_id,
                      User: session.user_email,
                      Query: m.query,
                      Response: m.response,
                      Intent: m.intents.map((i) => i.name).join("; "),
                      Confidence: m.intents
                        .map((i) => `${Math.round(i.confidence * 100)}%`)
                        .join("; "),
                      Handoff: m.handoff ? "Live Agent" : "AI",
                      HandoffReason: m.handoffReason || "",
                      Timestamp: m.timestamp,
                    }));
                    downloadCSV(
                      data,
                      `session-${session.session_id.slice(0, 20)}`,
                    );
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 1v8M4 6l3 3 3-3" />
                    <path d="M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
                  </svg>
                  CSV
                </button>
              </div>
            </>
          ) : (
            <>
              {paginatedMessages.map((msg, idx) => {
                const globalIdx = (msgPage - 1) * PAGE_SIZE + idx;
                return (
                  <div key={msg._id} className="nlu-message-row">
                    <MessageDetail
                      msg={msg}
                      expanded={!!expandedMessages[msg._id]}
                      onToggle={() => toggleMessage(msg._id)}
                      index={globalIdx}
                    />
                  </div>
                );
              })}
              {totalMsgPages > 1 && (
                <div className="nlu-pagination">
                  <button
                    className="nlu-page-btn"
                    disabled={msgPage <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMsgPage((p) => Math.max(1, p - 1));
                    }}
                  >
                    &laquo; Prev
                  </button>
                  <span className="nlu-page-info">
                    Page {msgPage} of {totalMsgPages}
                  </span>
                  <button
                    className="nlu-page-btn"
                    disabled={msgPage >= totalMsgPages}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMsgPage((p) => Math.min(totalMsgPages, p + 1));
                    }}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionCard;
