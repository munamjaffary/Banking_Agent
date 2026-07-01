import { createSlice } from "@reduxjs/toolkit";

const INTENT_RULES = [
  { name: "rates", keywords: ["rate", "interest", "apr", "apy", "yield", "percentage"] },
  { name: "loans", keywords: ["loan", "mortgage", "borrow", "finance", "lending", "credit", "car loan", "home loan", "personal loan", "business loan"] },
  { name: "hours", keywords: ["hours", "open", "close", "timings", "branch", "location"] },
  { name: "cards", keywords: ["card", "credit card", "debit card", "visa", "mastercard", "credit limit"] },
  { name: "payments", keywords: ["payment", "pay", "transfer", "bill", "deposit", "wire"] },
  { name: "account", keywords: ["account", "balance", "statement", "summary", "transaction"] },
  { name: "fraud", keywords: ["fraud", "dispute", "unauthorized", "scam", "chargeback"] },
  { name: "membership", keywords: ["membership", "join", "register", "sign up", "enroll"] },
];

export function detectIntent(query) {
  const q = query.toLowerCase();
  const matched = new Set();
  INTENT_RULES.forEach(({ name, keywords }) => {
    if (keywords.some((kw) => q.includes(kw))) {
      matched.add(name);
    }
  });
  if (matched.size === 0) {
    return [{ name: "general", confidence: 0.98 }];
  }
  return [...matched].map((name, i) => ({
    name,
    confidence: Math.max(Math.round((1 - i * 0.15) * 100) / 100, 0.5),
  }));
}

const nluSlice = createSlice({
  name: "nlu",
  initialState: {
    entries: [],
  },
  reducers: {
    addNluEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    clearNluEntries: (state) => {
      state.entries = [];
    },
  },
});

export const { addNluEntry, clearNluEntries } = nluSlice.actions;
export default nluSlice.reducer;
