export const userRoles = {
  "munam.ali@integrationxperts.com": "Admin",
  "john.doe@example.com": "Manager",
  "jane.smith@example.com": "Agent",
  "bob.wilson@example.com": "Manager",
  "alice.johnson@example.com": "Analyst",
  "charlie.brown@example.com": "Agent",
  "diana.prince@example.com": "Manager",
  "anonymous@guest": "Anonymous",
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
  {
    _id: "6a3f0082fc49ca5383beb063",
    session_id: "SessionID_g1h2i3j4-k5l6-7890-mnop-qrst1234567890",
    user_email: "jane.smith@example.com",
    role: userRoles["jane.smith@example.com"],
    query: "Can I set up automatic payments for my credit card?",
    response:
      "Yes, you can enroll in automatic payments through online banking. Choose the full statement balance or a fixed amount each month.",
    references: [{ title: "AutoPay Setup", url: "#" }],
    timestamp: "2026-06-27T14:00:00.000+00:00",
    intents: [
      { name: "payments", confidence: 0.96 },
      { name: "cards", confidence: 0.82 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0182fc49ca5383beb064",
    session_id: "SessionID_g1h2i3j4-k5l6-7890-mnop-qrst1234567890",
    user_email: "jane.smith@example.com",
    role: userRoles["jane.smith@example.com"],
    query: "Is there a fee for credit card payments?",
    response:
      "There are no fees for online or automatic credit card payments. Late payments may incur a fee of $35 after the grace period.",
    references: [{ title: "Fee Schedule", url: "#" }],
    timestamp: "2026-06-27T14:05:00.000+00:00",
    intents: [
      { name: "payments", confidence: 0.91 },
      { name: "cards", confidence: 0.78 },
    ],
    handoff: true,
    handoffReason: "Customer requested specific fee waiver eligibility",
  },
  {
    _id: "6a3f0282fc49ca5383beb065",
    session_id: "SessionID_h2i3j4k5-l6m7-8901-nopq-rstu2345678901",
    user_email: "charlie.brown@example.com",
    role: userRoles["charlie.brown@example.com"],
    query: "What types of credit cards does NPFCU offer?",
    response:
      "We offer Cashback Rewards (1.5% on all purchases), Travel Rewards (2x points on travel), and Low-Interest (8.99% APR) credit cards.",
    references: [{ title: "Credit Card Options", url: "#" }],
    timestamp: "2026-06-27T15:00:00.000+00:00",
    intents: [
      { name: "cards", confidence: 0.98 },
      { name: "rates", confidence: 0.74 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0382fc49ca5383beb066",
    session_id: "SessionID_h2i3j4k5-l6m7-8901-nopq-rstu2345678901",
    user_email: "charlie.brown@example.com",
    role: userRoles["charlie.brown@example.com"],
    query: "How long does it take to get approved for a credit card?",
    response:
      "Most applications are processed within 2-3 business days. Instant approvals are available for existing members with good standing.",
    references: [{ title: "Card Approval Process", url: "#" }],
    timestamp: "2026-06-27T15:05:00.000+00:00",
    intents: [{ name: "cards", confidence: 0.94 }],
    handoff: false,
  },
  {
    _id: "6a3f0482fc49ca5383beb067",
    session_id: "SessionID_i3j4k5l6-m7n8-9012-opqr-stuv3456789012",
    user_email: "diana.prince@example.com",
    role: userRoles["diana.prince@example.com"],
    query: "How do I check my loan application status?",
    response:
      "You can check your loan application status through online banking under 'Loan Applications' or call our support line.",
    references: [{ title: "Loan Application Tracking", url: "#" }],
    timestamp: "2026-06-28T09:00:00.000+00:00",
    intents: [
      { name: "loans", confidence: 0.93 },
      { name: "account", confidence: 0.81 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0582fc49ca5383beb068",
    session_id: "SessionID_i3j4k5l6-m7n8-9012-opqr-stuv3456789012",
    user_email: "diana.prince@example.com",
    role: userRoles["diana.prince@example.com"],
    query: "What is the typical interest rate for a personal loan?",
    response:
      "Personal loan rates start at 6.99% APR for qualified borrowers. Rates vary based on credit history, loan amount, and term length.",
    references: [{ title: "Personal Loan Rates", url: "#" }],
    timestamp: "2026-06-28T09:05:00.000+00:00",
    intents: [
      { name: "rates", confidence: 0.96 },
      { name: "loans", confidence: 0.88 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0682fc49ca5383beb069",
    session_id: "SessionID_j4k5l6m7-n8o9-0123-pqrs-tuvw4567890123",
    user_email: "munam.ali@integrationxperts.com",
    role: userRoles["munam.ali@integrationxperts.com"],
    query: "I think someone accessed my account without permission",
    response:
      "I'm sorry to hear that. Let me connect you to our fraud department immediately. Please verify your identity first.",
    references: [{ title: "Fraud Reporting", url: "#" }],
    timestamp: "2026-06-28T10:30:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.99 },
      { name: "account", confidence: 0.92 },
    ],
    handoff: true,
    handoffReason: "Fraud alert required immediate agent escalation",
  },
  {
    _id: "6a3f0782fc49ca5383beb070",
    session_id: "SessionID_j4k5l6m7-n8o9-0123-pqrs-tuvw4567890123",
    user_email: "munam.ali@integrationxperts.com",
    role: userRoles["munam.ali@integrationxperts.com"],
    query: "Can you freeze my account while we investigate?",
    response:
      "Yes, I have placed a temporary freeze on your account. No transactions can be processed until you or the fraud team lifts the freeze.",
    references: [{ title: "Account Freeze Policy", url: "#" }],
    timestamp: "2026-06-28T10:35:00.000+00:00",
    intents: [
      { name: "account", confidence: 0.97 },
      { name: "fraud", confidence: 0.93 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0882fc49ca5383beb071",
    session_id: "SessionID_k5l6m7n8-o9p0-1234-qrst-uvwx5678901234",
    user_email: "bob.wilson@example.com",
    role: userRoles["bob.wilson@example.com"],
    query: "What is the process for disputing a charge?",
    response:
      "You can file a dispute online through our portal or by visiting any branch. Disputes must be filed within 60 days of the statement date.",
    references: [{ title: "Dispute Process", url: "#" }],
    timestamp: "2026-06-28T11:00:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.88 },
      { name: "payments", confidence: 0.85 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0982fc49ca5383beb072",
    session_id: "SessionID_k5l6m7n8-o9p0-1234-qrst-uvwx5678901234",
    user_email: "bob.wilson@example.com",
    role: userRoles["bob.wilson@example.com"],
    query: "Will I get a refund while the dispute is being investigated?",
    response:
      "Yes, provisional credit is typically issued within 10 business days of filing a valid dispute while the investigation is underway.",
    references: [{ title: "Dispute Credit Policy", url: "#" }],
    timestamp: "2026-06-28T11:05:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.91 },
      { name: "payments", confidence: 0.79 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0a82fc49ca5383beb073",
    session_id: "SessionID_l6m7n8o9-p0q1-2345-rstu-vwxy6789012345",
    user_email: "alice.johnson@example.com",
    role: userRoles["alice.johnson@example.com"],
    query: "How do I add someone as an authorized user on my account?",
    response:
      "To add an authorized user, log into online banking, navigate to Account Settings, and select 'Add Authorized User'. You'll need their name and date of birth.",
    references: [{ title: "Authorized User Guide", url: "#" }],
    timestamp: "2026-06-28T14:00:00.000+00:00",
    intents: [
      { name: "account", confidence: 0.95 },
      { name: "membership", confidence: 0.72 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0b82fc49ca5383beb074",
    session_id: "SessionID_l6m7n8o9-p0q1-2345-rstu-vwxy6789012345",
    user_email: "alice.johnson@example.com",
    role: userRoles["alice.johnson@example.com"],
    query: "Can authorized users have their own debit cards?",
    response:
      "Yes, authorized users over 16 can receive their own debit card with individual spending limits set by the primary account holder.",
    references: [{ title: "Authorized User Cards", url: "#" }],
    timestamp: "2026-06-28T14:05:00.000+00:00",
    intents: [
      { name: "cards", confidence: 0.87 },
      { name: "account", confidence: 0.84 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0c82fc49ca5383beb075",
    session_id: "SessionID_m7n8o9p0-q1r2-3456-stuv-wxyz7890123456",
    user_email: "john.doe@example.com",
    role: userRoles["john.doe@example.com"],
    query: "Are there any promotional rates for new savings accounts?",
    response:
      "Yes, new members can enjoy a 4.50% APY promotional rate on High-Yield Savings for the first 6 months. Terms and conditions apply.",
    references: [{ title: "Promotional Rates", url: "#" }],
    timestamp: "2026-06-28T15:00:00.000+00:00",
    intents: [
      { name: "rates", confidence: 0.97 },
      { name: "account", confidence: 0.85 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0d82fc49ca5383beb076",
    session_id: "SessionID_m7n8o9p0-q1r2-3456-stuv-wxyz7890123456",
    user_email: "john.doe@example.com",
    role: userRoles["john.doe@example.com"],
    query: "What happens after the promotional period ends?",
    response:
      "After the promotional period, the rate reverts to the standard High-Yield Savings APY of 3.50%. We will notify you 30 days before the change.",
    references: [{ title: "Rate Change Policy", url: "#" }],
    timestamp: "2026-06-28T15:05:00.000+00:00",
    intents: [
      { name: "rates", confidence: 0.94 },
      { name: "account", confidence: 0.76 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0e82fc49ca5383beb077",
    session_id: "anonymous_session_001",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "What are your current mortgage rates?",
    response:
      "Our current 30-year fixed mortgage rate starts at 5.75% APR. 15-year fixed is available from 4.99% APR. Would you like a personalized quote?",
    references: [
      { title: "Mortgage Rates", url: "#" },
      { title: "Apply Online", url: "#" },
    ],
    timestamp: "2026-06-29T08:00:00.000+00:00",
    intents: [
      { name: "rates", confidence: 0.96 },
      { name: "loans", confidence: 0.82 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f0f82fc49ca5383beb078",
    session_id: "anonymous_session_001",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "What documents do I need for a mortgage application?",
    response:
      "For a mortgage application you'll need: W-2 forms from the last 2 years, tax returns, bank statements (last 2 months), pay stubs (last 30 days), and a valid government ID.",
    references: [{ title: "Mortgage Requirements", url: "#" }],
    timestamp: "2026-06-29T08:02:00.000+00:00",
    intents: [
      { name: "loans", confidence: 0.95 },
      { name: "account", confidence: 0.68 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1082fc49ca5383beb079",
    session_id: "anonymous_session_001",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "What is the minimum down payment for a first-time home buyer?",
    response:
      "First-time home buyers may qualify for as little as 3% down with conventional loans. FHA loans require 3.5% down. NPFCU offers special programs for first-time buyers with reduced closing costs.",
    references: [
      { title: "First-Time Buyer Programs", url: "#" },
      { title: "Down Payment Assistance", url: "#" },
    ],
    timestamp: "2026-06-29T08:05:00.000+00:00",
    intents: [
      { name: "loans", confidence: 0.97 },
      { name: "general", confidence: 0.71 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1182fc49ca5383beb080",
    session_id: "anonymous_session_002",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "How do I reset my online banking password?",
    response:
      "You can reset your password by clicking 'Forgot Password' on the login page. You'll receive a verification code via email or SMS to complete the reset.",
    references: [{ title: "Password Reset Guide", url: "#" }],
    timestamp: "2026-06-29T14:30:00.000+00:00",
    intents: [
      { name: "account", confidence: 0.98 },
      { name: "general", confidence: 0.75 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1282fc49ca5383beb081",
    session_id: "anonymous_session_002",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "Is there a mobile app for NPFCU?",
    response:
      "Yes, NPFCU offers a mobile app available on iOS and Android. You can deposit checks, transfer funds, pay bills, and locate branches from the app.",
    references: [{ title: "Mobile App Download", url: "#" }],
    timestamp: "2026-06-29T14:32:00.000+00:00",
    intents: [
      { name: "account", confidence: 0.91 },
      { name: "general", confidence: 0.84 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1382fc49ca5383beb082",
    session_id: "anonymous_session_002",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "Does the mobile app support biometric login?",
    response:
      "Yes, our mobile app supports both fingerprint and facial recognition login on compatible devices for secure and convenient access.",
    references: [{ title: "Mobile App Features", url: "#" }],
    timestamp: "2026-06-29T14:35:00.000+00:00",
    intents: [{ name: "account", confidence: 0.93 }],
    handoff: false,
  },
  {
    _id: "6a3f1482fc49ca5383beb083",
    session_id: "anonymous_session_003",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "What are the benefits of a credit union vs a bank?",
    response:
      "Credit unions are member-owned nonprofits, which typically means lower loan rates, higher savings rates, fewer fees, and personalized service. NPFCU returns profits to members through dividends.",
    references: [
      { title: "Why Choose a Credit Union", url: "#" },
      { title: "NPFCU Membership Benefits", url: "#" },
    ],
    timestamp: "2026-06-30T09:00:00.000+00:00",
    intents: [
      { name: "membership", confidence: 0.96 },
      { name: "general", confidence: 0.88 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1582fc49ca5383beb084",
    session_id: "anonymous_session_003",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "Can I open an account online?",
    response:
      "Yes, you can open an NPFCU account entirely online in about 10 minutes. You'll need your ID, Social Security number, and a minimum $5 deposit to get started.",
    references: [{ title: "Open an Account Online", url: "#" }],
    timestamp: "2026-06-30T09:03:00.000+00:00",
    intents: [
      { name: "membership", confidence: 0.97 },
      { name: "account", confidence: 0.85 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1682fc49ca5383beb085",
    session_id: "anonymous_session_003",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "What is the minimum age requirement for membership?",
    response:
      "You must be at least 18 years old to open a membership account. For minors under 18, a parent or guardian can open a joint account or a custodial account.",
    references: [{ title: "Membership Eligibility", url: "#" }],
    timestamp: "2026-06-30T09:06:00.000+00:00",
    intents: [
      { name: "membership", confidence: 0.94 },
      { name: "general", confidence: 0.72 },
    ],
    handoff: true,
    handoffReason: "Customer asked about minor account options requiring specialist",
  },
  {
    _id: "6a3f1782fc49ca5383beb086",
    session_id: "anonymous_session_004",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "What should I do if I see unauthorized transactions?",
    response:
      "If you see unauthorized transactions, contact us immediately at 1-800-NPFCU-NOW. Your liability is limited if reported within 60 days. We'll issue provisional credit within 10 business days.",
    references: [
      { title: "Fraud Reporting", url: "#" },
      { title: "Dispute Process", url: "#" },
    ],
    timestamp: "2026-06-30T11:15:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.99 },
      { name: "account", confidence: 0.90 },
    ],
    handoff: true,
    handoffReason: "Potential fraud case required immediate escalation",
  },
  {
    _id: "6a3f1882fc49ca5383beb087",
    session_id: "anonymous_session_004",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "How does NPFCU protect my personal information?",
    response:
      "NPFCU uses 256-bit encryption, multi-factor authentication, 24/7 fraud monitoring, and guaranteed zero-liability on unauthorized transactions to protect your information.",
    references: [
      { title: "Security Center", url: "#" },
      { title: "Privacy Policy", url: "#" },
    ],
    timestamp: "2026-06-30T11:18:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.92 },
      { name: "account", confidence: 0.83 },
    ],
    handoff: false,
  },
  {
    _id: "6a3f1982fc49ca5383beb088",
    session_id: "anonymous_session_004",
    user_email: "anonymous@guest",
    role: userRoles["anonymous@guest"],
    query: "Do you offer identity theft protection services?",
    response:
      "Yes, NPFCU offers identity theft protection including credit monitoring, identity restoration support, and up to $25,000 in identity theft insurance with our premium accounts.",
    references: [{ title: "Identity Theft Protection", url: "#" }],
    timestamp: "2026-06-30T11:22:00.000+00:00",
    intents: [
      { name: "fraud", confidence: 0.95 },
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
