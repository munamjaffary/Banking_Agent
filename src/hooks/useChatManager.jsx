import { useRef, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { baseUrl, endpoints } from "../api/config";
import { useGenericMutation } from "../api/apiSlice";

const useChatManager = () => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const [genericAction] = useGenericMutation();

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await genericAction({
          endpoint: endpoints.auth.sessionid,
          method: "POST",
          data: {},
        }).unwrap();
        setSessionId(res?.session_id || res);
      } catch (err) {
        console.error("Session Initialization Error:", err);
      }
    };
    if (!sessionId) initSession();
  }, [genericAction, sessionId]);

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const streamChat = async ({
    endpoint,
    data,
    token,
    onStream,
    onComplete,
    onError,
  }) => {
    if (!sessionId) {
      onError?.("Session not initialized. Please wait.");
      return;
    }

    setLoading(true);
    abortControllerRef.current = new AbortController();
    let accumulated = "";
    let finalReferences = [];

    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}${endpoint}`,
        data: { ...data, session_id: sessionId },
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...(token && token !== "guest-session" ? { Authorization: `Bearer ${token}` } : {}),
        },
        responseType: "stream",
        adapter: "fetch",
        signal: abortControllerRef.current.signal,
      });

      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() || "";

        for (const line of parts) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data:")) continue;

          const jsonStr = trimmedLine.replace(/^data:\s*/, "");
          if (jsonStr === "[DONE]") break;

          try {
            const json = JSON.parse(jsonStr);
            if (json.content) {
              accumulated += json.content;
              onStream?.(accumulated);
            }
            if (json.references?.length) {
              finalReferences.push(
                ...json.references.map((ref) => ({
                  response_line: ref.response_line ?? "",
                  document_name: ref.document_name ?? "Unknown document",
                  page: ref.page ?? null,
                  score: ref.score ?? null,
                })),
              );
            }
          } catch (err) {
            console.warn("Partial chunk skipped");
          }
        }
      }
      onComplete?.(finalReferences);
    } catch (e) {
      if (!axios.isCancel(e)) {
        onError?.(e.response?.data?.detail || e.message || "Stream Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { streamChat, abort, loading, sessionId };
};

export default useChatManager;
