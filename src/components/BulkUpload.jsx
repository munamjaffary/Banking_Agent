import React, { useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import FileUploadIcon from "../assets/icons/bulkuploadfile.svg";
import AddIcon from "../assets/icons/add_icon.svg";
import CancelIcon from "../assets/icons/bulk-cross.svg";
import { customSelectStyles } from "../utils/SelectStyle";
import { useUpload } from "../hooks/useUpload";
import { endpoints } from "../api/config";
import { useGetQuery, useGenericMutation } from "../api/apiSlice";
import { add3Dots } from "../utils/Validations";

const FILE_CONFIG = {
  allowed_file_size: {
    docs: 25,
    pdf: 25,
    images: 10,
  },
  allowed_file_type: {
    docs: ["pdf", "doc", "docx", "ppt"],
    images: ["png", "jpg", "jpeg"],
  },
};

const extensionConfig = {};
const allowedExtensions = [];
Object.entries(FILE_CONFIG.allowed_file_type).forEach(([category, exts]) => {
  exts.forEach((ext) => {
    extensionConfig[ext] = {
      category,
      maxSize:
        FILE_CONFIG.allowed_file_size[category] ||
        FILE_CONFIG.allowed_file_size[ext],
    };
    if (!allowedExtensions.includes(ext)) allowedExtensions.push(ext);
  });
});

const SUPPORTED_TYPES_TEXT = Object.entries(FILE_CONFIG.allowed_file_type)
  .map(([category, exts]) => {
    const size = FILE_CONFIG.allowed_file_size[category];
    return `${exts.join(", ").toUpperCase()} (up to ${size}MB)`;
  })
  .join(" | ");

function BulkUpload() {
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const { data: getCategory, refetch: refetchCategories } = useGetQuery({
    endpoint: endpoints.document.documentcategories,
  });

  const [genericMutation] = useGenericMutation();

  const createCategory = async (name) => {
    if (!name) return;
    setUploadStates((prev) => ({
      ...prev,
      addCategoryLoading: true,
    }));
    try {
      const response = await genericMutation({
        endpoint: endpoints.upload.onecategory,
        data: { category: name },
      }).unwrap();
      toast.success(response?.message || "Category created!");
      await refetchCategories();
      setCategory({ value: name, label: name });
      setInputValue("");
    } catch (err) {
      const errorMsg = err?.data?.detail?.[0]?.msg || "Failed to add category";
      toast.error(errorMsg);
    } finally {
      setUploadStates((prev) => ({
        ...prev,
        addCategoryLoading: false,
      }));
    }
  };

  const { uploadProcess, uploadStates, setUploadStates, cancelProcess } =
    useUpload();

  const CategoryData =
    getCategory?.categories?.map((c) => ({ value: c, label: c })) || [];

  const isAddCategoryLoading = uploadStates?.addCategoryLoading;

  const handleUploadSuccess = (fileName) => {
    toast.success(`${fileName} uploaded successfully!`);

    setFiles((prev) => prev.filter((f) => f.name !== fileName));

    setUploadStates((prev) => {
      const newState = { ...prev };
      delete newState[fileName];
      return newState;
    });

    if (files.length <= 1) {
      setCategory(null);
      setInputValue("");
    }
  };

  const handleFiles = (fileList) => {
    if (!category) {
      return toast.warn("Please select or enter a category first");
    }

    const validFiles = Array.from(fileList).filter((file) => {
      const ext = file.name.toLowerCase().split(".").pop();
      const fileConfig = extensionConfig[ext];

      if (!fileConfig) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }

      const isSizeOk = file.size / 1024 / 1024 <= fileConfig.maxSize;

      if (!isSizeOk) {
        toast.error(`${file.name} exceeds ${fileConfig.maxSize}MB limit.`);
        return false;
      }

      return true;
    });

    if (validFiles.length) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleAddCategory = () => {
    createCategory(inputValue.trim());
  };

  const handleFinalSubmit = () => {
    if (!category) return toast.warn("Please select or enter a category first");

    if (!files.length) return toast.warn("Please add files first");

    files.forEach((file) => {
      uploadProcess(file, category.value, handleUploadSuccess).catch(() => {});
    });
  };

  return (
    <div className="bulk-container">
      <span className="bulk-heading">File Upload</span>

      <div
        className={`bulkupload-dotted ${isDragging ? "dragging-active" : ""}`}
        style={{
          cursor: "pointer",
          border: isDragging ? "2px dashed #4285F4" : "2px dashed #ccc",
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          dragCounter.current++;
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCounter.current--;
          if (dragCounter.current === 0) setIsDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          dragCounter.current = 0;
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!category)
            return toast.warn("Please select or enter a category first");
          fileInputRef.current.click();
        }}
      >
        <img src={FileUploadIcon} alt="upload" className="main-upload-img" />
        <div className="dotted-border">
          <span>Drag and drop your files</span>
          <p>{SUPPORTED_TYPES_TEXT}</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list-container my-3">
          {files.map((file) => {
            const state = uploadStates[file.name] || {
              progress: 0,
            };

            return (
              <div key={file.name} className="file-status-card mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ flex: 1 }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span>{add3Dots(file.name, 50)}</span>
                      <span className="upload-percentage">
                        {state.progress}%
                      </span>
                    </div>

                    <div className="progress-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${state.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="cancel-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelProcess(file.name);
                      setFiles((prev) =>
                        prev.filter((f) => f.name !== file.name),
                      );
                    }}
                  >
                    <img src={CancelIcon} alt="cancel" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="d-flex align-items-center gap-2 mt-4">
        <div className="flex-grow-1 inputs-container">
          <CreatableSelect
            isClearable
            options={CategoryData}
            styles={customSelectStyles}
            placeholder="Select or type to create category..."
            value={category}
            inputValue={inputValue}
            onChange={(val) => setCategory(val)}
            onInputChange={(val) => setInputValue(val)}
            onCreateOption={(value) => {
              createCategory(value);
            }}
            menuPlacement="auto"
            menuPosition="fixed"
          />
        </div>

        <button
          onClick={handleAddCategory}
          className="plus-add"
          disabled={
            isAddCategoryLoading ||
            !inputValue.trim() ||
            CategoryData.some((c) => c.value === inputValue.trim())
          }
        >
          {isAddCategoryLoading ? (
            <span className="load-bulk"></span>
          ) : (
            <img src={AddIcon} alt="add" />
          )}
        </button>

        <button
          className="submit-btn"
          onClick={handleFinalSubmit}
          disabled={!category || !files.length}
        >
          Submit
        </button>
      </div>

      <input
        type="file"
        hidden
        multiple
        ref={fileInputRef}
        accept={allowedExtensions.map((e) => `.${e}`).join(",")}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export default BulkUpload;
