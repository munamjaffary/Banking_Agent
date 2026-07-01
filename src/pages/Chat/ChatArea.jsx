import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { addMessage, updateLastMessage, createNewChat, truncateMessages } from "../../api/conversationSlice";
import { addNluEntry, detectIntent } from "../../api/nluSlice";
import { userRoles } from "../../data/nluData";
import useChatManager from "../../hooks/useChatManager";
import useVoiceChat from "../../hooks/useVoiceChat";
import { useReferenceRequestMutation } from "../../api/apiSlice";
import { endpoints } from "../../api/config";

import {
  downloadFileFromBlob,
  getErrorMessage,
} from "../../utils/HelperFunction";

const MicIcon = ({ isRecording }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isRecording ? "#ff4d4d" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const ChatArea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const thinkingTimerRef = useRef(null);
  const assistantContentRef = useRef("");
  const [showRefs, setShowRefs] = useState({});
  const [thinkingPhase, setThinkingPhase] = useState("idle");
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { conversations, activeConvId } = useSelector(
    (state) => state.conversation,
  );
  const activeConv = conversations?.find((c) => c.id === activeConvId);

  const { streamChat, abort, loading, sessionId } = useChatManager();
  const { isRecording, isProcessing, startRecording, stopAndSend } =
    useVoiceChat();
  const [BlobRequest] = useReferenceRequestMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, loading]);

  useEffect(() => {
    if (loading) {
      setThinkingPhase("thinking");
      thinkingTimerRef.current = setTimeout(() => {
        setThinkingPhase("fetching");
      }, 3000);
    } else {
      setThinkingPhase("idle");
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
    }
    return () => {
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
    };
  }, [loading]);

  const handleSend = async (overrideText) => {
    const val = (
      typeof overrideText === "string" ? overrideText : input
    ).trim();

    if (!val || loading || !sessionId) {
      if (!sessionId) toast.error("Waiting for session ID...");
      return;
    }

    setInput("");
    assistantContentRef.current = "";

    dispatch(
      addMessage({
        convId: activeConvId,
        message: { role: "user", content: val },
      }),
    );

    dispatch(
      addMessage({
        convId: activeConvId,
        message: { role: "assistant", content: "", references: [] },
      }),
    );

    await streamChat({
      endpoint: endpoints.chat.response,
      data: { query: val },
      token: token,
      onStream: (content) => {
        assistantContentRef.current = content;
        dispatch(updateLastMessage({ convId: activeConvId, content }));
      },
      onComplete: (references) => {
        if (references?.length) {
          dispatch(updateLastMessage({ convId: activeConvId, references }));
        }
        dispatch(
          addNluEntry({
            _id: `live_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            session_id: sessionId,
            user_email: user?.email || "anonymous@guest",
            role: userRoles[user?.email] || "User",
            query: val,
            response: assistantContentRef.current,
            references: references || [],
            timestamp: new Date().toISOString(),
            intents: detectIntent(val),
            handoff: false,
          }),
        );
      },
      onError: (err) => {
        const errorMessage = getErrorMessage(err);
        dispatch(
          updateLastMessage({
            convId: activeConvId,
            content: `Error: ${errorMessage}`,
          }),
        );
        toast.error(errorMessage);
      },
    });
  };

  const handleVoiceInput = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      try {
        const result = await stopAndSend(endpoints.chat.audio);
        if (result) {
          setInput(result.transcription);
          handleSend(result.translation);
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Voice recognition failed"));
      }
    }
  };

  const handleAction = async (ref, actionType) => {
    try {
      const res = await BlobRequest({
        endpoint: endpoints.chat.reference,
        body: { "Document Name": ref.document_name, Page: ref.page },
      }).unwrap();

      if (actionType === "view") {
        const url = URL.createObjectURL(res);
        window.open(url, "_blank");
      } else {
        downloadFileFromBlob(res, ref.document_name);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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

  const inputRef = useRef(null);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editText, setEditText] = useState("");

  const handleRetry = (msgIdx) => {
    const msg = activeConv.messages[msgIdx];
    if (msg.role === "user") {
      const prevContent = msg.content;
      setInput(prevContent);
      setTimeout(() => handleSend(prevContent), 50);
      return;
    }
    for (let i = msgIdx - 1; i >= 0; i--) {
      if (activeConv.messages[i].role === "user") {
        const prevContent = activeConv.messages[i].content;
        setInput(prevContent);
        setTimeout(() => handleSend(prevContent), 50);
        break;
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

  const toggleRefs = (idx) => {
    setShowRefs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleClearChat = () => {
    dispatch(createNewChat());
    toast.success("New conversation started");
  };

  const suggestedQuestions = [
    { label: "🏦 Business Loans", query: "Tell me about NPFCU business loan options" },
    { label: "🎓 Education Savings", query: "What education savings plans does NPFCU offer?" },
    { label: "📊 Current Rates", query: "Show me the current rates from Nizari Credit Union" },
    { label: "🏠 Mortgage Options", query: "What mortgage options are available at NPFCU?" },
    { label: "💳 Credit Cards", query: "Tell me about NPFCU credit card options" },
    { label: "💰 Personal Loans", query: "Compare the different personal loan options" },
    { label: "📱 Online Banking", query: "How do I set up online banking with NPFCU?" },
    { label: "📈 Savings Accounts", query: "What are the current savings account rates?" },
  ];

  return (
    <div className="chat-container">
      {activeConv?.messages?.length > 0 && (
        <div className="chat-toolbar">
          <button className="icon-label-btn" onClick={handleClearChat}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span className="btn-hover-label">Clear Chat</span>
          </button>

          <button className="icon-label-btn" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 17 12 23 6" />
              <polyline points="1 6 7 12 1 18" />
              <line x1="11" y1="12" x2="7" y2="12" />
            </svg>
            <span className="btn-hover-label">Back to Widget</span>
          </button>
        </div>
      )}
      <div className={`messages-viewport custom-scrollbar${!activeConv?.messages?.length ? " messages-empty" : ""}`}>
        {activeConv?.messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-row ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <div
              className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "assistant-bubble"}`}
            >
              {msg.role === "assistant" &&
              !msg.content &&
              loading &&
              idx === activeConv.messages.length - 1 ? (
                <span className="thinking-text">
                  {thinkingPhase === "fetching" ? "Fetching context..." : "Thinking..."}
                </span>
              ) : editingIdx === idx && msg.role === "user" ? (
                <div className="message-content">
                  <textarea
                    className="edit-textarea"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleEditSubmit();
                      }
                      if (e.key === "Escape") handleEditCancel();
                    }}
                    autoFocus
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button className="edit-save-btn" onClick={handleEditSubmit}>Update</button>
                    <button className="edit-cancel-btn" onClick={handleEditCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div
                  className={`message-content ${
                    msg.content?.includes("Error:") ? "error-text" : ""
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content?.replace(/^[ \t]*(•|\*)\s*/gm, "- ").split("\n").map(l => l.trim()).join("\n")}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="msg-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleEditMessage(msg.content, idx)}
                  className="msg-action-btn"
                  title="Edit"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span className="btn-label">Edit</span>
                </button>
                <button
                  onClick={() => handleRetry(idx)}
                  className="msg-action-btn"
                  title="Retry"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  <span className="btn-label">Retry</span>
                </button>
              </div>
            )}

            {msg.role === "assistant" &&
              msg.references?.length > 0 &&
              showRefs[idx] && (
                <div className="sources-section">
                  <div className="sources-title">Chat References</div>
                  {msg.references.map((ref, rIdx) => (
                    <div key={rIdx} className="source-item">
                      <div className="source-info">
                        <div className="source-left">
                          <span className="source-name">
                            {ref.document_name}
                          </span>
                          <span className="source-page">
                            Page Number : {ref.page}
                          </span>
                        </div>
                        <span className="source-percentage">
                          {/* {(ref.score * 100).toFixed(0)}% */}
                        </span>
                      </div>
                      <div className="source-btns">
                        <button
                          onClick={() => handleAction(ref, "view")}
                          className="view-btn"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAction(ref, "download")}
                          className="download-btn"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {msg.role === "assistant" && msg.content && (
              <div className="msg-actions">
                <button
                  onClick={() => handleCopyContent(msg.content)}
                  className="msg-action-btn"
                  title="Copy"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span className="btn-label">Copy</span>
                </button>
                <button
                  onClick={() => handleDownloadContent(msg.content)}
                  className="msg-action-btn"
                  title="Download"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="btn-label">Download</span>
                </button>
                <button
                  onClick={() => handleRetry(idx)}
                  className="msg-action-btn"
                  title="Retry"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  <span className="btn-label">Retry</span>
                </button>
                <button
                  onClick={() => toggleRefs(idx)}
                  className={`msg-action-btn ${showRefs[idx] ? "active" : ""}`}
                  title="References"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span className="btn-label">References</span>
                  {msg.references?.length > 0 && (
                    <span className="ref-badge">{msg.references.length}</span>
                  )}
                </button>
                <button className="msg-action-btn" title="Thumbs Up">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  <span className="btn-label">Good</span>
                </button>
                <button className="msg-action-btn" title="Thumbs Down">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h2.28a2 2 0 0 1 2 1.7l1.38 9a2 2 0 0 1-2 2.3H17" />
                  </svg>
                  <span className="btn-label">Bad</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="msg-action-btn"
                  title="Clear Chat"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span className="btn-label">Clear Chat</span>
                </button>

              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {sessionId && (
      <div className="suggested-questions">
        <div className="sq-title">Try asking about:</div>
        <div className="sq-grid">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              className="sq-chip"
              onClick={() => handleSend(q.query)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
      )}

      <div className="chat-input-section">
        <div className="input-wrapper">
          <input
            type="text"
            ref={inputRef}
            className="chat-input-field"
            placeholder={
              sessionId ? "Ask anything..." : "Initializing session..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!sessionId}
          />

          <div className="input-actions">
            <button
              className={`mic-btn ${isRecording ? "pulse-red" : ""}`}
              onClick={handleVoiceInput}
              disabled={isProcessing || !sessionId}
            >
              {isProcessing ? (
                <div className="mini-spinner" />
              ) : (
                <MicIcon isRecording={isRecording} />
              )}
            </button>
            <button
              className={`send-btn-modern ${loading ? "loading-active" : ""}`}
              onClick={loading ? abort : handleSend}
              disabled={(!input.trim() && !loading) || !sessionId}
            >
              {loading ? (
                <span className="stop-icon">■</span>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
