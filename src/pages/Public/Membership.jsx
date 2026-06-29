import { useNavigate } from "react-router-dom";

function Membership() {
  const navigate = useNavigate();

  return (
    <div>
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 28px 50px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "16px" }}>
          <span style={{ width: "18px", height: "1px", background: "#9C6B3F" }}></span>Membership
        </div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "56px", fontWeight: "500", lineHeight: "1.04", letterSpacing: "-.015em", color: "#0E3B36", margin: "0 0 16px" }}>Becoming a member</h1>
        <p style={{ fontSize: "17px", lineHeight: "1.6", color: "#5C5A52", margin: "0", maxWidth: "600px" }}>
          Membership at NPFCU is open to the Nizari community, their families, and select employer groups. Once you join, you're an owner — not just a customer.
        </p>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: "48px", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "30px", fontWeight: "500", color: "#0E3B36", margin: "0 0 28px" }}>How to join in 3 steps</h2>
            {[
              { num: "1", title: "Check eligibility", desc: "Open to the Nizari community, their families, and select employer groups." },
              { num: "2", title: "Open a Share Savings", desc: "$25 minimum deposit establishes your membership share." },
              { num: "3", title: "Start banking", desc: "Add checking, apply for loans, unlock digital tools." },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", padding: "22px 0", borderBottom: i < 2 ? "1px solid #EDE7D9" : "none" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#0E3B36", color: "#C8A24C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Newsreader', serif", fontSize: "18px", fontWeight: "600", flexShrink: "0" }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#1B1A16" }}>{step.title}</div>
                  <div style={{ fontSize: "14px", color: "#5C5A52", marginTop: "4px", lineHeight: "1.5" }}>{step.desc}</div>
                </div>
              </div>
            ))}
            <button onClick={() => navigate("/signup")} style={{ marginTop: "28px", fontSize: "15px", fontWeight: "600", color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "15px 30px", borderRadius: "9px", cursor: "pointer" }}>Open your account →</button>
          </div>

          <div style={{ background: "#0E3B36", borderRadius: "18px", padding: "32px" }}>
            <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: "26px", fontWeight: "500", color: "#F5F1E8", margin: "0 0 24px" }}>Member benefits</h3>
            {[
              { label: "Higher savings yields", sub: "4.75% APY" },
              { label: "Lower loan rates", sub: "Auto, home & personal" },
              { label: "Digital banking tools", sub: "Mobile & online access" },
              { label: "24/7 support", sub: "Real people, real help" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px 0", borderBottom: i < 3 ? "1px solid rgba(245,241,232,.12)" : "none" }}>
                <span style={{ color: "#C8A24C", fontSize: "16px", fontWeight: "700", flexShrink: "0", marginTop: "1px" }}>✓</span>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#F5F1E8" }}>{b.label}</div>
                  <div style={{ fontSize: "13px", color: "rgba(245,241,232,.6)", marginTop: "2px" }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Membership;
