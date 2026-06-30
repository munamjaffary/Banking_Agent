import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, createNewChat, updateLastMessage, selectChat } from "../api/conversationSlice";
import { useGenericMutation } from "../api/apiSlice";
import { baseUrl, endpoints } from "../api/config";
import { downloadFileFromBlob, getErrorMessage } from "../utils/HelperFunction";
import { toast } from "react-toastify";

function NPFCUChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const dispatch = useDispatch();
  const { conversations, activeConvId } = useSelector((state) => state.conversation);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = token && token !== "guest-session";
  const isFullChat = location.pathname === "/portal/chat" || location.pathname.startsWith("/portal/admin");
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

  const handleSend = useCallback(async () => {
    const val = input.trim();
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

    const controller = new AbortController();
    setAbortController(controller);

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
                references: parsed.references || [],
              }));
            }
          } catch {}
        }
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

  return (
    <>
      {!isFullChat && (
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
      )}

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
              <button className="npfcucw-iconbtn" onClick={() => { setOpen(false); if (isLoggedIn) { dispatch(createNewChat()); navigate("/portal/admin?section=chat"); } else { navigate("/portal/chat"); } }} title="Open Full Chat">
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
                  {msg.content || (msg.role === "assistant" ? "Thinking..." : "")}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

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
