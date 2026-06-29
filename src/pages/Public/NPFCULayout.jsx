import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../redux/authSlice";

function NPFCULayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!(user && token);
  const [smartOpen, setSmartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app" style={{ fontFamily: "'Public Sans', system-ui, sans-serif", color: "#1B1A16", background: "#F5F1E8", minHeight: "100vh" }}>
      <a href="#main" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>Skip to content</a>

      <div style={{ background: "#0A2C28", padding: "8px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <span style={{ fontFamily: "'Public Sans'", fontSize: "11px", fontWeight: "600", letterSpacing: ".03em", color: "#C8A24C" }}>★ Federally insured by NCUA</span>
            <span style={{ fontFamily: "'Public Sans'", fontSize: "11px", color: "rgba(245,241,232,.6)" }}>Equal Housing Lender</span>
            <span style={{ fontFamily: "'Public Sans'", fontSize: "11px", color: "rgba(245,241,232,.6)" }}>Routing #313187543</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ fontFamily: "'Public Sans'", fontSize: "11px", color: "rgba(245,241,232,.6)" }}>Español</span>
            <span style={{ fontFamily: "'Public Sans'", fontSize: "11px", color: "rgba(245,241,232,.6)" }}>Routing / ABA</span>
          </div>
        </div>
      </div>

      <header style={{ position: "sticky", top: "0", zIndex: "40", background: "rgba(245,241,232,.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E3DCCB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "11px", background: "none", border: "none", cursor: "pointer", padding: "0" }}>
            <div style={{ width: "36px", height: "36px", background: "#0E3B36", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "15px", height: "15px", background: "#C8A24C", transform: "rotate(45deg)", borderRadius: "2px" }}></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1" }}>
              <span style={{ fontFamily: "'Public Sans'", fontWeight: "700", fontSize: "16px", letterSpacing: ".01em", color: "#0E3B36" }}>Nizari Progressive</span>
              <span style={{ fontFamily: "'Public Sans'", fontWeight: "600", fontSize: "9.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#9C6B3F", marginTop: "3px" }}>Federal Credit Union</span>
            </div>
          </button>
          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[
              { label: "Membership", path: "/membership" },
              { label: "Loans", path: "/loans" },
              { label: "Rates", path: "/rates" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: "13.5px",
                  fontWeight: "500",
                  color: isActive(item.path) ? "#0E3B36" : "#3F3D38",
                  padding: "8px 13px",
                  borderBottom: isActive(item.path) ? "2px solid #C8A24C" : "2px solid transparent",
                  background: "none",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
            {isAuthenticated && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setSmartOpen(!smartOpen)}
                  onMouseEnter={() => setSmartOpen(true)}
                  style={{
                    fontSize: "13.5px",
                    fontWeight: "500",
                    color: location.pathname.startsWith("/portal") ? "#0E3B36" : "#3F3D38",
                    padding: "8px 13px",
                    borderBottom: location.pathname.startsWith("/portal") ? "2px solid #C8A24C" : "2px solid transparent",
                    background: "none",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Smart Engine
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>▼</span>
                </button>
                {smartOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 49 }}
                      onClick={() => setSmartOpen(false)}
                    />
                    <div
                      onMouseLeave={() => setSmartOpen(false)}
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        zIndex: 50,
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        minWidth: "220px",
                        padding: "8px",
                        marginTop: "8px",
                      }}
                    >
                      {[
                        { label: "Search", path: "/portal/search" },
                        { label: "Knowledge Base", path: "/portal/knowledgebase" },
                        { label: "Documents", path: "/portal/documents" },
                        { label: "Smart Engine", path: "/portal/nlu" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { setSmartOpen(false); navigate(item.path); }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            background: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "13.5px",
                            fontWeight: "500",
                            color: "#1B1A16",
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#F5F1E8"}
                          onMouseLeave={(e) => e.target.style.background = "none"}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {isAuthenticated && (
              <div style={{ position: "relative", marginLeft: "8px" }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#0E3B36",
                    color: "#F5F1E8",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user?.username
                    ? user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "U"}
                </button>
                {profileOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 49 }}
                      onClick={() => setProfileOpen(false)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        zIndex: 50,
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        minWidth: "220px",
                        padding: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <div style={{ padding: "12px 14px", borderBottom: "1px solid #E3DCCB", marginBottom: "8px" }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1B1A16" }}>
                          {user?.username || "User"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "2px" }}>
                          {user?.email || ""}
                        </div>
                      </div>
                      <button
                        onClick={() => { setProfileOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 14px",
                          border: "none",
                          background: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13.5px",
                          fontWeight: "500",
                          color: "#1B1A16",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#F5F1E8"}
                        onMouseLeave={(e) => e.target.style.background = "none"}
                      >
                        Settings
                      </button>
                      <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #E3DCCB" }} />
                      <button
                        onClick={() => { setProfileOpen(false); dispatch(setLogout()); navigate("/login"); }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 14px",
                          border: "none",
                          background: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13.5px",
                          fontWeight: "500",
                          color: "#C0392B",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#FDF2F2"}
                        onMouseLeave={(e) => e.target.style.background = "none"}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {isAuthenticated ? null : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    marginLeft: "10px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0E3B36",
                    background: "transparent",
                    border: "1.5px solid #0E3B36",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/membership")}
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#F5F1E8",
                    background: "#0E3B36",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Join Now
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main" className="zoomable">
        {children}
      </main>

      <footer style={{ background: "#0A2C28", color: "#F5F1E8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "54px 28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "32px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "16px" }}>
                <div style={{ width: "34px", height: "34px", background: "#C8A24C", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "14px", height: "14px", background: "#0A2C28", transform: "rotate(45deg)", borderRadius: "2px" }}></div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                  <span style={{ fontWeight: "700", fontSize: "15px" }}>Nizari Progressive</span>
                  <span style={{ fontWeight: "600", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "#C8A24C", marginTop: "3px" }}>Federal Credit Union</span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(245,241,232,.6)", lineHeight: "1.6", margin: "0", maxWidth: "280px" }}>Member-owned, federally insured, and built for the community since 1984.</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                {["f", "in", "✕"].map((s, i) => (
                  <div key={i} style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", cursor: "pointer" }}>{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Products", links: [{ label: "Savings & Checking", path: "/rates" }, { label: "Auto Loans", path: "/loans" }, { label: "Mortgages", path: "/loans" }, { label: "Certificates", path: "/rates" }] },
              { title: "Credit Union", links: [{ label: "About Us", path: "/about" }, { label: "Membership", path: "/membership" }, { label: "Locations", path: "/contact" }, { label: "Contact", path: "/contact" }] },
              { title: "Resources", links: [{ label: "Help Center" }, { label: "Disclosures" }, { label: "Privacy Policy" }, { label: "Accessibility" }] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", color: "#C8A24C", marginBottom: "14px" }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "rgba(245,241,232,.72)" }}>
                  {col.links.map((link, i) => (
                    <button key={i} onClick={() => link.path && navigate(link.path)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13.5px", color: "rgba(245,241,232,.72)", textAlign: "left", padding: "0" }}>
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "40px", paddingTop: "22px", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: "11.5px", color: "rgba(245,241,232,.5)" }}>
              <span style={{ color: "#C8A24C", fontWeight: "600" }}>★ NCUA</span>
              <span>Federally insured to $250,000</span>
              <span>Equal Housing Lender</span>
              <span>NMLS #401627</span>
            </div>
            <div style={{ fontSize: "11.5px", color: "rgba(245,241,232,.5)" }}>© 2026 Nizari Progressive FCU</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NPFCULayout;
