import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import NazariLogo from "../../assets/icons/nazari-logo.png";
import SearchIcon from "../../assets/icons/search.svg";
import ChatArea from "../Chat/ChatArea";
import NLU from "../NLU/NLU";
import KnowledgeBase from "../KnowledgeBase/KnowledgeBase";
import Search from "../../components/Search";
import RateChanges from "./RateChanges";
import AuditLog from "./AuditLog";
import ApprovalRules from "./ApprovalRules";
import DocumentsSection from "./DocumentsSection";
import ApprovalsQueue from "./ApprovalsQueue";
import { createNewChat, selectChat, renameChat, deleteChat, resetConversations, seedNluChats } from "../../api/conversationSlice";
import { setLogout } from "../../redux/authSlice";

const sections = [
  { key: "dashboard", label: "Dashboard", icon: "▦" },
  { key: "rates", label: "Rate Changes", icon: "%" },
  { key: "approvals", label: "Approvals", icon: "✓" },
  { key: "documents", label: "Documents", icon: "▤" },
  { key: "audit", label: "Audit Log", icon: "⊟" },
  { key: "config", label: "Approval Rules", icon: "⚙" },
];

const smartSubItems = [
  { key: "knowledgebase", label: "Knowledge Base", icon: "▤" },
  { key: "nlu", label: "Smart Engine (NLU)", icon: "⚡" },
  { key: "chat", label: "Chat", icon: "◈" },
  { key: "newchat", label: "New Conversation", icon: "⊕" },
  { key: "searchhistory", label: "Search History", icon: "⌕" },
];

const pendingItems = [
  { title: "High-Yield Savings rate change", date: "Jun 28, 2026", by: "Aisha Khan", type: "Rate", tagColor: "#9C6B3F", tagBg: "#F6ECDA" },
  { title: "Auto loan APR adjustment", date: "Jun 27, 2026", by: "Raj Patel", type: "Rate", tagColor: "#9C6B3F", tagBg: "#F6ECDA" },
  { title: "New CD product terms v2", date: "Jun 26, 2026", by: "Maria Lopez", type: "Product", tagColor: "#008fd5", tagBg: "#E0F0FA" },
  { title: "Mortgage rate sheet Q3", date: "Jun 25, 2026", by: "James Chen", type: "Rate", tagColor: "#9C6B3F", tagBg: "#F6ECDA" },
  { title: "Premium Savings tier update", date: "Jun 24, 2026", by: "Sarah Okafor", type: "Product", tagColor: "#008fd5", tagBg: "#E0F0FA" },
];

const activityItems = [
  { dot: "#C8A24C", text: "Aisha Khan submitted a rate change for High-Yield Savings", when: "2h ago" },
  { dot: "#6E9C92", text: "Raj Patel's auto loan change was approved by Compliance", when: "4h ago" },
  { dot: "#9C6B3F", text: "Maria Lopez requested changes to CD product terms", when: "6h ago" },
  { dot: "#008fd5", text: "New approval rule created by System Admin", when: "12h ago" },
];

const sidebarStyles = {
  aside: { width: "248px", flexShrink: 0, background: "#0A2C28", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" },
  logo: { padding: "22px 20px", borderBottom: "1px solid rgba(255,255,255,.08)", background: "#1A3D38" },
  nav: { flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: "3px", overflowY: "auto" },
  sectionLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(245,241,232,.35)", padding: "10px 12px 6px" },
  btnBase: (active) => ({
    display: "flex", alignItems: "center", gap: "11px",
    background: active ? "rgba(200,162,76,.16)" : "transparent",
    border: "none", color: active ? "#F5F1E8" : "rgba(245,241,232,.78)",
    fontSize: "13.5px", fontWeight: 500, padding: "10px 12px", borderRadius: "8px",
    cursor: "pointer", textAlign: "left", width: "100%",
  }),
  badge: { marginLeft: "auto", fontSize: "10px", fontWeight: 700, color: "#0A2C28", background: "#C8A24C", padding: "1px 7px", borderRadius: "20px" },
  subItem: (active) => ({
    display: "flex", alignItems: "center", gap: "11px",
    background: active ? "rgba(200,162,76,.12)" : "transparent",
    border: "none", color: active ? "#F5F1E8" : "rgba(245,241,232,.65)",
    fontSize: "13px", fontWeight: active ? 500 : 400,
    padding: "7px 12px 7px 30px", borderRadius: "6px",
    cursor: "pointer", textAlign: "left", width: "100%",
    transition: "background 0.15s",
  }),
  userFooter: { padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: "11px" },
};

const arrowStyles = {
  transition: "transform 0.2s ease",
  marginLeft: "auto",
  fontSize: "10px",
  opacity: 0.5,
};

function AdminPortal() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [section, setSectionState] = useState("dashboard");
  const [smartExpanded, setSmartExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setSection = useCallback((key) => {
    if (key === "newchat") {
      setSectionState("chat");
      dispatch(createNewChat());
      navigate("/portal/admin?section=chat", { replace: true });
      return;
    }
    if (key === "searchhistory") {
      setSectionState("searchhistory");
      navigate("/portal/admin?section=searchhistory", { replace: true });
      return;
    }
    setSectionState(key);
    if (["knowledgebase", "nlu", "chat"].includes(key)) {
      navigate("/portal/admin?section=" + key, { replace: true });
      setSmartExpanded(true);
    } else {
      navigate("/portal/admin", { replace: true });
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("section");
    if (target && ["knowledgebase", "nlu", "chat", "searchhistory"].includes(target)) {
      setSectionState(target);
      setSmartExpanded(true);
    }
  }, [location.search]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getPageTitle = () => {
    const map = {
      dashboard: ["Dashboard", "Overview of pending changes and recent activity"],
      rates: ["Rate Changes", "Submit and track rate change requests"],
      approvals: ["Approvals", "Review and approve pending change requests"],
      documents: ["Documents", "Manage rate sheets and product documentation"],
      audit: ["Audit Log", "Full history of changes and approvals"],
      config: ["Approval Rules", "Configure approval workflows and routing rules"],
      knowledgebase: ["Knowledge Base", "Search and manage knowledge base content"],
      nlu: ["Smart Engine (NLU)", "Analyze user intents and conversation data"],
      chat: ["Chat", "View chat history and analytics"],
      newchat: ["Chat", "View chat history and analytics"],
      searchhistory: ["Search History", "Browse past conversations"],
    };
    return map[section] || ["", ""];
  };

  const [title, sub] = getPageTitle();
  const isSmart = ["knowledgebase", "nlu", "chat"].includes(section);

  const statCards = [
    { label: "Pending approvals", value: "5", change: "+2 today" },
    { label: "Published this month", value: "12", change: "3 rates · 9 content" },
    { label: "Chatbot sessions", value: "1,847", change: "▲ 18%", changeColor: "#6E9C92" },
    { label: "Avg approval time", value: "4.2h", change: "target < 8h" },
  ];

  const handleSmartToggle = () => {
    setSmartExpanded(!smartExpanded);
    if (!smartExpanded) setSection("nlu");
  };

  const renderContent = () => {
    switch (section) {
      case "dashboard":
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
              {statCards.map((card) => (
                <div key={card.label} style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ fontSize: "12px", color: "#9A958A", fontWeight: 500 }}>{card.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px" }}>
                    <span style={{ fontFamily: "'Newsreader', serif", fontSize: "36px", fontWeight: 500, color: "#0E3B36" }}>{card.value}</span>
                    <span style={{ fontSize: "12px", fontWeight: card.changeColor ? 600 : 400, color: card.changeColor || "#9A958A" }}>{card.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "18px", marginTop: "18px" }}>
                <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1ECE0" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700 }}>Pending approvals</div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#9C6B3F", background: "#F6ECDA", padding: "4px 10px", borderRadius: "20px" }}>Action required</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr .8fr", padding: "11px 20px", background: "#FBF9F4", fontSize: "10.5px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#9A958A" }}>
                    <div>Change request</div>
                    <div>Submitted by</div>
                    <div>Type</div>
                    <div></div>
                  </div>
                  {pendingItems.map((p, i) => (
                    <button key={i} onClick={() => {}} style={{ width: "100%", textAlign: "left", display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr .8fr", alignItems: "center", padding: "14px 20px", borderTop: "1px solid #F1ECE0", background: "transparent", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: "pointer" }}>
                      <div>
                        <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#1B1A16" }}>{p.title}</div>
                        <div style={{ fontSize: "11px", color: "#9A958A" }}>{p.date}</div>
                      </div>
                      <div style={{ fontSize: "13px", color: "#5C5A52" }}>{p.by}</div>
                      <div><span style={{ fontSize: "11px", fontWeight: 600, color: p.tagColor, background: p.tagBg, padding: "3px 9px", borderRadius: "20px" }}>{p.type}</span></div>
                      <div style={{ textAlign: "right", fontSize: "13px", fontWeight: 600, color: "#0E3B36" }}>Review →</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ background: "#fff", border: "1px solid #ECE6D8", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Recent activity</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {activityItems.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: "12px", padding: "11px 0", borderBottom: "1px solid #F4F1EA" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: a.dot, marginTop: "5px", flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: "13px", color: "#1B1A16", lineHeight: 1.4 }}>{a.text}</div>
                            <div style={{ fontSize: "11px", color: "#9A958A", marginTop: "2px" }}>{a.when}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSection("audit")} style={{ width: "100%", marginTop: "14px", fontSize: "12.5px", fontWeight: 600, color: "#0E3B36", background: "#F1ECE0", border: "none", padding: "11px", borderRadius: "9px", cursor: "pointer" }}>View full audit log →</button>
                  </div>
                </div>
              </div>
          </div>
        );
      case "rates":
        return <RateChanges />;
      case "approvals":
        return <ApprovalsQueue />;
      case "documents":
        return <DocumentsSection />;
      case "audit":
        return <AuditLog />;
      case "config":
        return <ApprovalRules />;
      case "knowledgebase":
        return <KnowledgeBase />;
      case "nlu":
        return <NLU />;
      case "chat":
        return <ChatSection />;
      case "searchhistory":
        return <Search />;
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Public Sans', system-ui, sans-serif", color: "#1B1A16", display: "flex", minHeight: "100vh", background: "#F4F1EA" }}>
      <aside style={sidebarStyles.aside}>
        <div style={sidebarStyles.logo}>
          <img src={NazariLogo} alt="Nazari" style={{ height: "34px", width: "auto", background: "#F5F1E8", padding: "6px 10px", borderRadius: "6px" }} />
        </div>
        <nav style={sidebarStyles.nav}>
          <div style={sidebarStyles.sectionLabel}>Workspace</div>
          {sections.map((s) => (
            <button key={s.key} onClick={() => setSection(s.key)} style={sidebarStyles.btnBase(section === s.key)}>
              <span style={{ width: "4px", height: "16px", borderRadius: "3px", background: "#C8A24C", opacity: section === s.key ? 1 : 0 }} />
              <span style={{ width: "18px", textAlign: "center" }}>{s.icon}</span>
              {s.label}
              {s.key === "approvals" && <span style={sidebarStyles.badge}>5</span>}
            </button>
          ))}
          <div style={sidebarStyles.sectionLabel}>Smart Engine</div>
          <button
            onClick={handleSmartToggle}
            style={sidebarStyles.btnBase(smartExpanded && isSmart)}
          >
            <span style={{ width: "4px", height: "16px", borderRadius: "3px", background: "#C8A24C", opacity: smartExpanded && isSmart ? 1 : 0 }} />
            <span style={{ width: "18px", textAlign: "center" }}>⚡</span>
            Smart Engine
            <span style={{ ...arrowStyles, transform: smartExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>
          {smartExpanded && smartSubItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              style={sidebarStyles.subItem(section === item.key)}
            >
              <span style={{ width: "18px", textAlign: "center", opacity: 0.6, fontSize: "12px" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ ...sidebarStyles.userFooter, position: "relative", cursor: "pointer" }} ref={userMenuRef} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#6E9C92", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#0A2C28" }}>
            {user?.username ? getInitials(user.username) : "U"}
          </div>
          <div style={{ lineHeight: 1.2, flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5F1E8" }}>{user?.username || "User"}</div>
            <div style={{ fontSize: "11px", color: "#6E9C92" }}>{user?.role || user?.user_type || "Admin"}</div>
          </div>
          <span style={{ fontSize: "10px", color: "rgba(245,241,232,.5)", transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "none" }}>▼</span>
          {userMenuOpen && (
            <div style={{ position: "absolute", bottom: "100%", left: "12px", right: "12px", background: "#0E3B36", border: "1px solid rgba(255,255,255,.12)", borderRadius: "8px", overflow: "hidden", boxShadow: "0 -4px 16px rgba(0,0,0,.3)", zIndex: 50 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(false); dispatch(resetConversations()); dispatch(setLogout()); }}
                style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", border: "none", background: "none", color: "#E8B4B4", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,.06)"}
                onMouseLeave={(e) => e.target.style.background = "none"}
              >
                <span style={{ fontSize: "15px" }}>⏻</span>
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
        <header style={{ height: "64px", flexShrink: 0, background: "#FBF9F4", borderBottom: "1px solid #ECE6D8", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", zIndex: 30 }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1B1A16" }}>{title}</div>
            <div style={{ fontSize: "11.5px", color: "#9A958A" }}>{sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F1ECE0", borderRadius: "9px", padding: "9px 14px", width: "240px" }}>
              <span style={{ color: "#B5B0A4", fontSize: "13px" }}>⌕</span>
              <span style={{ fontSize: "13px", color: "#B5B0A4" }}>Search requests...</span>
            </div>
            <button style={{ position: "relative", width: "38px", height: "38px", borderRadius: "9px", border: "1px solid #ECE6D8", background: "#fff", cursor: "pointer", fontSize: "15px", color: "#6B6862" }}>
              ◔
              <span style={{ position: "absolute", top: "7px", right: "8px", width: "7px", height: "7px", borderRadius: "50%", background: "#C8A24C" }} />
            </button>
            <button onClick={() => setSection("rates")} style={{ fontSize: "13px", fontWeight: 600, color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "11px 18px", borderRadius: "9px", cursor: "pointer" }}>+ New request</button>
          </div>
        </header>
        <main className="custom-scrollbar" style={{ flex: 1, padding: section === "chat" ? 0 : "28px", overflow: section === "chat" ? "hidden" : "auto", minHeight: 0 }}>
          <div style={{ height: "100%", display: section === "chat" ? "flex" : "block", flexDirection: "column" }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function ChatSection() {
  const dispatch = useDispatch();
  const { conversations, activeConvId } = useSelector((state) => state.conversation);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef(null);

  useEffect(() => {
    dispatch(seedNluChats());
  }, [dispatch]);

  useEffect(() => {
    if (renameId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renameId]);

  const handleSelectChat = (id) => dispatch(selectChat(id));

  const startRename = (chat) => {
    setRenameValue(chat.messages.length > 0 ? chat.messages[0].content : chat.title);
    setRenameId(chat.id);
    setMenuOpenId(null);
  };

  const submitRename = () => {
    if (renameValue.trim() && renameId) {
      dispatch(renameChat({ id: renameId, title: renameValue.trim() }));
    }
    setRenameId(null);
    setRenameValue("");
  };

  const handleDownloadChat = (chat) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;
    const title = chat.messages.length > 0 ? chat.messages[0].content : chat.title;
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    doc.text(`Downloaded: ${dateStr}`, margin, y);
    y += 10;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    for (const msg of chat.messages) {
      if (y > 270) { doc.addPage(); y = margin; }
      const role = msg.role === "user" ? "You" : "Assistant";
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.setTextColor(msg.role === "user" ? "#009591" : "#333333");
      doc.text(`${role}:`, margin, y);
      y += 6;
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(msg.content || "", maxWidth);
      for (const line of lines) { if (y > 275) { doc.addPage(); y = margin; } doc.text(line, margin, y); y += 5; }
      y += 4;
    }
    doc.save(`${title.substring(0, 40)}.pdf`);
    toast.success("Chat downloaded as PDF");
  };

  const panelWidth = historyOpen ? 260 : 0;

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <div style={{
        width: panelWidth,
        minWidth: panelWidth,
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease",
        background: "#fff",
        borderRight: "1px solid #ECE6D8",
        borderRadius: "12px 0 0 12px",
        display: "flex",
        flexDirection: "column",
      }}>
        {historyOpen && <ChatHistoryPanel
          conversations={conversations}
          activeConvId={activeConvId}
          menuOpenId={menuOpenId}
          renameId={renameId}
          renameValue={renameValue}
          renameRef={renameRef}
          onSelect={handleSelectChat}
          onRenameChange={setRenameValue}
          onRenameKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenameId(null); }}
          onRenameBlur={submitRename}
          onStartRename={startRename}
          onDownload={handleDownloadChat}
          onDelete={(id) => { setMenuOpenId(null); dispatch(deleteChat(id)); }}
          onMenuToggle={(id) => { setMenuOpenId(menuOpenId === id ? null : id); setRenameId(null); }}
          onNewChat={() => dispatch(createNewChat())}
        />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", borderRadius: "0 12px 12px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid #ECE6D8", background: "#FBF9F4", flexShrink: 0 }}>
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#6B6862", padding: "4px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s", transform: historyOpen ? "rotate(0deg)" : "rotate(180deg)" }}>▤</span>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>{historyOpen ? "Hide" : "Show"} history</span>
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <ChatArea />
        </div>
      </div>
    </div>
  );
}

function ChatHistoryPanel({ conversations, activeConvId, menuOpenId, renameId, renameValue, renameRef, onSelect, onRenameChange, onRenameKeyDown, onRenameBlur, onStartRename, onDownload, onDelete, onMenuToggle, onNewChat }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        (c.messages?.[0]?.content || c.title).toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  const now = new Date();
  const groups = {};
  const list = searchQuery ? filteredConversations : conversations;
  for (const chat of list) {
    const d = new Date(chat.createdAt || now);
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    const diffWeeks = diffDays / 7;
    let cat;
    if (diffDays < 1) {
      cat = "Today";
    } else if (d.getDay() <= now.getDay() && diffDays < 7) {
      cat = "This Week";
    } else if (diffWeeks < 2) {
      cat = "Last Week";
    } else if (diffDays < 30) {
      cat = "This Month";
    } else if (diffDays < 60) {
      cat = "Last Month";
    } else {
      cat = "Older";
    }
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(chat);
  }
  const order = ["Today", "This Week", "Last Week", "This Month", "Last Month", "Older"];

  return (
    <>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #F1ECE0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1B1A16" }}>Chat History</span>
        <button onClick={onNewChat} style={{ fontSize: "11px", fontWeight: 600, color: "#F5F1E8", background: "#0E3B36", border: "none", padding: "5px 11px", borderRadius: "6px", cursor: "pointer" }}>+ New</button>
      </div>
      <div style={{ padding: "6px 10px", borderBottom: "1px solid #F1ECE0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#F5F1E8", borderRadius: "6px", padding: "0 8px" }}>
          <img src={SearchIcon} alt="search" style={{ width: "12px", height: "12px", opacity: 0.5 }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: "none", background: "transparent", padding: "7px 4px", fontSize: "12px", outline: "none", color: "#1B1A16", minWidth: 0 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#9A958A", padding: "0 2px", lineHeight: 1 }}>✕</button>
          )}
        </div>
      </div>
      <div className="chat-history-scroll" style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
        {order.map((cat) => {
          const chats = groups[cat];
          if (!chats || chats.length === 0) return null;
          return (
            <div key={cat}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#9A958A", padding: "8px 8px 4px", textTransform: "uppercase", letterSpacing: ".04em" }}>{cat}</div>
              {chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeConvId === chat.id}
                  renameId={renameId}
                  renameValue={renameValue}
                  menuOpenId={menuOpenId}
                  renameRef={renameRef}
                  onSelect={onSelect}
                  onRenameChange={onRenameChange}
                  onRenameKeyDown={onRenameKeyDown}
                  onRenameBlur={onRenameBlur}
                  onStartRename={onStartRename}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  onMenuToggle={onMenuToggle}
                />
              ))}
            </div>
          );
        })}
        {(!searchQuery ? conversations : filteredConversations).length === 0 && (
          <div style={{ padding: "20px 10px", textAlign: "center", fontSize: "12px", color: "#9A958A" }}>
            {searchQuery ? "No matching conversations" : "No conversations yet"}
          </div>
        )}
      </div>
    </>
  );
}

function ChatItem({ chat, isActive, renameId, renameValue, menuOpenId, renameRef, onSelect, onRenameChange, onRenameKeyDown, onRenameBlur, onStartRename, onDownload, onDelete, onMenuToggle }) {
  return (
    <div
      onClick={() => { if (renameId !== chat.id) onSelect(chat.id); }}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
        background: isActive ? "#F1ECE0" : "transparent",
        fontSize: "12.5px", color: "#1B1A16", marginBottom: "2px",
        position: "relative",
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#FBF9F4"; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      {renameId === chat.id ? (
        <input
          ref={renameRef}
          style={{ flex: 1, border: "1px solid #0E3B36", borderRadius: "4px", padding: "3px 6px", fontSize: "12px", outline: "none", minWidth: 0 }}
          value={renameValue}
          onChange={(e) => onRenameChange(e.target.value)}
          onKeyDown={onRenameKeyDown}
          onBlur={onRenameBlur}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {chat.messages.length > 0 ? chat.messages[0].content : chat.title}
        </span>
      )}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onMenuToggle(chat.id); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", opacity: 0.5, fontSize: "14px", lineHeight: 1 }}
        >⋯</button>
        {menuOpenId === chat.id && (
          <div style={{ position: "absolute", top: "100%", right: "0", zIndex: 100, minWidth: "110px", background: "#fff", border: "1px solid #ECE6D8", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <button onClick={(e) => { e.stopPropagation(); onStartRename(chat); }} style={{ display: "block", width: "100%", padding: "7px 12px", border: "none", background: "none", fontSize: "12px", cursor: "pointer", textAlign: "left", color: "#1B1A16" }}
              onMouseEnter={(e) => e.target.style.background = "#F5F1E8"}
              onMouseLeave={(e) => e.target.style.background = "none"}
            >Rename</button>
            <button onClick={(e) => { e.stopPropagation(); onMenuToggle(null); onDownload(chat); }} style={{ display: "block", width: "100%", padding: "7px 12px", border: "none", background: "none", fontSize: "12px", cursor: "pointer", textAlign: "left", color: "#1B1A16" }}
              onMouseEnter={(e) => e.target.style.background = "#F5F1E8"}
              onMouseLeave={(e) => e.target.style.background = "none"}
            >Download</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }} style={{ display: "block", width: "100%", padding: "7px 12px", border: "none", background: "none", fontSize: "12px", cursor: "pointer", textAlign: "left", color: "#C0392B" }}
              onMouseEnter={(e) => e.target.style.background = "#FDF2F2"}
              onMouseLeave={(e) => e.target.style.background = "none"}
            >Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Placeholder({ title, desc, icon }) {
  return (
    <div style={{ padding: "48px", textAlign: "center" }}>
      {icon && <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.4 }}>{icon}</div>}
      <div style={{ fontSize: "18px", fontWeight: 600, color: "#0E3B36", marginBottom: "8px" }}>{title}</div>
      <p style={{ margin: 0, color: "#9A958A", fontSize: "14px" }}>{desc}</p>
    </div>
  );
}

export default AdminPortal;
