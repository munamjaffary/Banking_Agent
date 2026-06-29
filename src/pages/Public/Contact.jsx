import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#1B1A16",
    background: "#F5F1E8",
    border: "1px solid #E3DCCB",
    borderRadius: "9px",
    outline: "none",
    fontFamily: "'Public Sans'",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1B1A16",
    marginBottom: "6px",
    display: "block",
  };

  const infoCardStyle = {
    background: "#FCFAF5",
    border: "1px solid #E3DCCB",
    borderRadius: "14px",
    padding: "20px",
  };

  return (
    <div>
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 28px 50px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "16px" }}>
          <span style={{ width: "18px", height: "1px", background: "#9C6B3F" }}></span>
          Contact
        </div>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "52px", fontWeight: "500", lineHeight: "1.03", letterSpacing: "-.015em", color: "#0E3B36", margin: "0", maxWidth: "600px" }}>
          We're here to help
        </h1>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "start" }}>
          {/* LEFT — Contact Form */}
          <div style={{ background: "#FCFAF5", border: "1px solid #E3DCCB", borderRadius: "18px", padding: "32px", boxShadow: "0 8px 30px rgba(14,59,54,.07)" }}>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "26px", fontWeight: "500", color: "#0E3B36", margin: "0 0 6px" }}>Send us a message</h2>
            <p style={{ fontSize: "14px", color: "#5C5A52", margin: "0 0 24px", lineHeight: "1.5" }}>We'll get back to you within one business day.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input type="text" placeholder="Jane" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" placeholder="Doe" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="jane.doe@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Message</label>
              <textarea
                placeholder="How can we help you?"
                rows={5}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "'Public Sans'" }}
              />
            </div>
            <button
              onClick={() => navigate("/")}
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#F5F1E8",
                background: "#0E3B36",
                border: "none",
                padding: "14px 32px",
                borderRadius: "9px",
                cursor: "pointer",
              }}
            >
              Send message
            </button>
          </div>

          {/* RIGHT — Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={infoCardStyle}>
              <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "8px" }}>Call us</div>
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: "22px", fontWeight: "500", color: "#0E3B36" }}>1-800-NIZARI-1</div>
              <div style={{ fontSize: "13px", color: "#5C5A52", marginTop: "4px" }}>24/7 member support</div>
            </div>

            <div style={infoCardStyle}>
              <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "8px" }}>Main branch</div>
              <div style={{ fontSize: "15px", color: "#1B1A16", lineHeight: "1.5" }}>1200 Community Way</div>
              <div style={{ fontSize: "15px", color: "#1B1A16", lineHeight: "1.5" }}>Sugar Land, TX 77478</div>
            </div>

            <div style={infoCardStyle}>
              <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".13em", textTransform: "uppercase", color: "#9C6B3F", marginBottom: "8px" }}>Branch hours</div>
              <div style={{ fontSize: "14px", color: "#5C5A52", lineHeight: "1.7" }}>
                Mon–Fri 9:00 AM – 5:00 PM<br />
                Saturday 9:00 AM – 1:00 PM<br />
                Sunday Closed
              </div>
            </div>

            <div style={{ ...infoCardStyle, padding: "0", overflow: "hidden" }}>
              <div style={{ background: "#5C5A52", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#F5F1E8", fontSize: "13px", gap: "6px" }}>
                <span style={{ fontSize: "28px", opacity: "0.5" }}>⌖</span>
                <span style={{ opacity: "0.7" }}>Map placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
