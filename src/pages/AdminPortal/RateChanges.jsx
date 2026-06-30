import { useState } from "react";

const PRODUCTS = {
  savings: { label: "APY", items: [
    { name: "Regular Savings", rate: 4.25, min: "$25" },
    { name: "Money Market", rate: 4.75, min: "$2,500" },
    { name: "Youth Savings", rate: 4.50, min: "$5" },
    { name: "Holiday Club", rate: 4.10, min: "$0" },
  ]},
  loans: { label: "APR", items: [
    { name: "New Auto Loan", rate: 5.75, min: "—" },
    { name: "Used Auto Loan", rate: 6.25, min: "—" },
    { name: "Personal Loan", rate: 9.99, min: "—" },
    { name: "HELOC", rate: 7.50, min: "—" },
  ]},
  cds: { label: "APY", items: [
    { name: "6-Month Certificate", rate: 4.90, min: "$500" },
    { name: "12-Month Certificate", rate: 5.10, min: "$500" },
    { name: "24-Month Certificate", rate: 4.85, min: "$500" },
    { name: "60-Month Certificate", rate: 4.60, min: "$1,000" },
  ]},
  mortgages: { label: "APR", items: [
    { name: "30-Year Fixed", rate: 6.25, min: "—" },
    { name: "15-Year Fixed", rate: 5.75, min: "—" },
    { name: "5/1 ARM", rate: 5.95, min: "—" },
    { name: "FHA Loan", rate: 6.10, min: "—" },
  ]},
};

function RateChanges() {
  const [cat, setCat] = useState("savings");
  const [prodIdx, setProdIdx] = useState(1);
  const [proposed, setProposed] = useState("4.90");
  const [effective, setEffective] = useState("");
  const [minBal, setMinBal] = useState("$2,500");
  const [justification, setJustification] = useState("Competitive rate adjustment to match regional credit union averages.");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const catData = PRODUCTS[cat];
  const idx = Math.min(prodIdx, catData.items.length - 1);
  const prod = catData.items[idx];
  const current = prod.rate;
  const proposedNum = parseFloat(proposed);
  const delta = (isNaN(proposedNum) ? 0 : proposedNum) - current;
  const deltaAbs = Math.abs(delta).toFixed(2);
  const deltaText = delta === 0 ? "No change" : (delta > 0 ? "▲ +" + deltaAbs + " pts increase" : "▼ −" + deltaAbs + " pts decrease");
  const deltaColor = delta === 0 ? "rgba(245,241,232,.7)" : (delta > 0 ? "#9FD6C6" : "#E8C9B0");

  const handleCatChange = (e) => {
    const newCat = e.target.value;
    const items = PRODUCTS[newCat].items;
    setCat(newCat);
    setProdIdx(0);
    setProposed(String(items[0].rate.toFixed(2)));
    setMinBal(items[0].min);
  };

  const handleProdChange = (e) => {
    const i = +e.target.value;
    const it = PRODUCTS[cat].items[i];
    setProdIdx(i);
    setProposed(String(it.rate.toFixed(2)));
    setMinBal(it.min);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", alignItems: "start" }}>
      <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <h2 style={{ fontFamily: "'Newsreader',serif", fontSize: "24px", fontWeight: 500, color: "#0E3B36", margin: 0 }}>
            New rate change request
          </h2>
        </div>
        <p style={{ fontSize: "13px", color: "#9A958A", margin: "0 0 22px" }}>
          Changes route through the dual-approval workflow before publishing.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Product category</label>
            <select value={cat} onChange={handleCatChange} style={{ width: "100%", fontSize: "14px", padding: "11px 13px", border: "1px solid #E3DCCB", borderRadius: "9px", background: "#FBF9F4" }}>
              <option value="savings">Savings</option>
              <option value="loans">Loans</option>
              <option value="cds">Certificates</option>
              <option value="mortgages">Mortgages</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Product</label>
            <select value={prodIdx} onChange={handleProdChange} style={{ width: "100%", fontSize: "14px", padding: "11px 13px", border: "1px solid #E3DCCB", borderRadius: "9px", background: "#FBF9F4" }}>
              {catData.items.map((it, i) => (
                <option key={i} value={i}>{it.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Current {catData.label} (auto-filled)</label>
            <div style={{ fontSize: "14px", padding: "11px 13px", border: "1px solid #ECE6D8", borderRadius: "9px", background: "#F4F1EA", color: "#6B6862", fontVariantNumeric: "tabular-nums" }}>
              {current.toFixed(2)}%
            </div>
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Proposed {catData.label}</label>
            <input type="number" step="0.01" value={proposed} onChange={(e) => setProposed(e.target.value)}
              style={{ width: "100%", fontSize: "14px", padding: "11px 13px", border: "1.5px solid #0E3B36", borderRadius: "9px", background: "#fff", fontVariantNumeric: "tabular-nums" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Effective date</label>
            <input type="date" value={effective} onChange={(e) => setEffective(e.target.value)}
              style={{ width: "100%", fontSize: "14px", padding: "11px 13px", border: "1px solid #E3DCCB", borderRadius: "9px", background: "#FBF9F4" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Minimum balance</label>
            <input type="text" value={minBal} onChange={(e) => setMinBal(e.target.value)}
              style={{ width: "100%", fontSize: "14px", padding: "11px 13px", border: "1px solid #E3DCCB", borderRadius: "9px", background: "#FBF9F4" }} />
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6862", display: "block", marginBottom: "7px" }}>Justification / notes</label>
          <textarea rows="3" value={justification} onChange={(e) => setJustification(e.target.value)}
            style={{ width: "100%", fontSize: "14px", padding: "11px 13px", border: "1px solid #E3DCCB", borderRadius: "9px", background: "#FBF9F4", resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <button onClick={() => { showToast("Request submitted — routed to Senior Manager for approval."); }}
            style={{ fontSize: "14px", fontWeight: 600, color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "13px 22px", borderRadius: "9px", cursor: "pointer" }}>
            Submit for approval
          </button>
          <button onClick={() => showToast("Draft saved.")}
            style={{ fontSize: "14px", fontWeight: 600, color: "#0E3B36", background: "#F1ECE0", border: "none", padding: "13px 22px", borderRadius: "9px", cursor: "pointer" }}>
            Save as draft
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ background: "#0E3B36", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6E9C92", marginBottom: "14px" }}>Change preview</div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#F5F1E8" }}>{prod.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "14px 0" }}>
            <span style={{ fontFamily: "'Newsreader',serif", fontSize: "30px", color: "rgba(245,241,232,.55)", fontVariantNumeric: "tabular-nums" }}>{current.toFixed(2)}%</span>
            <span style={{ color: "#C8A24C", fontSize: "20px" }}>→</span>
            <span style={{ fontFamily: "'Newsreader',serif", fontSize: "30px", color: "#C8A24C", fontVariantNumeric: "tabular-nums" }}>
              {isNaN(proposedNum) ? "—" : proposedNum.toFixed(2) + "%"}
            </span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: deltaColor, background: "rgba(255,255,255,.08)", padding: "5px 11px", borderRadius: "20px" }}>
            {deltaText}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(245,241,232,.6)", lineHeight: 1.5, marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,.12)" }}>
            Appears on the member-facing Rates page and syncs to the chatbot after approval.
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "16px", padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700 }}>Approval chain</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#9C6B3F", background: "#F6ECDA", padding: "3px 9px", borderRadius: "20px" }}>Dual approval</span>
          </div>
          {[
            { step: "1", title: "You (Manager)", sub: "Submit request", bg: "#0E3B36", fg: "#C8A24C" },
            { step: "2", title: "Senior Manager", sub: "First approval", bg: "#F1ECE0", fg: "#9A958A" },
            { step: "3", title: "Compliance", sub: "Final approval", bg: "#F1ECE0", fg: "#9A958A" },
            { step: "4", title: "System", sub: "Auto-publish & sync", bg: "#F1ECE0", fg: "#9A958A", noLine: true },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: s.bg, color: s.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                  {s.step}
                </div>
                {!s.noLine && <div style={{ width: "2px", height: "26px", background: "#E3DCCB" }} />}
              </div>
              <div style={{ paddingTop: "3px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: "11px", color: "#9A958A" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)", zIndex: 90, background: "#0A2C28", color: "#F5F1E8", padding: "14px 22px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(10,44,40,.3)", display: "flex", alignItems: "center", gap: "12px", animation: "slideUp .25s ease both" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#6E9C92", color: "#0A2C28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}>✓</div>
          <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default RateChanges;
