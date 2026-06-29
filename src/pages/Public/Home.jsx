import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 28px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.12fr .88fr", gap: "48px", alignItems: "start" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "20px" }}>
              <span style={{ width: "18px", height: "1px", background: "#9C6B3F" }}></span>Member-owned since 1984
            </div>
            <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "60px", fontWeight: "500", lineHeight: "1.03", letterSpacing: "-.015em", color: "#0E3B36", margin: "0" }}>Banking that belongs to your community.</h1>
            <p style={{ fontSize: "17px", lineHeight: "1.6", color: "#5C5A52", margin: "22px 0 0", maxWidth: "460px" }}>Not-for-profit and member-owned. Profits come back to you as better rates, lower fees, and real human service — never to outside shareholders.</p>
            <div style={{ display: "flex", gap: "13px", marginTop: "30px" }}>
              <button onClick={() => navigate("/membership")} style={{ fontSize: "15px", fontWeight: "600", color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "15px 28px", borderRadius: "9px", cursor: "pointer" }}>Become a member</button>
              <button onClick={() => navigate("/rates")} style={{ fontSize: "15px", fontWeight: "600", color: "#0E3B36", background: "transparent", border: "1.5px solid #0E3B36", padding: "15px 26px", borderRadius: "9px", cursor: "pointer" }}>View all rates →</button>
            </div>
            <div style={{ display: "flex", gap: "40px", marginTop: "44px", paddingTop: "28px", borderTop: "1px solid #E3DCCB" }}>
              {[
                { value: "38,000+", label: "Members" },
                { value: "$640M", label: "In assets" },
                { value: "4.9★", label: "Member rating" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Newsreader', serif", fontSize: "32px", fontWeight: "500", color: "#0E3B36" }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "#9A958A", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "18px", padding: "26px", boxShadow: "0 8px 30px rgba(14,59,54,.07)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1B1A16" }}>Today's Rates</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#6E9C92", fontWeight: "600" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6E9C92", display: "inline-block" }}></span>Live · Apr 15
              </span>
            </div>
            {[
              { name: "Regular Savings", note: "$25 minimum", rate: "4.25%" },
              { name: "Money Market", note: "$2,500 minimum", rate: "4.75%" },
              { name: "12-Mo Certificate", note: "$500 minimum", rate: "5.10%" },
              { name: "New Auto Loan", note: "Up to 84 months", rate: "5.75%" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < 3 ? "1px solid #EDE7D9" : "none" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#1B1A16", fontWeight: "500" }}>{r.name}</div>
                  <div style={{ fontSize: "11px", color: "#9A958A" }}>{r.note}</div>
                </div>
                <div style={{ fontFamily: "'Public Sans'", fontSize: "22px", fontWeight: "700", color: "#0E3B36" }}>{r.rate}</div>
              </div>
            ))}
            <button onClick={() => navigate("/rates")} style={{ width: "100%", marginTop: "16px", fontSize: "13px", fontWeight: "600", color: "#0E3B36", background: "#F1E7D6", border: "none", padding: "12px", borderRadius: "9px", cursor: "pointer" }}>Compare all rates →</button>
          </div>
        </div>
      </section>

      <section style={{ background: "#0E3B36" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "26px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "18px" }}>
          {[
            { icon: "★", label: "NCUA insured to $250,000" },
            { icon: "⛨", label: "256-bit encryption" },
            { icon: "⌂", label: "7 local branches" },
            { icon: "☎", label: "24/7 member support" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F5F1E8" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: "500" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 28px 10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {[
            { icon: "$", label: "Apply for a loan", sub: "Auto, home & personal", onClick: () => navigate("/loans"), bg: "#0E3B36", color: "#C8A24C" },
            { icon: "%", label: "Check rates", sub: "Updated today", onClick: () => navigate("/rates"), bg: "#C8A24C", color: "#0E3B36" },
            { icon: "＋", label: "Open an account", sub: "In about 5 minutes", onClick: () => navigate("/membership"), bg: "#6E9C92", color: "#fff" },
            { icon: "⌖", label: "Find a branch", sub: "7 locations near you", onClick: () => navigate("/contact"), bg: "#9C6B3F", color: "#fff" },
          ].map((card, i) => (
            <button key={i} onClick={card.onClick} style={{ textAlign: "left", background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "14px", padding: "22px", cursor: "pointer" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, fontSize: "18px", marginBottom: "14px" }}>{card.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#1B1A16" }}>{card.label}</div>
              <div style={{ fontSize: "12px", color: "#9A958A", marginTop: "3px" }}>{card.sub}</div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ textAlign: "center", maxWidth: "620px", margin: "0 auto 44px" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "12px" }}>The credit union difference</div>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "40px", fontWeight: "500", color: "#0E3B36", lineHeight: "1.1", margin: "0" }}>Owned by members, run for members</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
          {[
            { num: "01", title: "Better rates, lower fees", desc: "Earnings return to members. That means higher savings yields and loan rates that beat the big banks." },
            { num: "02", title: "People over profit", desc: "Decisions are made locally by people who live here — not a distant corporate boardroom." },
            { num: "03", title: "Here for the community", desc: "Built to serve the Nizari community and our neighbors, reinvesting where it matters most." },
          ].map((c, i) => (
            <div key={i} style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "16px", padding: "28px" }}>
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: "30px", color: "#C8A24C" }}>{c.num}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1B1A16", margin: "14px 0 8px" }}>{c.title}</h3>
              <p style={{ fontSize: "14px", color: "#5C5A52", lineHeight: "1.6", margin: "0" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#FBF4E6" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "70px 28px", display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: "54px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "14px" }}>Smart digital banking</div>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "38px", fontWeight: "500", color: "#0E3B36", lineHeight: "1.1", margin: "0" }}>Insights that look ahead, not just back.</h2>
            <p style={{ fontSize: "15px", color: "#5C5A52", lineHeight: "1.65", margin: "18px 0 0" }}>When you log in, NPFCU surfaces what matters before you ask — forecasting your spending, flagging unusual activity, and nudging you toward your goals.</p>
            {[
              { icon: "↗", title: "Spending forecasts", sub: "See where you'll land before month-end." },
              { icon: "◎", title: "Goal tracking", sub: "Automatic progress toward what you're saving for." },
              { icon: "⚑", title: "Proactive alerts", sub: "Unusual activity flagged the moment it happens." },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginTop: i === 0 ? "26px" : "14px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#0E3B36", color: "#C8A24C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: "0" }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1B1A16" }}>{f.title}</div>
                  <div style={{ fontSize: "13px", color: "#6B6862" }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "20px", padding: "24px", boxShadow: "0 14px 44px rgba(14,59,54,.10)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#9A958A" }}>Good morning, Amir</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#1B1A16" }}>Your money this month</div>
              </div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#6E9C92", background: "#E5EEEB", padding: "5px 10px", borderRadius: "20px" }}>On track</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ background: "#0E3B36", borderRadius: "14px", padding: "18px" }}>
                <div style={{ fontSize: "11px", color: "rgba(245,241,232,.65)" }}>Total balance</div>
                <div style={{ fontFamily: "'Public Sans'", fontSize: "26px", fontWeight: "700", color: "#F5F1E8", marginTop: "4px" }}>$24,830</div>
                <div style={{ fontSize: "11px", color: "#C8A24C", marginTop: "4px" }}>▲ $640 this month</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ background: "#F5F1E8", borderRadius: "12px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "11px", color: "#9A958A" }}>Forecast spend</div>
                  <div style={{ fontSize: "17px", fontWeight: "700", color: "#1B1A16" }}>$2,140</div>
                </div>
                <div style={{ background: "#F5F1E8", borderRadius: "12px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "11px", color: "#9A958A" }}>Safe to save</div>
                  <div style={{ fontSize: "17px", fontWeight: "700", color: "#0E3B36" }}>$510</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "18px", alignItems: "center", marginTop: "16px", background: "#F5F1E8", borderRadius: "14px", padding: "18px" }}>
              <div style={{ width: "84px", height: "84px", borderRadius: "50%", background: "conic-gradient(#0E3B36 0 42%, #6E9C92 42% 68%, #C8A24C 68% 86%, #9C6B3F 86% 100%)", flexShrink: "0", position: "relative" }}>
                <div style={{ position: "absolute", inset: "14px", background: "#F5F1E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <span style={{ fontSize: "9px", color: "#9A958A" }}>spent</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#1B1A16" }}>68%</span>
                </div>
              </div>
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "7px" }}>
                {[
                  { color: "#0E3B36", label: "Housing", value: "$890" },
                  { color: "#6E9C92", label: "Groceries", value: "$540" },
                  { color: "#C8A24C", label: "Transport", value: "$380" },
                ].map((cat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "7px", color: "#3F3D38" }}>
                      <span style={{ width: "9px", height: "9px", borderRadius: "2px", background: cat.color }}></span>{cat.label}
                    </span>
                    <span style={{ fontWeight: "600" }}>{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "14px", background: "#FFF7E8", border: "1px solid #F0E0BC", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "16px" }}>💡</span>
              <span style={{ fontSize: "12.5px", color: "#5b4e2a", lineHeight: "1.45" }}>You'll likely have <b>$510 left over</b> — want to move it to your Vacation goal?</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 28px" }}>
        <div style={{ background: "#0E3B36", borderRadius: "24px", padding: "56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "200px", height: "200px", background: "rgba(200,162,76,.12)", borderRadius: "50%" }}></div>
          <div style={{ position: "absolute", left: "-30px", bottom: "-60px", width: "160px", height: "160px", background: "rgba(110,156,146,.14)", borderRadius: "50%" }}></div>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "42px", fontWeight: "500", color: "#F5F1E8", margin: "0", position: "relative" }}>Ready to bank with people who know you?</h2>
          <p style={{ fontSize: "16px", color: "rgba(245,241,232,.75)", margin: "16px auto 0", maxWidth: "460px", position: "relative" }}>Join in minutes. Membership is open to the Nizari community and their families.</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "30px", position: "relative" }}>
            <button onClick={() => navigate("/membership")} style={{ fontSize: "15px", fontWeight: "600", color: "#0E3B36", background: "#C8A24C", border: "none", padding: "15px 30px", borderRadius: "9px", cursor: "pointer" }}>Open your account</button>
            <button style={{ fontSize: "15px", fontWeight: "600", color: "#F5F1E8", background: "transparent", border: "1.5px solid rgba(245,241,232,.5)", padding: "15px 26px", borderRadius: "9px", cursor: "pointer" }}>Ask Aria a question</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
