import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GenAi from "../assets/icons/openai-icon.svg";
import SideBar from "../assets/icons/sidebar-close.svg";
import GridIcon from "../assets/icons/grid.svg";
import NazariLogo from "../assets/icons/nazari-logo.png";
import SettingsIcon from "../assets/icons/settings.svg";
import LogOutIcon from "../assets/icons/logout.svg";
import DotsIcon from "../assets/icons/dots.svg";

import { setLogout } from "../redux/authSlice";
import {
  createNewChat,
  selectChat,
  renameChat,
  deleteChat,
} from "../api/conversationSlice";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

function Assider({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { conversations, activeConvId } = useSelector(
    (state) => state.conversation,
  );

  const [activeTab, setActiveTab] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const menuRef = useRef(null);
  const renameRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (!event.target.closest(".chat-menu-wrapper")) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (renameId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renameId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.key);
    navigate(tab.path);
  };

  const handleSelectChat = (id) => {
    dispatch(selectChat(id));
    setActiveTab("chat");
    navigate("/chat");
  };

  const getInitials = (name) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const startRename = (chat) => {
    setRenameValue(
      chat.messages.length > 0 ? chat.messages[0].content : chat.title,
    );
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

    const title =
      chat.messages.length > 0 ? chat.messages[0].content : chat.title;
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Downloaded: ${dateStr}`, margin, y);
    y += 10;

    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    for (const msg of chat.messages) {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }

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
      for (const line of lines) {
        if (y > 275) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 5;
      }
      y += 4;
    }

    doc.save(`${title.substring(0, 40)}.pdf`);
    toast.success("Chat downloaded as PDF");
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <aside className="assider">
      <div className={`assider-tabs ${collapsed ? "collapsed" : ""}`}>
        <div className="assiderlogo">
          {!collapsed && (
            <div className="logo-box">
              <img src={NazariLogo} alt="Logo" style={{ height: "30px", width: "auto" }} />
            </div>
          )}
          <div
            className={`toggle-trigger ${collapsed ? "is-collapsed" : ""}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            <img
              src={collapsed ? GenAi : SideBar}
              alt="Toggle"
              className="base-icon"
            />

            {collapsed && (
              <img src={SideBar} alt="Hover" className="hover-logo" />
            )}
          </div>
        </div>
        <nav className="assider-button-tabs">
          <div className="sidebar-scroll-area">
            {!collapsed && (
              <>
                <button
                  className="nav-tabs-button"
                  onClick={() => {
                    dispatch(createNewChat());
                    setActiveTab("chat");
                    navigate("/portal/chat");
                  }}
                  style={{ marginBottom: "8px", fontWeight: 600 }}
                >
                  <span className="tab-label">+ New Conversation</span>
                </button>
                <div className="section-title">Smart Engine</div>
                <button
                  className={`nav-tabs-button ${activeTab === "kb" ? "active" : ""}`}
                  onClick={() => navigate("/portal/admin?section=knowledgebase")}
                >
                  <span className="tab-label">Knowledge Base</span>
                </button>
                <button
                  className={`nav-tabs-button ${activeTab === "nlu" ? "active" : ""}`}
                  onClick={() => navigate("/portal/admin?section=nlu")}
                >
                  <span className="tab-label">Smart Engine</span>
                </button>
                <button
                  className={`nav-tabs-button ${activeTab === "chat" ? "active" : ""}`}
                  onClick={() => navigate("/portal/admin?section=chat")}
                >
                  <span className="tab-label">Chat</span>
                </button>
                <div className="section-title">Chat History</div>
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    className={`nav-tabs-button project-item ${activeConvId === chat.id ? "active-chat" : ""}`}
                    onClick={() => {
                      if (renameId !== chat.id) handleSelectChat(chat.id);
                    }}
                  >
                    {renameId === chat.id ? (
                      <input
                        ref={renameRef}
                        className="chat-rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitRename();
                          if (e.key === "Escape") setRenameId(null);
                        }}
                        onBlur={submitRename}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="tab-label truncate">
                        {chat.messages.length > 0
                          ? chat.messages[0].content
                          : chat.title}
                      </span>
                    )}

                    <div className="chat-menu-wrapper">
                      <button
                        className="chat-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === chat.id ? null : chat.id,
                          );
                          setRenameId(null);
                        }}
                        title="More options"
                      >
                        <img src={DotsIcon} alt="more" width="14" height="14" />
                      </button>
                      {menuOpenId === chat.id && (
                        <div className="chat-dropdown-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(chat);
                            }}
                          >
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(null);
                              handleDownloadChat(chat);
                            }}
                          >
                            Download
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(null);
                              dispatch(deleteChat(chat.id));
                            }}
                            className="danger"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </nav>

        <div className="assider-footer" ref={menuRef}>
          {showProfileMenu && !collapsed && (
            <div className="profile-dropdown-menu">
              {user ? (
                <>
                  <div className="dropdown-user-info">
                    <div className="small-avatar">
                      {user?.username ? getInitials(user.username) : "AA"}
                    </div>
                    <div className="user-meta">
                      <span className="dropdown-name">
                        {user?.username || "Junaid"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#9C6B3F", fontWeight: "500" }}>
                        {user?.role || user?.user_type || ""}
                      </span>
                      <span className="dropdown-email">
                        {user?.email || "@muhammadjunaid.irfan"}
                      </span>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item">
                    <img src={GridIcon} alt="GridIcon" /> Upgrade plan
                  </button>
                  <button className="dropdown-item">
                    <img src={SettingsIcon} alt="SettingsIcon" /> Settings
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <img src={LogOutIcon} alt="LogOutIcon" /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-user-info">
                    <div className="small-avatar">
                      {user?.username ? getInitials(user.username) : "AA"}
                    </div>
                    <div className="user-meta">
                      <span className="dropdown-name">Anonymous</span>
                      <span className="dropdown-email">anonymous@guest</span>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate("/login"); }}>
                    <img src={LogOutIcon} alt="Login" /> Sign In
                  </button>
                </>
              )}
            </div>
          )}
          <div
            className="profile-trigger"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-info">
              <div className="avatar">
                {user?.username ? getInitials(user.username) : "AA"}
              </div>
              {!collapsed && (
                <div className="user-details">
                  <span className="user-name">
                    {user?.username || "Junaid"}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button className="upgrade-pill-btn">Upgrade</button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Assider;
