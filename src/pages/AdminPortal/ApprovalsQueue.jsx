import { useState } from "react";

const pendingItems = [
  { id: 1, title: "Auto Loan rate · 5.99% → 5.75%", by: "A. Khan", type: "Rate Change", date: "Submitted Apr 8", approval: "Dual", tagColor: "#0E3B36", tagBg: "#E5EEEB" },
  { id: 2, title: "Money Market APY · 4.75% → 4.90%", by: "A. Khan", type: "Rate Change", date: "Submitted Apr 8", approval: "Dual", tagColor: "#0E3B36", tagBg: "#E5EEEB" },
  { id: 3, title: "CD 12-Mo rate · 5.10% → 5.25%", by: "A. Khan", type: "Rate Change", date: "Submitted Apr 8", approval: "Dual", tagColor: "#0E3B36", tagBg: "#E5EEEB" },
  { id: 4, title: "Holiday hours banner — Ramadan", by: "S. Patel", type: "Banner", date: "Submitted Apr 7", approval: "Single", tagColor: "#9C6B3F", tagBg: "#F6ECDA" },
  { id: 5, title: "Membership page — new benefits", by: "M. Ali", type: "Content", date: "Submitted Apr 6", approval: "Single", tagColor: "#9C6B3F", tagBg: "#F6ECDA" },
];

function ApprovalsQueue() {
  const [selectedId, setSelectedId] = useState(null);
  const [decision, setDecision] = useState(null);
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  if (selectedId) {
    const item = pendingItems.find((p) => p.id === selectedId);
    const dec = decision;
    const progressStep = dec === "approved" ? 3 : 2;
    const mkProg = () => {
      const reviewed = !!dec;
      const rows = [
        { title: "Submitted by A. Khan", sub: "Apr 8, 2:30 PM", st: "done" },
        { title: "Your review", sub: dec ? (dec === "approved" ? "Approved just now" : "Actioned just now") : "In progress · your turn", st: dec ? (dec === "approved" ? "done" : "stop") : "active" },
        { title: "Senior Manager review", sub: dec === "approved" ? "Notified · pending" : "Waiting", st: dec === "approved" ? "active" : "wait" },
        { title: "Auto-publish to site", sub: "—", st: "wait" },
      ];
      const styleFor = (st) => {
        if (st === "done") return { bg: "#0E3B36", fg: "#C8A24C", icon: "✓", line: "#0E3B36", titleColor: "#1B1A16" };
        if (st === "active") return { bg: "#C8A24C", fg: "#0A2C28", icon: "●", line: "#E3DCCB", titleColor: "#1B1A16" };
        if (st === "stop") return { bg: "#9C3F3F", fg: "#fff", icon: "✕", line: "#E3DCCB", titleColor: "#1B1A16" };
        return { bg: "#F1ECE0", fg: "#9A958A", icon: "○", line: "#E3DCCB", titleColor: "#9A958A" };
      };
      return rows.map((r) => ({ title: r.title, sub: r.sub, ...styleFor(r.st) }));
    };
    const progress = mkProg();

    return (
      <div>
        <button onClick={() => { setSelectedId(null); setDecision(null); setComment(""); }}
          style={{ fontSize: "12.5px", fontWeight: 600, color: "#6B6862", background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: "14px" }}>
          ← Back to queue
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#9C6B3F" }}>{item.type}</div>
                <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "24px", fontWeight: 500, color: "#0E3B36", margin: "6px 0 0" }}>{item.title}</h2>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#9C6B3F", background: "#F6ECDA", padding: "5px 11px", borderRadius: "20px" }}>Awaiting review</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", margin: "24px 0", padding: "20px", background: "#FBF9F4", borderRadius: "12px" }}>
              <div><div style={{ fontSize: "11px", color: "#9A958A" }}>Request ID</div><div style={{ fontSize: "14px", fontWeight: 600, color: "#1B1A16" }}>RC-2026-0{selectedId}</div></div>
              <div><div style={{ fontSize: "11px", color: "#9A958A" }}>Submitted by</div><div style={{ fontSize: "14px", fontWeight: 600, color: "#1B1A16" }}>{item.by}</div></div>
              <div><div style={{ fontSize: "11px", color: "#9A958A" }}>Current rate</div><div style={{ fontSize: "14px", fontWeight: 600, color: "#1B1A16", fontVariantNumeric: "tabular-nums" }}>{item.title.match(/[\d.]+%/)?.[0] || "—"}</div></div>
              <div><div style={{ fontSize: "11px", color: "#9A958A" }}>Effective date</div><div style={{ fontSize: "14px", fontWeight: 600, color: "#1B1A16" }}>April 15, 2026</div></div>
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", marginBottom: "6px" }}>Justification</div>
            <p style={{ fontSize: "13.5px", color: "#3F3D38", lineHeight: 1.6, margin: "0 0 22px", padding: "14px 16px", background: "#FBF9F4", borderRadius: "10px", borderLeft: "3px solid #C8A24C" }}>
              Competitive rate adjustment to match regional credit union averages. Fed rate increase supports the proposed change.
            </p>

            {!decision && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>Your decision</div>
                <textarea rows="2" value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment (required if rejecting)…"
                  style={{ width: "100%", fontSize: "13.5px", padding: "11px 13px", border: "1px solid #E3DCCB", borderRadius: "9px", background: "#FBF9F4", resize: "vertical", marginBottom: "14px" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { setDecision("approved"); showToast("Approved — forwarded to Senior Manager."); }}
                    style={{ fontSize: "14px", fontWeight: 600, color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "13px 22px", borderRadius: "9px", cursor: "pointer" }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => { setDecision("rejected"); showToast("Rejected — submitter notified."); }}
                    style={{ fontSize: "14px", fontWeight: 600, color: "#9C3F3F", background: "#F7E9E5", border: "none", padding: "13px 22px", borderRadius: "9px", cursor: "pointer" }}>
                    Reject
                  </button>
                  <button onClick={() => { setDecision("changes"); showToast("Changes requested — returned to submitter."); }}
                    style={{ fontSize: "14px", fontWeight: 600, color: "#3F3D38", background: "#F1ECE0", border: "none", padding: "13px 22px", borderRadius: "9px", cursor: "pointer" }}>
                    Request changes
                  </button>
                </div>
              </div>
            )}

            {decision && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px", background: decision === "approved" ? "#E5EEEB" : decision === "rejected" ? "#F7E9E5" : "#F6ECDA", borderRadius: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: decision === "approved" ? "#0E3B36" : decision === "rejected" ? "#9C3F3F" : "#9C6B3F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {decision === "approved" ? "✓" : decision === "rejected" ? "✕" : "↺"}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: decision === "approved" ? "#0E3B36" : decision === "rejected" ? "#9C3F3F" : "#9C6B3F" }}>
                    {decision === "approved" ? "Approved — sent to Senior Manager" : decision === "rejected" ? "Rejected — returned to submitter" : "Changes requested"}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#5C5A52" }}>
                    {decision === "approved" ? "Step 2 of 4 complete. Awaiting final sign-off, then auto-publish." : "A. Khan has been notified."}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#0E3B36", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6E9C92", marginBottom: "18px" }}>Rate comparison</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "rgba(245,241,232,.55)" }}>CURRENT</div>
                  <div style={{ fontFamily: "'Newsreader',serif", fontSize: "34px", color: "rgba(245,241,232,.7)", fontVariantNumeric: "tabular-nums" }}>5.99%</div>
                  <div style={{ fontSize: "10px", color: "rgba(245,241,232,.45)" }}>APR</div>
                </div>
                <span style={{ color: "#C8A24C", fontSize: "24px" }}>→</span>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#C8A24C" }}>PROPOSED</div>
                  <div style={{ fontFamily: "'Newsreader',serif", fontSize: "34px", color: "#C8A24C", fontVariantNumeric: "tabular-nums" }}>5.75%</div>
                  <div style={{ fontSize: "10px", color: "rgba(245,241,232,.45)" }}>APR</div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "rgba(245,241,232,.65)", lineHeight: 1.5, marginTop: "18px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.12)" }}>
                Est. impact: ~$8,200/yr in additional interest cost across the current auto-loan portfolio. Within approved margin tolerance.
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", padding: "22px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>Approval progress · step {progressStep} of 4</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {progress.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: g.bg, color: g.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>{g.icon}</div>
                      {i < progress.length - 1 && <div style={{ width: "2px", height: "22px", background: g.line }} />}
                    </div>
                    <div style={{ paddingTop: "2px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: g.titleColor }}>{g.title}</div>
                      <div style={{ fontSize: "11px", color: "#9A958A" }}>{g.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div style={{ position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)", zIndex: 90, background: "#0A2C28", color: "#F5F1E8", padding: "14px 22px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(10,44,40,.3)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#6E9C92", color: "#0A2C28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}>✓</div>
            <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{toast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1ECE0" }}>
        <div style={{ fontSize: "15px", fontWeight: 700 }}>Approval queue</div>
        <div style={{ fontSize: "12px", color: "#9A958A" }}>{pendingItems.length} items awaiting your review · oldest auto-escalates in 36h</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr .8fr", padding: "11px 22px", background: "#FBF9F4", fontSize: "10.5px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#9A958A" }}>
        <div>Change request</div>
        <div>Submitted by</div>
        <div>Type</div>
        <div>Approval</div>
        <div></div>
      </div>
      {pendingItems.map((p) => (
        <button key={p.id} onClick={() => setSelectedId(p.id)}
          style={{ width: "100%", textAlign: "left", display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr .8fr", alignItems: "center", padding: "15px 22px", borderTop: "1px solid #F1ECE0", background: "transparent", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#1B1A16" }}>{p.title}</div>
            <div style={{ fontSize: "11px", color: "#9A958A" }}>{p.date}</div>
          </div>
          <div style={{ fontSize: "13px", color: "#5C5A52" }}>{p.by}</div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: p.tagColor, background: p.tagBg, padding: "3px 9px", borderRadius: "20px" }}>{p.type}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#5C5A52" }}>{p.approval}</div>
          <div style={{ textAlign: "right", fontSize: "13px", fontWeight: 600, color: "#0E3B36" }}>Review →</div>
        </button>
      ))}
    </div>
  );
}

export default ApprovalsQueue;
