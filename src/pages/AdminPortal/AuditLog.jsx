const auditLog = [
  { time: "Apr 8 · 2:30p", user: "J. Smith", action: "Updated Regular Savings APY 4.00% → 4.25%", result: "Published", color: "#0E3B36", bg: "#E5EEEB" },
  { time: "Apr 8 · 1:12p", user: "A. Khan", action: "Submitted Auto Loan rate change for approval", result: "Pending", color: "#9C6B3F", bg: "#F6ECDA" },
  { time: "Apr 7 · 11:05a", user: "A. Khan", action: "Published holiday hours banner", result: "Published", color: "#0E3B36", bg: "#E5EEEB" },
  { time: "Apr 7 · 9:40a", user: "J. Khan", action: "Rejected Money Market change — needs justification", result: "Rejected", color: "#9C3F3F", bg: "#F7E9E5" },
  { time: "Apr 6 · 3:00a", user: "System", action: "Synced chatbot knowledge base (42 entries)", result: "Auto", color: "#5C5A52", bg: "#F1ECE0" },
  { time: "Apr 5 · 4:18p", user: "M. Ali", action: "Uploaded Truth in Savings Disclosure v4", result: "Published", color: "#0E3B36", bg: "#E5EEEB" },
];

function AuditLog() {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #F1ECE0" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700 }}>Audit log</div>
          <div style={{ fontSize: "12px", color: "#9A958A" }}>Immutable record of every change · exportable for NCUA</div>
        </div>
        <button style={{ fontSize: "13px", fontWeight: 600, color: "#0E3B36", background: "#F1ECE0", border: "none", padding: "10px 16px", borderRadius: "9px", cursor: "pointer" }}>
          Export CSV
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: ".9fr 1fr 2fr 1fr", padding: "11px 22px", background: "#FBF9F4", fontSize: "10.5px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#9A958A" }}>
        <div>Timestamp</div>
        <div>User</div>
        <div>Action</div>
        <div>Result</div>
      </div>
      {auditLog.map((l, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: ".9fr 1fr 2fr 1fr", alignItems: "center", padding: "13px 22px", borderTop: "1px solid #F1ECE0" }}>
          <div style={{ fontSize: "12.5px", color: "#9A958A", fontVariantNumeric: "tabular-nums" }}>{l.time}</div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#1B1A16" }}>{l.user}</div>
          <div style={{ fontSize: "13px", color: "#3F3D38" }}>{l.action}</div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: l.color, background: l.bg, padding: "3px 9px", borderRadius: "20px" }}>{l.result}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuditLog;
