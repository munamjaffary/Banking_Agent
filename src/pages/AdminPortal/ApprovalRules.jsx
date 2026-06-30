const rules = [
  { type: "Rate Change", level: "Dual approval", who: "Manager → Senior Manager", escalation: "48 hours", lvlColor: "#0E3B36", lvlBg: "#E5EEEB" },
  { type: "Term Sheet Edit", level: "Dual approval", who: "Manager → Senior Manager", escalation: "48 hours", lvlColor: "#0E3B36", lvlBg: "#E5EEEB" },
  { type: "Fee Schedule", level: "Dual approval", who: "Manager → Compliance", escalation: "48 hours", lvlColor: "#0E3B36", lvlBg: "#E5EEEB" },
  { type: "Banner / Alert", level: "Single approval", who: "Manager only", escalation: "24 hours", lvlColor: "#9C6B3F", lvlBg: "#F6ECDA" },
  { type: "Page Content", level: "Single approval", who: "Manager only", escalation: "24 hours", lvlColor: "#9C6B3F", lvlBg: "#F6ECDA" },
  { type: "Chatbot FAQ", level: "Single approval", who: "Manager only", escalation: "24 hours", lvlColor: "#9C6B3F", lvlBg: "#F6ECDA" },
];

function ApprovalRules() {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1ECE0" }}>
        <div style={{ fontSize: "15px", fontWeight: 700 }}>Approval rules</div>
        <div style={{ fontSize: "12px", color: "#9A958A" }}>Configured by Super Admin · applies to all change requests</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.4fr 1fr", padding: "11px 22px", background: "#FBF9F4", fontSize: "10.5px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#9A958A" }}>
        <div>Change type</div>
        <div>Approval level</div>
        <div>Who approves</div>
        <div>Escalation</div>
      </div>
      {rules.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.4fr 1fr", alignItems: "center", padding: "15px 22px", borderTop: "1px solid #F1ECE0" }}>
          <div style={{ fontSize: "13.5px", fontWeight: 600 }}>{r.type}</div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: r.lvlColor, background: r.lvlBg, padding: "3px 9px", borderRadius: "20px" }}>{r.level}</span>
          </div>
          <div style={{ fontSize: "13px", color: "#5C5A52" }}>{r.who}</div>
          <div style={{ fontSize: "13px", color: "#5C5A52" }}>{r.escalation}</div>
        </div>
      ))}
      <div style={{ display: "flex", gap: "18px", padding: "16px 22px", background: "#FBF9F4", borderTop: "1px solid #F1ECE0", fontSize: "12px", color: "#6B6862" }}>
        <span>● Rejection requires a written comment</span>
        <span>● All changes logged in audit trail</span>
        <span>● Auto-escalation if no action in time</span>
      </div>
    </div>
  );
}

export default ApprovalRules;
