import React, { useState, useMemo } from "react";
import SessionCard from "./components/SessionCard";
import IntentSummary from "./components/IntentSummary";
import { downloadCSV } from "../../utils/downloadCSV";

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

const rawEntries = [
  {
    _id: "6a3ed3ebdbbce96770b75f75",
    session_id: "munam.ali@integrationxperts.com_default",
    user_email: "munam.ali@integrationxperts.com",
    query: "Hi",
    response: "Hello, how can I help you today?",
    references: [],
    timestamp: "2026-06-26T19:32:59.492+00:00",
    intents: [{ name: "general", confidence: 0.98 }],
    handoff: false,
  },
  {
    _id: "6a3ef1af82cadfa94aaaf00a",
    session_id: "SessionID_9211b058-f797-4096-a869-c9f7c941a8b8",
    user_email: "munam.ali@integrationxperts.com",
    query: "I need to inquire about carloans, can you help with that?",
    response:
      "Yes, you can repay your car loan before the maturity date. Would you like more details about our car loan rates?",
    references: [
      { title: "Auto Loan Rates", url: "#" },
      { title: "Loan Terms", url: "#" },
    ],
    timestamp: "2026-06-26T21:39:59.557+00:00",
    intents: [
      { name: "loans", confidence: 0.94 },
      { name: "rates", confidence: 0.72 },
    ],
    handoff: false,
  },
  {
    _id: "6a3ef29182cadfa94aaaf00b",
    session_id: "SessionID_9211b058-f797-4096-a869-c9f7c941a8b8",
    user_email: "munam.ali@integrationxperts.com",
    query: "can you provide me a summary about carloans?",
    response:
      "You can repay your car loan before the maturity date. Our current APR starts at 4.99% for qualified borrowers.",
    references: [{ title: "Car Loan Summary", url: "#" }],
    timestamp: "2026-06-26T21:43:45.844+00:00",
    intents: [
      { name: "loans", confidence: 0.96 },
      { name: "rates", confidence: 0.85 },
    ],
    handoff: false,
  },
  {
    _id: "6a3ef382fc49ca5383beb056",
    session_id: "SessionID_9211b058-f797-4096-a869-c9f7c941a8b8",
    user_email: "munam.ali@integrationxperts.com",
    query: "can you provide me a summary about carloans?",
    response:
      "A summary about car loans with HBL (Habib Bank Limited) includes the following key points: competitive interest rates starting from 4.99%, flexible tenure up to 7 years, financing up to 80% of the vehicle value, and early settlement options available.",
    references: [
      { title: "HBL Car Loan Details", url: "#" },
      { title: "Rate Sheet", url: "#" },
    ],
    timestamp: "2026-06-26T21:47:46.518+00:00",
    intents: [{ name: "loans", confidence: 0.97 }],
    handoff: false,
  },
  {
    _id: "6a3ef482fc49ca5383beb057",
    session_id: "SessionID_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    user_email: "john.doe@example.com",
    query: "What are your current savings account interest rates?",
    response:
      "Our High-Yield Savings account currently offers 3.50% APY. Premium Savings account offers 4.00% APY for balances above $10,000.",
    references: [{ title: "Savings Rates", url: "#" }],
    timestamp: "2026-06-27T08:15:30.000+00:00",
    intents: [
      { name: "rates", confidence: 0.95 },
      { name: "account", confidence: 0.68 },
    ],
    handoff: false,
  },
  {
    _id: "6a3ef582fc49ca5383beb058",
    session_id: "SessionID_b2c3d4e5-f6a7-8901-bcde-f12345678901",
    user_email: "jane.smith@example.com",
    query: "What time does the branch open on Saturdays?",
    response:
      "Our branches are open Saturday from 9:00 AM to 1:00 PM. Regular weekday hours are Monday-Friday 8:00 AM to 5:00 PM.",
    references: [],
    timestamp: "2026-06-27T09:30:00.000+00:00",
    intents: [{ name: "hours", confidence: 0.99 }],
    handoff: true,
    handoffReason: "Needed branch-specific details beyond FAQ",
  },
  {
    _id: "6a3ef682fc49ca5383beb059",
    session_id: "SessionID_c3d4e5f6-a7b8-9012-cdef-123456789012",
    user_email: "bob.wilson@example.com",
    query: "I lost my credit card, what should I do?",
    response:
      "I'm sorry to hear that. Please call our 24/7 support line at 1-800-NPFCU-NOW to report your lost card immediately.",
    references: [
      { title: "Lost Card Procedure", url: "#" },
      { title: "Fraud Protection", url: "#" },
    ],
    timestamp: "2026-06-27T10:00:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.97 },
      { name: "cards", confidence: 0.88 },
    ],
    handoff: true,
    handoffReason: "Fraud case required agent intervention",
  },
  {
    _id: "6a3ef782fc49ca5383beb05a",
    session_id: "SessionID_d4e5f6a7-b8c9-0123-defa-234567890123",
    user_email: "alice.johnson@example.com",
    query: "How do I become a member of NPFCU?",
    response:
      "To become an NPFCU member, you need to meet eligibility requirements. You can apply online with a minimum $5 deposit.",
    references: [
      { title: "Membership Eligibility", url: "#" },
      { title: "Apply Online", url: "#" },
    ],
    timestamp: "2026-06-27T11:15:00.000+00:00",
    intents: [{ name: "membership", confidence: 0.96 }],
    handoff: false,
  },
  {
    _id: "6a3ef882fc49ca5383beb05b",
    session_id: "SessionID_e5f6a7b8-c9d0-1234-efab-345678901234",
    user_email: "charlie.brown@example.com",
    query: "Can I make a payment on my mortgage online?",
    response:
      "Yes, you can make mortgage payments through our online banking portal or mobile app. You can schedule one-time or recurring payments with no additional fees.",
    references: [
      { title: "Online Payments", url: "#" },
      { title: "Mortgage Services", url: "#" },
    ],
    timestamp: "2026-06-27T12:00:00.000+00:00",
    intents: [
      { name: "payments", confidence: 0.93 },
      { name: "loans", confidence: 0.71 },
    ],
    handoff: false,
  },
  {
    _id: "6a3ef982fc49ca5383beb05c",
    session_id: "SessionID_f6a7b8c9-d0e1-2345-fabc-456789012345",
    user_email: "diana.prince@example.com",
    query: "What documents do I need to apply for a personal loan?",
    response:
      "You'll need: 1) Valid government-issued ID, 2) Proof of income, 3) Proof of address, and 4) Social Security number.",
    references: [{ title: "Personal Loan Requirements", url: "#" }],
    timestamp: "2026-06-27T13:30:00.000+00:00",
    intents: [
      { name: "loans", confidence: 0.98 },
      { name: "account", confidence: 0.65 },
    ],
    handoff: false,
  },
];

function groupBySession(entries) {
  const map = {};
  entries.forEach((e) => {
    if (!map[e.session_id]) {
      map[e.session_id] = {
        session_id: e.session_id,
        user_email: e.user_email,
        messages: [],
      };
    }
    map[e.session_id].messages.push(e);
  });
  return Object.values(map)
    .map((s) => {
      s.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      s.timestamps = {
        start: s.messages[0].timestamp,
        end: s.messages[s.messages.length - 1].timestamp,
      };
      s.messageCount = s.messages.length;
      const intentMap = {};
      s.messages.forEach((m) =>
        m.intents.forEach((i) => {
          intentMap[i.name] = (intentMap[i.name] || 0) + 1;
        }),
      );
      s.intentSummary = Object.entries(intentMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      return s;
    })
    .sort(
      (a, b) => new Date(b.timestamps.start) - new Date(a.timestamps.start),
    );
}

function NLU() {
  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [expandedSessions, setExpandedSessions] = useState({});
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
    rawEntries.forEach((c) => {
      c.intents.forEach((i) => {
        intentCounts[i.name] = (intentCounts[i.name] || 0) + 1;
      });
    });
    return {
      totalConversations: rawEntries.length,
      uniqueSessions: uniqueSessions.size,
      uniqueUsers: new Set(rawEntries.map((c) => c.user_email)).size,
      topIntent: Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0],
      intentCounts,
    };
  }, []);

  return (
    <main className="dashboard-container">
      <div className="dashboard-headings">
        <h4>NLU Engine</h4>
        <p>
          Natural Language Understanding trained on NPFCU call logs &mdash;
          recognizes 50+ intent categories
        </p>
      </div>

      <IntentSummary stats={stats} allEntries={rawEntries} />

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

      <div className="nlu-conversation-list">
        {filteredSessions.map((session) => (
          <SessionCard
            key={session.session_id}
            session={session}
            expanded={!!expandedSessions[session.session_id]}
            onToggle={() => toggleSession(session.session_id)}
            viewMode={viewMode}
          />
        ))}
        {filteredSessions.length === 0 && (
          <div className="nlu-empty">
            No sessions match the current filters.
          </div>
        )}
      </div>
    </main>
  );
}

export default NLU;
