import React, { useState, useMemo } from "react";
import SessionCard from "./components/SessionCard";
import IntentSummary from "./components/IntentSummary";
import { downloadCSV } from "../../utils/downloadCSV";
import { rawEntries, groupBySession, userRoles } from "../../data/nluData";

const intentCategories = [
  { value: "all", label: "All Intents" },
  { value: "rates", label: "Rates" },
  { value: "hours", label: "Hours / Location" },
  { value: "loans", label: "Loans" },
  { value: "membership", label: "Membership" },
  { value: "payments", label: "Payments" },
  { value: "cards", label: "Cards" },
  { value: "fraud", label: "Fraud & Disputes" },
  { value: "account", label: "Account Services" },
  { value: "general", label: "General Inquiry" },
];



const NLU_TABS = [
  { key: "analytics", label: "Analytics" },
  { key: "details", label: "Details" },
];

function NLU() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [expandedSessions, setExpandedSessions] = useState({});
  const [expandedUserGroups, setExpandedUserGroups] = useState({});
  const [userIntentFilters, setUserIntentFilters] = useState({});
  const [viewMode, setViewMode] = useState("summary");

  const toggleSession = (sessionId) => {
    setExpandedSessions((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const sessions = useMemo(() => groupBySession(rawEntries), []);

  const filteredSessions = useMemo(() => {
    return sessions
      .map((session) => {
        const filteredMsgs = session.messages.filter((msg) => {
          const matchesSearch =
            msg.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.user_email.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesIntent =
            intentFilter === "all" ||
            msg.intents.some((i) => i.name === intentFilter);
          return matchesSearch && matchesIntent;
        });
        return { ...session, filteredMessages: filteredMsgs };
      })
      .filter((s) => s.filteredMessages.length > 0);
  }, [sessions, searchQuery, intentFilter]);

  const stats = useMemo(() => {
    const uniqueSessions = new Set(rawEntries.map((c) => c.session_id));
    const intentCounts = {};
    let handoffCount = 0;
    const dailyCounts = {};
    const userConversations = {};

    rawEntries.forEach((c) => {
      c.intents.forEach((i) => {
        intentCounts[i.name] = (intentCounts[i.name] || 0) + 1;
      });
      if (c.handoff) handoffCount++;
      const day = c.timestamp.split("T")[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      userConversations[c.user_email] =
        (userConversations[c.user_email] || 0) + 1;
    });

    const sessions = groupBySession(rawEntries);
    const msgCounts = sessions.map((s) => s.messageCount);
    const avgMsgsPerSession =
      msgCounts.reduce((a, b) => a + b, 0) / msgCounts.length;

    const dailyTrend = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalConversations: rawEntries.length,
      uniqueSessions: uniqueSessions.size,
      uniqueUsers: new Set(rawEntries.map((c) => c.user_email)).size,
      topIntent: Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0],
      intentCounts,
      handoffCount,
      handoffRate: rawEntries.length
        ? Math.round((handoffCount / rawEntries.length) * 100)
        : 0,
      avgMsgsPerSession: Math.round(avgMsgsPerSession * 10) / 10,
      dailyTrend,
      topUsers: Object.entries(userConversations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    };
  }, []);

  return (
    <main className="dashboard-container">
      <div className="dashboard-headings">
        <h4>NLU Engine</h4>
        <p>
          Natural Language Understanding trained to recognize the customer query intent categories
        </p>
      </div>

      <div className="nlu-tabs">
        {NLU_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`nlu-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "analytics" && (
        <IntentSummary stats={stats} />
      )}

      {activeTab === "details" && (
        <>
          <div className="nlu-controls-row">
            <div className="nlu-search-wrapper">
              <input
                type="text"
                className="nlu-search-input"
                placeholder="Search queries, responses, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="nlu-filter-group">
              <select
                className="nlu-select"
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
              >
                {intentCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <div className="nlu-view-toggle">
                <button
                  className={`nlu-view-btn ${viewMode === "summary" ? "active" : ""}`}
                  onClick={() => setViewMode("summary")}
                  title="Summary view"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <rect y="1" width="16" height="3" rx="1" />
                    <rect y="7" width="16" height="3" rx="1" />
                    <rect y="13" width="16" height="3" rx="1" />
                  </svg>
                </button>
                <button
                  className={`nlu-view-btn ${viewMode === "detailed" ? "active" : ""}`}
                  onClick={() => setViewMode("detailed")}
                  title="Detailed view"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <rect y="1" width="10" height="3" rx="1" />
                    <rect y="7" width="14" height="3" rx="1" />
                    <rect y="13" width="12" height="3" rx="1" />
                  </svg>
                </button>
              </div>

              <button
                className="nlu-dl-btn"
                onClick={() => {
                  const flat = filteredSessions.flatMap((s) =>
                    s.filteredMessages.map((m) => ({
                      Session: s.session_id,
                      User: s.user_email,
                      Query: m.query,
                      Response: m.response,
                      Intent: m.intents.map((i) => i.name).join("; "),
                      Confidence: m.intents
                        .map((i) => `${Math.round(i.confidence * 100)}%`)
                        .join("; "),
                      Timestamp: m.timestamp,
                    })),
                  );
                  downloadCSV(flat, "nlu-filtered-conversations");
                }}
                title="Download filtered conversations as CSV"
              >
                <svg
                  width="14"
                  height="14"
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
          </div>

          <div className="nlu-results-count">
            {filteredSessions.length} session
            {filteredSessions.length !== 1 ? "s" : ""} found
          </div>

          <div className="nlu-user-groups">
            {(() => {
              const groups = {};
              filteredSessions.forEach((s) => {
                if (!groups[s.user_email]) groups[s.user_email] = [];
                groups[s.user_email].push(s);
              });
              const groupEntries = Object.entries(groups);
              return groupEntries.map(([email, userSessions]) => {
                const isOpen = expandedUserGroups[email] !== false;
                const selIntent = userIntentFilters[email] || "all";
                const colors = {
                  Admin: "#8b5cf6",
                  Manager: "#008fd5",
                  Agent: "#009591",
                  Analyst: "#f59e0b",
                };
                const allIntents = new Set();
                let handoffCount = 0;
                let aiCount = 0;
                userSessions.forEach((s) => {
                  s.messages.forEach((m) => {
                    m.intents.forEach((i) => allIntents.add(i.name));
                    if (m.handoff) handoffCount++;
                    else aiCount++;
                  });
                });
                const filteredUserSessions = userSessions
                  .map((s) => {
                    if (selIntent === "all") return { ...s, filteredMessages: s.messages };
                    const fm = s.messages.filter((m) =>
                      m.intents.some((i) => i.name === selIntent),
                    );
                    return { ...s, filteredMessages: fm };
                  })
                  .filter((s) => s.filteredMessages.length > 0);
                return (
                  <div key={email} className="nlu-user-group-details">
                    <div
                      className="nlu-user-group-header nlu-user-group-toggle"
                      onClick={() =>
                        setExpandedUserGroups((prev) => ({
                          ...prev,
                          [email]: prev[email] === false ? true : false,
                        }))
                      }
                    >
                      <div className="nlu-user-group-info">
                        <div className="nlu-user-group-avatar">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="nlu-user-group-email">
                            {userSessions[0].role}
                          </span>
                          <span
                            className="nlu-user-group-sub"
                          >
                            {email}
                          </span>
                        </div>
                      </div>
                      <div className="nlu-user-group-right">
                        <div className="nlu-user-group-stats">
                          <span className="nlu-stat-badge nlu-stat-ai">
                            AI: {aiCount}
                          </span>
                          <span className="nlu-stat-badge nlu-stat-handoff">
                            Live Agent: {handoffCount}
                          </span>
                        </div>
                        <span className="nlu-user-group-count">
                          {filteredUserSessions.length} session
                          {filteredUserSessions.length !== 1 ? "s" : ""}
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <path d="M2 5L7 10L12 5" />
                        </svg>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="nlu-user-group-body">
                        <div className="nlu-user-group-toolbar">
                          <select
                            className="nlu-user-intent-select"
                            value={selIntent}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setUserIntentFilters((prev) => ({
                                ...prev,
                                [email]: e.target.value,
                              }))
                            }
                          >
                            <option value="all">All Intents</option>
                            {[...allIntents].sort().map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="nlu-user-sessions">
                          {filteredUserSessions.map((session) => (
                            <SessionCard
                              key={session.session_id}
                              session={session}
                              expanded={
                                !!expandedSessions[session.session_id]
                              }
                              onToggle={() =>
                                toggleSession(session.session_id)
                              }
                              viewMode={viewMode}
                            />
                          ))}
                          {filteredUserSessions.length === 0 && (
                            <div className="nlu-empty">
                              No sessions match this intent.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
            {filteredSessions.length === 0 && (
              <div className="nlu-empty">
                No sessions match the current filters.
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default NLU;
