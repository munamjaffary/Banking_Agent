import { useState, useRef } from "react";
import { useUploadMutation, useGenericMutation, useLazyGetQuery } from "../api/apiSlice";
import { endpoints } from "../api/config";

export const useUpload = () => {
  const [uploadStates, setUploadStates] = useState({});
  const intervals = useRef({});

  const [uploadMutation] = useUploadMutation();
  const [genericMutation] = useGenericMutation();
  const [triggerProgress] = useLazyGetQuery();

  const startPolling = (fileName, type) => {
    const endpoint = type === "upload" 
      ? endpoints.document.documentuploadprogress 
      : endpoints.document.documentingestprogress;

    const intervalId = setInterval(async () => {
      try {
        const { data } = await triggerProgress({ 
          endpoint, 
          params: { file_name: fileName } 
        }, true);

        if (data && typeof data.progress !== "undefined") {
          setUploadStates(prev => ({
            ...prev,
            [fileName]: { ...prev[fileName], progress: data.progress }
          }));
          if (data.progress >= 100) clearInterval(intervals.current[fileName]);
        }
      } catch (err) {
        clearInterval(intervals.current[fileName]);
      }
    }, 2000);
    intervals.current[fileName] = intervalId;
  };

  const uploadProcess = async (file, category, onSuccessCallback) => {
    setUploadStates(prev => ({
      ...prev,
      [file.name]: { progress: 0, status: "processing" }
    }));

    startPolling(file.name, "upload");

    try {
      await uploadMutation({
        endpoint: endpoints.document.documentupload,
        data: { file },
        params: { category },
      }).unwrap();

      clearInterval(intervals.current[file.name]);
      
      onSuccessCallback(file.name);

    } catch (error) {
      clearInterval(intervals.current[file.name]);
      setUploadStates(prev => ({ 
        ...prev, 
        [file.name]: { ...prev[file.name], status: "error" } 
      }));
      throw error;
    }
  };

  const cancelProcess = async (fileName) => {
    clearInterval(intervals.current[fileName]);
    try {
      await genericMutation({
        endpoint: endpoints.document.documentuploadcancel,
        method: "POST",
        params: { file_name: fileName },
      }).unwrap();
    } catch (err) {
      console.error("Cancel API Error:", err);
    }
  };

  return { uploadProcess, uploadStates, setUploadStates, cancelProcess };
};