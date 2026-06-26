import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addMessage, updateLastMessage } from "../../api/conversationSlice";
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
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
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

  const handleSend = async (overrideText) => {
    const val = (
      typeof overrideText === "string" ? overrideText : input
    ).trim();

    if (!val || loading || !sessionId || !token) {
      if (!sessionId) toast.error("Waiting for session ID...");
      return;
    }

    setInput("");

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
      onStream: (content) =>
        dispatch(updateLastMessage({ convId: activeConvId, content })),
      onComplete: (references) =>
        references?.length &&
        dispatch(updateLastMessage({ convId: activeConvId, references })),
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

  return (
    <div className="chat-container">
      <div className="messages-viewport custom-scrollbar">
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
                <div className="typing-wave">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <div
                  className={`message-content ${
                    msg.content?.includes("Error:") ? "error-text" : ""
                  }`}
                >
                  {msg.content}
                </div>
              )}

              {msg.role === "assistant" && msg.references?.length > 0 && (
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
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-section">
        <div className="input-wrapper">
          <input
            type="text"
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
