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

const Search = () => {
  const [query, setQuery] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
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

    const toDisplay = query === "" ? filtered.slice(0, 3) : filtered;

    const today = new Date();
    return toDisplay.reduce((acc, chat) => {
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
    setMenuOpenId(null);
  };

  const submitRename = () => {
    if (renameValue.trim() && renameId) {
      dispatch(renameChat({ id: renameId, title: renameValue.trim() }));
    }
    setRenameId(null);
    setRenameValue("");
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
                onClick={() => {
                  if (menuOpenId !== chat.id) handleAction(chat.id);
                }}
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
                <div className="chat-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="chat-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                      setRenameId(null);
                    }}
                    title="More options"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                  {menuOpenId === chat.id && (
                    <div className="chat-dropdown-menu" style={{ right: 0, left: "auto" }}>
                      <button onClick={(e) => { e.stopPropagation(); startRename(chat); }}>
                        Rename
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                        dispatch(deleteChat(chat.id));
                      }} className="danger">
                        Delete
                      </button>
                    </div>
                  )}
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
