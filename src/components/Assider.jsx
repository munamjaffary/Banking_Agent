import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GenAi from "../assets/icons/openai-icon.svg";
import SideBar from "../assets/icons/sidebar-close.svg";
import Dashoard from "../assets/icons/dashboard.svg";
import GridIcon from "../assets/icons/grid.svg";
import SearchIcon from "../assets/icons/search.svg";
import FolderIcon from "../assets/icons/folder.svg";
import NewChatIcon from "../assets/icons/new-chat.svg";
import RightArrow from "../assets/icons/rightarrow.svg";
import DownArrow from "../assets/icons/downarrow.svg";
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

function Assider({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { conversations, activeConvId } = useSelector(
    (state) => state.conversation,
  );

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
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

  const mainTabs = [
    { key: "newchat", icon: NewChatIcon, label: "New Chat" },
    { key: "chat", icon: FolderIcon, label: "Chats", path: "/chat" },
    { key: "search", icon: SearchIcon, label: "Search", path: "/search" },
    { key: "dashboard", icon: Dashoard, label: "Dashboard", path: "/" },
    { key: "activity", icon: Dashoard, label: "Activity", path: "/activity" },
    {
      key: "document",
      icon: GridIcon,
      label: "Document View",
      path: "/documettable",
    },
  ];

  const handleTabClick = (tab) => {
    if (tab.key === "newchat") {
      dispatch(createNewChat());
      setActiveTab("chat");
      navigate("/chat");
    } else {
      setActiveTab(tab.key);
      navigate(tab.path);
    }
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

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <aside className="assider">
      <div className={`assider-tabs ${collapsed ? "collapsed" : ""}`}>
        <div className="assiderlogo">
          {!collapsed && (
            <div className="logo-box">
              <img src={GenAi} alt="Logo" />
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
            {mainTabs.map((tab) => (
              <button
                key={tab.key}
                className={`nav-tabs-button ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                <img src={tab.icon} alt="" className="tab-icon-img" />
                {!collapsed && <span className="tab-label">{tab.label}</span>}
              </button>
            ))}

            {!collapsed && (
              <div className="extra-sections">
                <div
                  className="section-title toggle-clickable"
                  onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                >
                  <span>Projects</span>
                  <img
                    src={isProjectsOpen ? DownArrow : RightArrow}
                    className={`arrow-icon ${isProjectsOpen ? "down" : ""}`}
                    alt="arrow"
                  />
                </div>

                <div className="section-title">Your chats</div>
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
              </div>
            )}
          </div>
        </nav>

        <div className="assider-footer" ref={menuRef}>
          {showProfileMenu && !collapsed && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-info">
                <div className="small-avatar">
                  {user?.username ? getInitials(user.username) : "AA"}
                </div>
                <div className="user-meta">
                  <span className="dropdown-name">
                    {user?.username || "Junaid"}
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
