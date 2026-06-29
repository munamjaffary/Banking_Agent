import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div>
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 28px 60px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "16px" }}>
          <span style={{ width: "18px", height: "1px", background: "#9C6B3F" }}></span>About us
        </div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "56px", fontWeight: "500", lineHeight: "1.05", letterSpacing: "-.015em", color: "#0E3B36", margin: "0", maxWidth: "680px" }}>A community institution, built on shared prosperity.</h1>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "52px", alignItems: "center" }}>
          <div style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "18px", height: "420px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{
              width: "100%", height: "100%",
              background: "repeating-linear-gradient(45deg, #EDE7D9 0px, #EDE7D9 2px, #F5F1E8 2px, #F5F1E8 12px)",
              borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", color: "#C8A24C", marginBottom: "12px" }}>◈</div>
                <div style={{ fontSize: "13px", color: "#9A958A", letterSpacing: ".08em", textTransform: "uppercase" }}>NPFCU headquarters</div>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#5C5A52", margin: "0" }}>
              Founded in 1984, Nizari Progressive Federal Credit Union has served the Nizari community and its neighbors for four decades. What began as a small cooperative has grown into a trusted financial institution with deep roots across the region.
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#5C5A52", margin: "18px 0 0" }}>
              We are member-owned, not-for-profit, and federally insured — meaning every dollar you deposit works for you and your community, not outside shareholders.
            </p>
            <div style={{ display: "flex", gap: "36px", marginTop: "36px", paddingTop: "30px", borderTop: "1px solid #E3DCCB" }}>
              {[
                { value: "40+", label: "Years serving", sub: "the community" },
                { value: "$640M", label: "Returned to", sub: "members since 1984" },
                { value: "7", label: "Local", sub: "branches" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Newsreader', serif", fontSize: "34px", fontWeight: "500", color: "#0E3B36", lineHeight: "1" }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "#9A958A", marginTop: "6px" }}>{s.label}<br />{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#FCFAF5", borderTop: "1px solid #E3DCCB", borderBottom: "1px solid #E3DCCB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px" }}>
            {[
              {
                title: "Our Mission",
                desc: "To strengthen the financial wellbeing of every member and the community we serve.",
                icon: "◇",
                color: "#0E3B36",
              },
              {
                title: "Our Values",
                desc: "Integrity, inclusion, and stewardship — guiding every decision we make.",
                icon: "◆",
                color: "#C8A24C",
              },
              {
                title: "Governance",
                desc: "A volunteer board of members, federally chartered and NCUA-regulated.",
                icon: "◈",
                color: "#0E3B36",
              },
            ].map((card, i) => (
              <div key={i} style={{ background: "#F5F1E8", border: "1px solid #E3DCCB", borderRadius: "16px", padding: "32px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: card.color, display: "flex", alignItems: "center", justifyContent: "center", color: card.color === "#C8A24C" ? "#0E3B36" : "#C8A24C", fontSize: "22px", marginBottom: "18px" }}>
                  {card.icon}
                </div>
                <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: "22px", fontWeight: "500", color: "#1B1A16", margin: "0 0 10px" }}>{card.title}</h3>
                <p style={{ fontSize: "14.5px", color: "#5C5A52", lineHeight: "1.6", margin: "0" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
