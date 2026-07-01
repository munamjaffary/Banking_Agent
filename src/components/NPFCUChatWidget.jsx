import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, createNewChat, updateLastMessage, selectChat, truncateMessages } from "../api/conversationSlice";
import { useGenericMutation } from "../api/apiSlice";
import { baseUrl, endpoints } from "../api/config";
import { downloadFileFromBlob, getErrorMessage } from "../utils/HelperFunction";
import { toast } from "react-toastify";

function NPFCUChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [showRefs, setShowRefs] = useState({});
  const [editingIdx, setEditingIdx] = useState(null);
  const [editText, setEditText] = useState("");
  const dispatch = useDispatch();
  const { conversations, activeConvId } = useSelector((state) => state.conversation);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = token && token !== "guest-session";
  const [initSession] = useGenericMutation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations?.find((c) => c.id === activeConvId);
  const hasUserMessages = activeConv?.messages?.some((m) => m.role === "user");

  useEffect(() => {
    if (!sessionId) {
      initSession({
        endpoint: endpoints.auth.sessionid,
        method: "POST",
        data: {},
      })
        .unwrap()
        .then((res) => setSessionId(res?.session_id || res || null))
        .catch((err) => console.error("Session init error:", err));
    }
  }, [sessionId, initSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  useEffect(() => {
    if (!conversations.length) {
      dispatch(createNewChat());
    }
  }, [conversations.length, dispatch]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const suggestedQuestions = [
    { label: "🏦 Business Loans", query: "tell me about your business loans" },
    { label: "💳 Credit Cards", query: "Tell me about NPFCU credit card options" },
    { label: "💰 Personal Loans", query: "Compare the different personal loan options" },
    { label: "👤 Talk to an Agent", query: "I want to speak with a human agent" },
    { label: "🔄 Older Auto Loan Rate", query: "what is the older auto loan rate?" },
    { label: "🆕 Newer Auto Loan Rate", query: "what is the newer auto loan rate?" },
  ];

  const staticAnswers = {
    "what is the older auto loan rate?": "the older auto loan rates: 5.75%",
    "what is the newer auto loan rate?": "the new auto lan rates: 5.85%",
  };

  const handleSend = useCallback(async (overrideText) => {
    const val = (typeof overrideText === "string" ? overrideText : input).trim();
    if (!val) return;
    if (!sessionId) {
      toast.warn("Session not ready. Please wait...");
      return;
    }
    setInput("");

    if (!activeConv) dispatch(createNewChat());

    dispatch(addMessage({
      convId: activeConvId,
      message: { role: "user", content: val, references: [] },
    }));

    dispatch(addMessage({
      convId: activeConvId,
      message: { role: "assistant", content: "", references: [] },
    }));

    const staticAnswer = staticAnswers[val.toLowerCase()];
    if (staticAnswer) {
      dispatch(
        updateLastMessage({ convId: activeConvId, content: staticAnswer }),
      );
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);
    let finalReferences = [];

    try {
      const headers = { "Content-Type": "application/json" };
      if (token && token !== "guest-session") {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`${baseUrl}${endpoints.chat.response}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: val, session_id: sessionId }),
        signal: controller.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() || "";

        for (const line of parts) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.replace(/^data:\s*/, "");
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              fullContent += parsed.content;
              dispatch(updateLastMessage({
                convId: activeConvId,
                content: fullContent,
                references: finalReferences.length ? [...finalReferences] : undefined,
              }));
            }
            if (parsed.references?.length) {
              const mapped = parsed.references.map((ref) => ({
                response_line: ref.response_line ?? "",
                document_name: ref.document_name ?? "Unknown document",
                page: ref.page ?? null,
                score: ref.score ?? null,
              }));
              finalReferences.push(...mapped);
              dispatch(updateLastMessage({
                convId: activeConvId,
                references: [...finalReferences],
              }));
            }
          } catch {}
        }
      }
      if (finalReferences.length) {
        dispatch(updateLastMessage({
          convId: activeConvId,
          references: [...finalReferences],
        }));
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error(getErrorMessage(err) || "Failed to send message");
      }
    } finally {
      setAbortController(null);
    }
  }, [input, sessionId, token, activeConv, activeConvId, dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    dispatch(createNewChat());
    toast.success("New conversation started");
  };

  const handleRefAction = async (ref, actionType) => {
    try {
      const headers = { "Content-Type": "application/json", Accept: "application/json" };
      if (token && token !== "guest-session") {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${baseUrl}${endpoints.chat.reference}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ "Document Name": ref.document_name, Page: ref.page }),
      });
      if (!res.ok) {
        let errMsg = `Request failed with status ${res.status}`;
        try { const j = await res.json(); errMsg = j?.detail || j?.message || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const blob = await res.blob();
      if (actionType === "view") {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        downloadFileFromBlob(blob, ref.document_name);
      }
    } catch (err) {
      console.error("Ref action error:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleCopyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadContent = (content) => {
    const blob = new Blob([content], { type: "text/plain" });
    downloadFileFromBlob(blob, "response.txt");
  };

  const handleRetry = (msgIdx) => {
    const msg = activeConv?.messages[msgIdx];
    if (msg?.role === "user") {
      handleSend(msg.content);
    } else {
      for (let i = msgIdx - 1; i >= 0; i--) {
        if (activeConv?.messages[i]?.role === "user") {
          handleSend(activeConv.messages[i].content);
          break;
        }
      }
    }
  };

  const handleEditMessage = (content, idx) => {
    setEditingIdx(idx);
    setEditText(content);
  };

  const handleEditCancel = () => {
    setEditingIdx(null);
    setEditText("");
  };

  const handleEditSubmit = () => {
    if (!editText.trim()) return;
    dispatch(truncateMessages({ convId: activeConvId, fromIndex: editingIdx }));
    setEditingIdx(null);
    setEditText("");
    handleSend(editText.trim());
  };

  return (
    <>
      <button
        className="npfcucw-trigger"
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle chat"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className={`npfcucw-panel${!hasUserMessages ? " npfcucw-empty" : ""}`}>
          <div className="npfcucw-header">
            <div className="npfcucw-header-brand">
              <span className="npfcucw-header-icon">◆</span>
              <div>
                <span className="npfcucw-header-title">NPFCU Assistant</span>
                <span className="npfcucw-header-sub">AI-powered support</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {hasUserMessages && (
                <>
                  <button className="npfcucw-iconbtn" onClick={handleClearChat} title="Clear Chat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </>
              )}
              <button className="npfcucw-iconbtn" onClick={() => { setOpen(false); if (isLoggedIn) { navigate("/portal/admin?section=chat"); } else { navigate("/portal/chat"); } }} title="Open Full Chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <polyline points="17 8 14 8 14 11" />
                  <polyline points="7 16 10 16 10 13" />
                  <polyline points="7 8 10 8 10 11" />
                  <polyline points="17 16 14 16 14 13" />
                </svg>
              </button>
              <button className="npfcucw-close" onClick={() => setOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="npfcucw-messages">
            {!hasUserMessages && (
              <div className="npfcucw-msg npfcucw-msg-assistant">
                <div className="npfcucw-msg-avatar">◆</div>
                <div className="npfcucw-msg-bubble npfcucw-greeting">
                  {token ? "Welcome back! How can I help you today?" : <>Welcome! Chat as a guest or <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>sign in</a> for more features.</>}
                </div>
              </div>
            )}
            {activeConv?.messages?.map((msg, i) => (
              <div key={i} className={`npfcucw-msg npfcucw-msg-${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="npfcucw-msg-avatar">◆</div>
                )}
                <div className="npfcucw-msg-bubble">
                  <div>
                    {msg.role === "user" && editingIdx === i ? (
                      <div>
                        <textarea
                          className="edit-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSubmit(); }
                            if (e.key === "Escape") handleEditCancel();
                          }}
                          autoFocus
                          rows={2}
                          style={{ width: "100%", boxSizing: "border-box", fontSize: 12, padding: "4px 6px", border: "1px solid var(--border-color)", borderRadius: 4, resize: "none", fontFamily: "inherit" }}
                        />
                        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                          <button className="msg-action-btn" onClick={handleEditSubmit} style={{ fontSize: 10, padding: "2px 8px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer" }}>Update</button>
                          <button className="msg-action-btn" onClick={handleEditCancel} style={{ fontSize: 10, padding: "2px 8px", background: "transparent", border: "1px solid var(--border-color)", borderRadius: 3, cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (msg.content || (msg.role === "assistant" ? "Thinking..." : ""))}
                  </div>
                  {msg.role === "user" && msg.content && editingIdx !== i && (
                    <div className="msg-actions" style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 4 }}>
                      <button className="icon-label-btn" onClick={() => handleEditMessage(msg.content, i)} title="Edit" style={{ width: 24, height: 24, borderRadius: 3 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        <span className="btn-hover-label">Edit</span>
                      </button>
                      <button className="icon-label-btn" onClick={() => handleRetry(i)} title="Retry" style={{ width: 24, height: 24, borderRadius: 3 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                        <span className="btn-hover-label">Retry</span>
                      </button>
                    </div>
                  )}
                  {msg.role === "assistant" && msg.content && (
                    <>
                      {showRefs[i] && msg.references?.length > 0 && (
                        <div className="sources-section" style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                          {msg.references.map((ref, rIdx) => (
                            <div key={rIdx} className="source-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, padding: "3px 0" }}>
                              <span style={{ color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ref.document_name || ref.title}</span>
                              <div style={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: 6 }}>
                                <button className="icon-label-btn" onClick={() => handleRefAction(ref, "view")} title="View" style={{ width: 24, height: 24, borderRadius: 3 }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                  <span className="btn-hover-label">View</span>
                                </button>
                                <button className="icon-label-btn" onClick={() => handleRefAction(ref, "download")} title="Download" style={{ width: 24, height: 24, borderRadius: 3 }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                  <span className="btn-hover-label">Download</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="msg-actions" style={{ display: "flex", gap: 4, marginTop: 6 }}>
                        <button className="icon-label-btn" onClick={() => handleCopyContent(msg.content)} title="Copy" style={{ width: 28, height: 28, borderRadius: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          <span className="btn-hover-label">Copy</span>
                        </button>
                        <button className="icon-label-btn" onClick={() => handleDownloadContent(msg.content)} title="Download" style={{ width: 28, height: 28, borderRadius: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          <span className="btn-hover-label">Download</span>
                        </button>
                        <button className="icon-label-btn" onClick={() => setShowRefs((prev) => ({ ...prev, [i]: !prev[i] }))} title={`References (${msg.references?.length || 0})`} style={{ width: 28, height: 28, borderRadius: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                          <span className="btn-hover-label">{showRefs[i] ? "Hide Refs" : `Refs (${msg.references?.length || 0})`}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {sessionId && (
            <div className="suggested-questions" style={{ padding: "8px 12px 4px" }}>
              <div className="sq-title" style={{ marginBottom: 8, fontSize: 12 }}>Try asking about:</div>
              <div className="sq-grid">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="sq-chip"
                    style={{ padding: "5px 12px", fontSize: 12 }}
                    onClick={() => handleSend(q.query)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="npfcucw-input-bar">
            <input
              ref={inputRef}
              className="npfcucw-input"
              placeholder={"Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="npfcucw-send"
              onClick={handleSend}
              disabled={!input.trim() || !sessionId}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NPFCUChatWidget;
