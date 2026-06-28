export const userRoles = {
  "munam.ali@integrationxperts.com": "Admin",
  "john.doe@example.com": "Manager",
  "jane.smith@example.com": "Agent",
  "bob.wilson@example.com": "Manager",
  "alice.johnson@example.com": "Analyst",
  "charlie.brown@example.com": "Agent",
  "diana.prince@example.com": "Manager",
};

export const rawEntries = [
  {
    _id: "6a3ed3ebdbbce96770b75f75",
    session_id: "munam.ali@integrationxperts.com_default",
    user_email: "munam.ali@integrationxperts.com",
    role: userRoles["munam.ali@integrationxperts.com"],
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
    role: userRoles["munam.ali@integrationxperts.com"],
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
    role: userRoles["john.doe@example.com"],
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
    role: userRoles["jane.smith@example.com"],
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
    role: userRoles["bob.wilson@example.com"],
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
    role: userRoles["alice.johnson@example.com"],
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
    role: userRoles["charlie.brown@example.com"],
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
    role: userRoles["diana.prince@example.com"],
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
  {
    _id: "6a3efa82fc49ca5383beb05d",
    session_id: "SessionID_c3d4e5f6-a7b8-9012-cdef-123456789012",
    user_email: "bob.wilson@example.com",
    role: userRoles["bob.wilson@example.com"],
    query: "Can I get a temporary card while I wait for the replacement?",
    response:
      "Yes, we can arrange a temporary digital card for immediate use. A physical replacement will arrive in 3-5 business days.",
    references: [{ title: "Card Replacement", url: "#" }],
    timestamp: "2026-06-27T10:05:00.000+00:00",
    intents: [
      { name: "cards", confidence: 0.92 },
      { name: "fraud", confidence: 0.75 },
    ],
    handoff: false,
  },
  {
    _id: "6a3efb82fc49ca5383beb05e",
    session_id: "SessionID_c3d4e5f6-a7b8-9012-cdef-123456789012",
    user_email: "bob.wilson@example.com",
    role: userRoles["bob.wilson@example.com"],
    query: "Will I be charged for unauthorized transactions?",
    response:
      "You are not liable for unauthorized transactions reported within 60 days. We will issue a provisional credit within 10 business days.",
    references: [{ title: "Fraud Liability Policy", url: "#" }],
    timestamp: "2026-06-27T10:10:00.000+00:00",
    intents: [{ name: "fraud", confidence: 0.99 }],
    handoff: false,
  },
  {
    _id: "6a3efc82fc49ca5383beb05f",
    session_id: "SessionID_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    user_email: "john.doe@example.com",
    role: userRoles["john.doe@example.com"],
    query: "What is the minimum balance for the Premium Savings account?",
    response:
      "The Premium Savings account requires a minimum daily balance of $5,000 to earn the 4.00% APY. Below that threshold, the rate drops to 1.50% APY.",
    references: [{ title: "Premium Savings Terms", url: "#" }],
    timestamp: "2026-06-27T08:20:00.000+00:00",
    intents: [
      { name: "rates", confidence: 0.93 },
      { name: "account", confidence: 0.88 },
    ],
    handoff: false,
  },
  {
    _id: "6a3efd82fc49ca5383beb060",
    session_id: "SessionID_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    user_email: "john.doe@example.com",
    role: userRoles["john.doe@example.com"],
    query: "Can I link my Premium Savings to my checking for overdraft protection?",
    response:
      "Yes, you can link your Premium Savings account for overdraft protection. Transfers are free and there is no limit on the number of transfers per month.",
    references: [{ title: "Overdraft Protection", url: "#" }],
    timestamp: "2026-06-27T08:25:00.000+00:00",
    intents: [
      { name: "account", confidence: 0.95 },
      { name: "payments", confidence: 0.72 },
    ],
    handoff: false,
  },
  {
    _id: "6a3efe82fc49ca5383beb061",
    session_id: "SessionID_d4e5f6a7-b8c9-0123-defa-234567890123",
    user_email: "alice.johnson@example.com",
    role: userRoles["alice.johnson@example.com"],
    query: "What are the benefits of NPFCU membership over traditional banks?",
    response:
      "NPFCU offers higher dividend rates on savings, lower loan rates, fewer fees, and profit-sharing dividends paid annually to members.",
    references: [{ title: "Membership Benefits", url: "#" }],
    timestamp: "2026-06-27T11:20:00.000+00:00",
    intents: [{ name: "membership", confidence: 0.94 }],
    handoff: false,
  },
  {
    _id: "6a3eff82fc49ca5383beb062",
    session_id: "SessionID_d4e5f6a7-b8c9-0123-defa-234567890123",
    user_email: "alice.johnson@example.com",
    role: userRoles["alice.johnson@example.com"],
    query: "Do you offer joint membership accounts?",
    response:
      "Yes, joint membership accounts are available. Both members must meet eligibility requirements and each member gets full access to all services.",
    references: [{ title: "Joint Membership", url: "#" }],
    timestamp: "2026-06-27T11:25:00.000+00:00",
    intents: [
      { name: "membership", confidence: 0.97 },
      { name: "account", confidence: 0.78 },
    ],
    handoff: false,
  },
];

export function groupBySession(entries) {
  const map = {};
  entries.forEach((e) => {
    if (!map[e.session_id]) {
      map[e.session_id] = {
        session_id: e.session_id,
        user_email: e.user_email,
        role: e.role,
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

export function nluSessionsToChats(entries) {
  const sessions = groupBySession(entries);
  return sessions.map((s, idx) => ({
    id: Date.now() + idx,
    title: s.messages[0]?.query?.substring(0, 30) + "...",
    messages: s.messages.flatMap((m) => [
      { role: "user", content: m.query, references: [] },
      {
        role: "assistant",
        content: m.response,
        references: m.references || [],
      },
    ]),
    user_email: s.user_email,
    user_role: s.role || "User",
    messageCount: s.messageCount,
  }));
}
