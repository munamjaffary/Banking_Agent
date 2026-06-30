import { useState } from "react";

const docs = [
  { name: "Truth in Savings Disclosure.pdf", updated: "Updated Apr 5 by M. Ali", category: "Disclosures", version: "v4", status: "Published", statusColor: "#0E3B36", statusBg: "#E5EEEB" },
  { name: "Membership Application.pdf", updated: "Updated Mar 28 by S. Patel", category: "Forms", version: "v7", status: "Published", statusColor: "#0E3B36", statusBg: "#E5EEEB" },
  { name: "Auto Loan Agreement.pdf", updated: "Updated Apr 9 by A. Khan", category: "Loan Docs", version: "v2", status: "Draft", statusColor: "#9C6B3F", statusBg: "#F6ECDA" },
  { name: "Fee Schedule 2026.pdf", updated: "Updated Jan 2 by System", category: "Disclosures", version: "v1", status: "Published", statusColor: "#0E3B36", statusBg: "#E5EEEB" },
  { name: "Wire Transfer Request.pdf", updated: "Updated Feb 14 by M. Ali", category: "Forms", version: "v3", status: "Published", statusColor: "#0E3B36", statusBg: "#E5EEEB" },
];

function DocumentsSection() {
  const [menuIdx, setMenuIdx] = useState(null);

  return (
    <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #F1ECE0" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700 }}>Documents &amp; forms</div>
          <div style={{ fontSize: "12px", color: "#9A958A" }}>Member download center · version-controlled</div>
        </div>
        <button style={{ fontSize: "13px", fontWeight: 600, color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "10px 16px", borderRadius: "9px", cursor: "pointer" }}>+ Upload</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr .7fr", padding: "11px 22px", background: "#FBF9F4", fontSize: "10.5px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#9A958A" }}>
        <div>Document</div>
        <div>Category</div>
        <div>Version</div>
        <div>Status</div>
        <div></div>
      </div>
      {docs.map((d, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr .7fr", alignItems: "center", padding: "14px 22px", borderTop: "1px solid #F1ECE0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#F6ECDA", color: "#9C6B3F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>▤</div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: "11px", color: "#9A958A" }}>{d.updated}</div>
            </div>
          </div>
          <div style={{ fontSize: "13px", color: "#5C5A52" }}>{d.category}</div>
          <div style={{ fontSize: "13px", color: "#5C5A52", fontVariantNumeric: "tabular-nums" }}>{d.version}</div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: d.statusColor, background: d.statusBg, padding: "3px 9px", borderRadius: "20px" }}>{d.status}</span>
          </div>
          <div style={{ position: "relative", textAlign: "right" }}>
            <button onClick={() => setMenuIdx(menuIdx === i ? null : i)}
              style={{ background: "none", border: "none", fontSize: "13px", color: "#9A958A", cursor: "pointer", padding: "4px 8px" }}>
              ⋯
            </button>
            {menuIdx === i && (
              <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", border: "1px solid #ECE6D8", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,.1)", zIndex: 10, minWidth: "120px" }}>
                <button style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 14px", fontSize: "13px", cursor: "pointer", borderRadius: "8px 8px 0 0" }}>Download</button>
                <button style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 14px", fontSize: "13px", cursor: "pointer" }}>Replace</button>
                <button style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 14px", fontSize: "13px", cursor: "pointer", borderRadius: "0 0 8px 8px", color: "#9C3F3F" }}>Archive</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DocumentsSection;
