// import React from "react";
// import SearchIcon from "../assets/icons/search.svg";

// const Search = () => {
//   // Dummy Data with dates
//   const recentChats = [
//     { id: 1, title: "Styling Widgets for Full Height", date: "2026-02-09" },
//     { id: 2, title: "SVG Arrow Rotation: Right to Down", date: "2026-02-06" },
//     { id: 3, title: "Fixing Sidebar and Layout", date: "2025-12-26" },
//     { id: 4, title: "C# Code Correction and Explanation", date: "2023-11-08" },
//   ];
//   const formatDateLabel = (dateStr) => {
//     const date = new Date(dateStr);
//     const today = new Date("2026-02-09");

//     if (date.toDateString() === today.toDateString()) return "Today";

//     const diffTime = Math.abs(today - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays <= 7)
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   // Grouping Logic
//   const categorizeChats = () => {
//     const today = new Date("2026-02-09");
//     const categories = {
//       Today: [],
//       "Previous 7 Days": [],
//       "Last Month": [],
//     };

//     recentChats.forEach((chat) => {
//       const chatDate = new Date(chat.date);
//       const diffDays = (today - chatDate) / (1000 * 60 * 60 * 24);

//       if (diffDays < 1) categories.Today.push(chat);
//       else if (diffDays <= 7) categories["Previous 7 Days"].push(chat);
//       else categories["Last Month"].push(chat);
//     });

//     return categories;
//   };

//   const groupedChats = categorizeChats();

//   return (
//     <div className="search-container height">
//       <div className="search-header">
//         <h1>Search Chat History</h1>
//         <div className="search-input-wrapper">
//           <button className="search-btn">
//             <img src={SearchIcon} alt="search" />
//           </button>
//           <input
//             type="text"
//             className="search-input-field"
//             placeholder="Search for chats..."
//           />
//         </div>
//       </div>

//       <div className="search-body">
//         {Object.keys(groupedChats).map(
//           (category) =>
//             groupedChats[category].length > 0 && (
//               <div key={category} className="search-group">
//                 <h5 className="group-title">{category}</h5>
//                 {groupedChats[category].map((chat) => (
//                   <div key={chat.id} className="search-item">
//                     <p className="chat-title">{chat.title}</p>
//                     <p className="chat-date">{formatDateLabel(chat.date)}</p>
//                   </div>
//                 ))}
//               </div>
//             ),
//         )}
//       </div>
//     </div>
//   );
// };

// export default Search;

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewChat, selectChat, renameChat, deleteChat } from "../api/conversationSlice";
import SearchIcon from "../assets/icons/search.svg";
import { jsPDF } from "jspdf";

const Search = () => {
  const [query, setQuery] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations } = useSelector((state) => state.conversation);

  useEffect(() => {
    if (renameId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renameId]);

  const groupedChats = useMemo(() => {
    const filtered = conversations.filter((c) =>
      (c.messages?.[0]?.content || c.title)
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

    const today = new Date();
    return filtered.reduce((acc, chat) => {
      const diff =
        (today - new Date(chat.createdAt || today)) / (1000 * 60 * 60 * 24);
      const cat =
        diff < 1 ? "Today" : diff <= 7 ? "Previous 7 Days" : "Older Chats";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(chat);
      return acc;
    }, {});
  }, [query, conversations]);

  const handleAction = (id) => {
    dispatch(selectChat(id));
    navigate("/portal/chat");
  };

  const startRename = (chat) => {
    setRenameValue(chat.messages.length > 0 ? chat.messages[0].content : chat.title);
    setRenameId(chat.id);
  };

  const submitRename = () => {
    if (renameValue.trim() && renameId) {
      dispatch(renameChat({ id: renameId, title: renameValue.trim() }));
    }
    setRenameId(null);
    setRenameValue("");
  };

  const handleDownload = (chat) => {
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
      doc.setTextColor(80);
      const lines = doc.splitTextToSize(msg.content || "", maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 4;
    }
    const filename = title.substring(0, 40).replace(/[^a-z0-9]/gi, "_") || "chat";
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="search-container height">
      <div className="search-header">
        <h1>Search Chat History</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <button className="search-btn">
              <img src={SearchIcon} alt="SearchIcon" />
            </button>
            <input
              className="search-input-field"
              placeholder="Search for chats..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            className="search-new-chat-btn"
            onClick={() => {
              dispatch(createNewChat());
              navigate("/portal/chat");
            }}
          >
            <span className="new-chat-icon">+</span>
            <span className="new-chat-label">Start New Chat</span>
          </button>
        </div>
      </div>

      <div className="search-body">
        {Object.entries(groupedChats).map(([category, chats]) => (
          <div key={category} className="search-group">
            <h5 className="group-title">{category}</h5>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="search-item"
                onClick={() => handleAction(chat.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
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
                    style={{ flex: 1, marginRight: "8px" }}
                  />
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="chat-title truncate">
                      {chat.messages?.[0]?.content || chat.title}
                    </p>
                    <p className="chat-date">
                      {new Date(chat.createdAt || Date.now()).toLocaleDateString(
                        "en-US", { month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>
                )}
                <div className="search-item-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="search-action-btn" title="Rename" onClick={() => startRename(chat)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Rename</span>
                  </button>
                  <button className="search-action-btn" title="Download PDF" onClick={() => handleDownload(chat)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download</span>
                  </button>
                  <button className="search-action-btn danger" title="Delete" onClick={() => dispatch(deleteChat(chat.id))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
        {Object.keys(groupedChats).length === 0 && query && (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  );
};

export default Search;
