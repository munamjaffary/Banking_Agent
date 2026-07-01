import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../redux/authSlice";
import { resetConversations } from "../../api/conversationSlice";
import { toggleTheme } from "../../api/toggleThemeSlice";
import NazariLogo from "../../assets/icons/nazari-logo.png";

function NPFCULayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.theme);
  const isAuthenticated = !!(user && token);
  const [smartOpen, setSmartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="public-app">
      <a href="#main" className="skip-link">Skip to content</a>

      <div className="public-topbar">
        <div className="public-topbar-inner">
          <div className="public-topbar-left">
            <span className="public-topbar-accent">★ Federally insured by NCUA</span>
            <span className="public-topbar-muted">Equal Housing Lender</span>
            <span className="public-topbar-muted">Routing #313187543</span>
          </div>
          <div className="public-topbar-right">
            <span>Español</span>
            <span>Routing / ABA</span>
          </div>
        </div>
      </div>

      <header className="public-header">
        <div className="public-header-inner">
          <button onClick={() => navigate("/")} className="public-logo-btn">
            <img src={NazariLogo} alt="Nazari" style={{ height: "36px", width: "auto" }} />
          </button>
          <nav className="public-nav">
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
                className={`public-nav-link${isActive(item.path) ? " active" : ""}`}
              >
                {item.label}
              </button>
            ))}
            <button
              className="public-theme-btn"
              onClick={() => dispatch(toggleTheme())}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "☾" : "☀"}
            </button>
            {isAuthenticated && (
              <div className="public-nav-relative">
                <button
                  onClick={() => setSmartOpen(!smartOpen)}
                  onMouseEnter={() => setSmartOpen(true)}
                  className={`public-nav-link smart${location.pathname.startsWith("/portal") ? " active" : ""}`}
                >
                  Smart Engine
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>▼</span>
                </button>
                {smartOpen && (
                  <>
                    <div className="public-overlay" onClick={() => setSmartOpen(false)} />
                    <div className="public-dropdown" onMouseLeave={() => setSmartOpen(false)}>
                      {[
                        { label: "Search", path: "/portal/search" },
                        { label: "Knowledge Base", path: "/portal/knowledgebase" },
                        { label: "Smart Engine", path: "/portal/nlu" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className="public-dropdown-item"
                          onClick={() => { setSmartOpen(false); navigate(item.path); }}
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
              <div className="public-nav-relative" style={{ marginLeft: "8px" }}>
                <button onClick={() => setProfileOpen(!profileOpen)} className="public-avatar-btn">
                  {user?.username
                    ? user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "U"}
                </button>
                {profileOpen && (
                  <>
                    <div className="public-overlay" onClick={() => setProfileOpen(false)} />
                    <div className="public-dropdown">
                      <div className="public-dropdown-header">
                        <div className="public-dropdown-user">{user?.username || "User"}</div>
                        <div className="public-dropdown-role">{user?.role || user?.user_type || ""}</div>
                        <div className="public-dropdown-email">{user?.email || ""}</div>
                      </div>
                      <button className="public-dropdown-item" onClick={() => { setProfileOpen(false); }}>Settings</button>
                      <hr className="public-dropdown-divider" />
                      <button
                        className="public-dropdown-item"
                        style={{ color: "#C0392B" }}
                        onClick={() => { setProfileOpen(false); dispatch(resetConversations()); dispatch(setLogout()); navigate("/"); }}
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
                <button onClick={() => navigate("/login")} className="public-btn-signin">Sign In</button>
                <button onClick={() => navigate("/membership")} className="public-btn-join">Join Now</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main" className="zoomable" style={{ flex: 1 }}>
        {children}
      </main>

      <footer className="public-footer">
        <div className="public-footer-inner">
          <div className="public-footer-grid">
            <div>
              <div className="public-footer-brand">
                <img src={NazariLogo} alt="Nazari" className="public-footer-logo" />
              </div>
              <p className="public-footer-desc">Member-owned, federally insured, and built for the community since 1984.</p>
              <div className="public-footer-social">
                {["f", "in", "✕"].map((s, i) => (
                  <div key={i} className="public-footer-social-icon">{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Products", links: [{ label: "Savings & Checking", path: "/rates" }, { label: "Auto Loans", path: "/loans" }, { label: "Mortgages", path: "/loans" }, { label: "Certificates", path: "/rates" }] },
              { title: "Credit Union", links: [{ label: "About Us", path: "/about" }, { label: "Membership", path: "/membership" }, { label: "Locations", path: "/contact" }, { label: "Contact", path: "/contact" }] },
              { title: "Resources", links: [{ label: "Help Center" }, { label: "Disclosures" }, { label: "Privacy Policy" }, { label: "Accessibility" }] },
            ].map((col) => (
              <div key={col.title}>
                <div className="public-footer-col-title">{col.title}</div>
                <div className="public-footer-links">
                  {col.links.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => link.path && navigate(link.path)}
                      className="public-footer-link"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="public-footer-bottom">
            <div className="public-footer-bottom-left">
              <span className="public-footer-ncua">★ NCUA</span>
              <span>Federally insured to $250,000</span>
              <span>Equal Housing Lender</span>
              <span>NMLS #401627</span>
            </div>
            <div className="public-footer-copy">© 2026 Nizari Progressive FCU</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NPFCULayout;
