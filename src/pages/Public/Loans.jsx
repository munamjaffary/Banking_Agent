import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Loans() {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("auto");
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanTerm, setLoanTerm] = useState(48);

  const rates = { auto: 0.0575, used: 0.0675, personal: 0.0999, home: 0.0625 };
  const monthlyRate = rates[loanType] / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / loanTerm
      : (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -loanTerm));
  const totalPaid = monthlyPayment * loanTerm;
  const totalInterest = totalPaid - loanAmount;

  const fmt = (v) => "$" + Math.round(v).toLocaleString();
  const fmt2 = (v) =>
    "$" +
    v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const segTypes = [
    { key: "auto", label: "New Auto" },
    { key: "used", label: "Used Auto" },
    { key: "personal", label: "Personal" },
    { key: "home", label: "Home" },
  ];

  const inputStyle = {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    cursor: "pointer",
    accentColor: "#0E3B36",
    appearance: "auto",
  };

  const trackBg = {
    background: "#E3DCCB",
    height: "6px",
    borderRadius: "3px",
    width: "100%",
  };

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 28px 40px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            fontWeight: "600",
            letterSpacing: ".13em",
            textTransform: "uppercase",
            color: "#9C6B3F",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              width: "18px",
              height: "1px",
              background: "#9C6B3F",
            }}
          ></span>
          Loans
        </div>
        <h1
          style={{
            fontFamily: "'Newsreader', serif",
            fontSize: "52px",
            fontWeight: "500",
            lineHeight: "1.03",
            letterSpacing: "-.015em",
            color: "#0E3B36",
            margin: "0",
            maxWidth: "600px",
          }}
        >
          Borrow with confidence
        </h1>
        <p
          style={{
            fontSize: "17px",
            lineHeight: "1.6",
            color: "#5C5A52",
            margin: "20px 0 0",
            maxWidth: "520px",
          }}
        >
          Member-first rates, fast local decisions, and no surprise fees —
          that's the NPFCU difference.
        </p>
      </section>

      {/* LOAN PRODUCT CARDS */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 28px 60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "22px",
          }}
        >
          {[
            {
              icon: "$",
              title: "Auto Loans",
              rate: "5.75% APR",
              desc: "New and used auto financing with competitive rates and flexible terms up to 84 months.",
              action: "Apply for Auto",
            },
            {
              icon: "\u2302",
              title: "Home & HELOC",
              rate: "6.25% APR",
              desc: "Purchase, refinance, or tap into equity with a Home Equity Line of Credit.",
              action: "Apply for Home",
            },
            {
              icon: "\u2713",
              title: "Personal Loans",
              rate: "9.99% APR",
              desc: "Debt consolidation, home improvements, or whatever matters most to you.",
              action: "Apply Personal",
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: "#FCFAF5",
                border: "1px solid #E3DCCB",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#0E3B36",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C8A24C",
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: "22px",
                  fontWeight: "500",
                  color: "#1B1A16",
                  margin: "0",
                }}
              >
                {card.title}
              </h3>
              <div
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: "34px",
                  fontWeight: "500",
                  color: "#0E3B36",
                  margin: "10px 0 8px",
                  lineHeight: "1",
                }}
              >
                {card.rate}
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#5C5A52",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {card.desc}
              </p>
              <div style={{ marginTop: "auto", paddingTop: "18px" }}>
                <button
                  onClick={() => navigate("/membership")}
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#F5F1E8",
                    background: "#0E3B36",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "9px",
                    cursor: "pointer",
                  }}
                >
                  {card.action} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT ESTIMATOR */}
      <section style={{ background: "#F5F1E8" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "60px 28px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: ".13em",
                textTransform: "uppercase",
                color: "#9C6B3F",
                marginBottom: "10px",
              }}
            >
              Payment estimator
            </div>
            <h2
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: "38px",
                fontWeight: "500",
                color: "#0E3B36",
                margin: "0",
              }}
            >
              See what you'd pay
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* LEFT — Controls */}
            <div>
              {/* Segmented buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0",
                  marginBottom: "28px",
                  background: "#E3DCCB",
                  borderRadius: "10px",
                  padding: "3px",
                }}
              >
                {segTypes.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setLoanType(t.key)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background:
                        loanType === t.key ? "#0E3B36" : "transparent",
                      color:
                        loanType === t.key ? "#F5F1E8" : "#3F3D38",
                      transition: "background .15s, color .15s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Loan amount slider */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1B1A16",
                    }}
                  >
                    Loan Amount
                  </span>
                  <span
                    style={{
                      fontFamily: "'Public Sans'",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0E3B36",
                    }}
                  >
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <div style={trackBg}>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#9A958A",
                    marginTop: "4px",
                  }}
                >
                  <span>$1,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Term slider */}
              <div style={{ marginBottom: "28px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1B1A16",
                    }}
                  >
                    Term
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0E3B36",
                    }}
                  >
                    {loanTerm} months
                  </span>
                </div>
                <div style={trackBg}>
                  <input
                    type="range"
                    min={12}
                    max={84}
                    step={6}
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#9A958A",
                    marginTop: "4px",
                  }}
                >
                  <span>12 mo</span>
                  <span>84 mo</span>
                </div>
              </div>

              {/* Result card (left) */}
              <div
                style={{
                  background: "#FCFAF5",
                  border: "1px solid #E3DCCB",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#9A958A",
                    marginBottom: "4px",
                  }}
                >
                  Estimated monthly payment
                </div>
                <div
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: "44px",
                    fontWeight: "500",
                    color: "#0E3B36",
                    lineHeight: "1",
                  }}
                >
                  {fmt(monthlyPayment)}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginTop: "18px",
                    paddingTop: "18px",
                    borderTop: "1px solid #EDE7D9",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A958A" }}>
                      APR
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1B1A16",
                      }}
                    >
                      {(rates[loanType] * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A958A" }}>
                      Total interest
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1B1A16",
                      }}
                    >
                      {fmt2(totalInterest)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A958A" }}>
                      Term
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1B1A16",
                      }}
                    >
                      {loanTerm} mo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Sticky summary card */}
            <div
              style={{
                position: "sticky",
                top: "90px",
                background: "#FCFAF5",
                border: "1px solid #E3DCCB",
                borderRadius: "18px",
                padding: "28px",
                boxShadow: "0 8px 30px rgba(14,59,54,.07)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#9A958A",
                  marginBottom: "4px",
                }}
              >
                Your estimated payment
              </div>
              <div
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: "52px",
                  fontWeight: "500",
                  color: "#0E3B36",
                  lineHeight: "1",
                  marginBottom: "20px",
                }}
              >
                {fmt(monthlyPayment)}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #EDE7D9",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#5C5A52" }}>
                    Loan amount
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1B1A16",
                    }}
                  >
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #EDE7D9",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#5C5A52" }}>
                    Total interest
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1B1A16",
                    }}
                  >
                    {fmt2(totalInterest)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #EDE7D9",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#5C5A52" }}>
                    Total paid
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1B1A16",
                    }}
                  >
                    {fmt2(totalPaid)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#5C5A52" }}>
                    APR
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1B1A16",
                    }}
                  >
                    {(rates[loanType] * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/membership")}
                style={{
                  width: "100%",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#F5F1E8",
                  background: "#0E3B36",
                  border: "none",
                  padding: "15px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                Apply for this loan
              </button>
              <button
                style={{
                  width: "100%",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0E3B36",
                  background: "transparent",
                  border: "1.5px solid #0E3B36",
                  padding: "12px",
                  borderRadius: "9px",
                  cursor: "pointer",
                }}
              >
                Ask Aria a question
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Loans;
