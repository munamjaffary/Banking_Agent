import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../api/config";

const useVoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopAndSend = useCallback(async (endpoint) => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) return reject("No recorder instance");
      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const formData = new FormData();
        formData.append("audio", audioBlob, "user_recording.wav");
        formData.append("text", "");

        try {
          const res = await axios.post(`${baseUrl}${endpoint}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          resolve(res.data);
        } catch (err) {
          console.error(
            "Audio Upload Error",
            err.response?.data || err.message,
          );
          reject(err);
        } finally {
          setIsRecording(false);
          setIsProcessing(false);
          mediaRecorderRef.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  return { isRecording, isProcessing, startRecording, stopAndSend };
};

export default useVoiceChat;
