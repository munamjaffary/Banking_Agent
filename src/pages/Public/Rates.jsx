import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = ["Savings", "Loans", "Certificates", "Mortgages"];

const tableData = {
  Savings: [
    { product: "Regular Savings", rate: "4.25%", min: "$25" },
    { product: "Money Market", rate: "4.75%", min: "$2,500" },
    { product: "Premium Checking", rate: "0.10%", min: "$0" },
    { product: "Youth Savings", rate: "5.00%", min: "$0" },
  ],
  Loans: [
    { product: "New Auto", rate: "5.75%", min: "$0 down" },
    { product: "Used Auto", rate: "6.75%", min: "$0 down" },
    { product: "Personal", rate: "9.99%", min: "Varies" },
    { product: "Home Equity", rate: "6.25%", min: "$10,000" },
  ],
  Certificates: [
    { product: "6-Mo Certificate", rate: "4.50%", min: "$500" },
    { product: "12-Mo Certificate", rate: "5.10%", min: "$500" },
    { product: "24-Mo Certificate", rate: "4.75%", min: "$500" },
    { product: "36-Mo Certificate", rate: "4.50%", min: "$500" },
  ],
  Mortgages: [
    { product: "30-Yr Fixed", rate: "6.50%", min: "3% down" },
    { product: "15-Yr Fixed", rate: "5.75%", min: "3% down" },
    { product: "5/1 ARM", rate: "6.00%", min: "5% down" },
    { product: "FHA", rate: "5.75%", min: "3.5% down" },
  ],
};

function Rates() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Savings");
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [startDeposit, setStartDeposit] = useState(1000);
  const [monthlyContrib, setMonthlyContrib] = useState(200);
  const [timeHorizon, setTimeHorizon] = useState(10);

  const calcMonthlyPayment = (amount, termMonths, annualRate = 0.0699) => {
    if (amount <= 0) return 0;
    const r = annualRate / 12;
    return (amount * r) / (1 - Math.pow(1 + r, -termMonths));
  };

  const calcFutureValue = (principal, monthly, years, annualRate = 0.0425) => {
    const r = annualRate / 12;
    const n = years * 12;
    if (r === 0) return principal + monthly * n;
    return principal * Math.pow(1 + r, n) + (monthly * (Math.pow(1 + r, n) - 1)) / r;
  };

  const monthlyPayment = calcMonthlyPayment(loanAmount, loanTerm);
  const futureValue = calcFutureValue(startDeposit, monthlyContrib, timeHorizon);
  const rows = tableData[activeTab];

  return (
    <div>
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 28px 40px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "12px" }}>
          Rates
        </div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "48px", fontWeight: "500", lineHeight: "1.06", letterSpacing: "-.015em", color: "#0E3B36", margin: "0" }}>
          Current rates
        </h1>
        <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#5C5A52", margin: "14px 0 0", maxWidth: "520px" }}>
          Competitive rates designed to help your money grow and make borrowing more affordable for our members.
        </p>

        <div style={{ display: "flex", gap: "4px", background: "#EDE7D9", borderRadius: "12px", padding: "4px", marginTop: "36px", width: "fit-content" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: activeTab === tab ? "#0E3B36" : "#5C5A52",
                background: activeTab === tab ? "#FCFAF5" : "transparent",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "32px", background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px", borderBottom: "1px solid #E3DCCB", padding: "14px 24px", fontSize: "12px", fontWeight: "700", letterSpacing: ".04em", textTransform: "uppercase", color: "#9A958A" }}>
            <div>Product</div>
            <div style={{ textAlign: "center" }}>APY/APR</div>
            <div style={{ textAlign: "center" }}>Minimum</div>
            <div style={{ textAlign: "center" }} />
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 120px 120px",
                alignItems: "center",
                padding: "18px 24px",
                borderBottom: i < rows.length - 1 ? "1px solid #EDE7D9" : "none",
              }}
            >
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#1B1A16" }}>{row.product}</div>
              <div style={{ fontFamily: "'Public Sans'", fontSize: "20px", fontWeight: "700", color: "#0E3B36", textAlign: "center" }}>{row.rate}</div>
              <div style={{ fontSize: "13px", color: "#5C5A52", textAlign: "center" }}>{row.min}</div>
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => navigate(activeTab === "Savings" || activeTab === "Certificates" ? "/membership" : "/loans")}
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0E3B36",
                    background: "#F1E7D6",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "6px" }}>
              Calculator
            </div>
            <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: "24px", fontWeight: "500", color: "#0E3B36", margin: "0 0 20px" }}>
              Loan estimator
            </h3>

            <div style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#1B1A16", marginBottom: "8px" }}>
                <span>Loan amount</span>
                <span style={{ fontWeight: "600" }}>${loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0E3B36" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9A958A" }}>
                <span>$1,000</span>
                <span>$100,000</span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#1B1A16", marginBottom: "8px" }}>
                <span>Loan term</span>
                <span style={{ fontWeight: "600" }}>{loanTerm} months</span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="12"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0E3B36" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9A958A" }}>
                <span>12 mo</span>
                <span>84 mo</span>
              </div>
            </div>

            <div style={{ background: "#0E3B36", borderRadius: "12px", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(245,241,232,.65)" }}>Monthly payment</div>
                <div style={{ fontSize: "14px", color: "rgba(245,241,232,.5)", marginTop: "2px" }}>Est. at 6.99% APR</div>
              </div>
              <div style={{ fontFamily: "'Public Sans'", fontSize: "28px", fontWeight: "700", color: "#C8A24C" }}>
                ${monthlyPayment.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "6px" }}>
              Calculator
            </div>
            <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: "24px", fontWeight: "500", color: "#0E3B36", margin: "0 0 20px" }}>
              Savings growth
            </h3>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#1B1A16", marginBottom: "8px" }}>
                <span>Starting deposit</span>
                <span style={{ fontWeight: "600" }}>${startDeposit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={startDeposit}
                onChange={(e) => setStartDeposit(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0E3B36" }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#1B1A16", marginBottom: "8px" }}>
                <span>Monthly contribution</span>
                <span style={{ fontWeight: "600" }}>${monthlyContrib.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={monthlyContrib}
                onChange={(e) => setMonthlyContrib(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0E3B36" }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#1B1A16", marginBottom: "8px" }}>
                <span>Time horizon</span>
                <span style={{ fontWeight: "600" }}>{timeHorizon} years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0E3B36" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9A958A" }}>
                <span>1 yr</span>
                <span>30 yrs</span>
              </div>
            </div>

            <div style={{ background: "#F1E7D6", borderRadius: "12px", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#6B6862" }}>Future value</div>
                <div style={{ fontSize: "14px", color: "#6B6862", marginTop: "2px" }}>Est. at 4.25% APY</div>
              </div>
              <div style={{ fontFamily: "'Public Sans'", fontSize: "28px", fontWeight: "700", color: "#0E3B36" }}>
                ${Math.round(futureValue).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Rates;
