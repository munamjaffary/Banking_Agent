import React, { useState } from "react";
import TableView from "../../components/TableView";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { endpoints } from "../../api/config";
import { useGetQuery, useLazyBlobRequestQuery } from "../../api/apiSlice";
import {
  downloadFileFromBlob,
  getErrorMessage,
} from "../../utils/HelperFunction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const tableHead = [
  { id: "document_name", label: "Document Name" },
  { id: "file_category", label: "Document Type" },
  { id: "uploaded_by", label: "Uploaded By" },
  { id: "category", label: "Category" },
  { id: "created_at", label: "Created At", type: "date" },
  { id: "uploaded_at", label: "Uploaded At", type: "date" },
  { id: "started_at", label: "Started At", type: "time" },
  { id: "completed_at", label: "Completed At", type: "time" },
  { id: "status", label: "Status" },
  { id: "extraction_progress", label: "Extraction Progress", type: "progress" },
];
const DocumentView = () => {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const {
    data: documenttable,
    refetch,
    isLoading,
  } = useGetQuery({
    endpoint: endpoints.document.documenttable,
    params: {
      skip: 0,
      limit: 5,
    },
  });

  const tableData = (documenttable?.documents || []).map((doc) => ({
    ...doc,
    extraction_progress: doc.status === "Completed" ? 100 : doc.started_at && !doc.completed_at ? 66 : 0,
  }));

  const [blobRequest] = useLazyBlobRequestQuery();

  const handleView = async (item) => {
    try {
      const res = await blobRequest({
        endpoint: endpoints.document.documentpreview,
        params: { object_id: item?._id },
      }).unwrap();
      const url = URL.createObjectURL(res);
      window.open(url, "_blank");
    } catch (error) {
      const customMsg = "Fail to Preview Document";
      toast.error(getErrorMessage(error, customMsg));
    }
  };

  const handleDownload = async (item) => {
    try {
      const res = await blobRequest({
        endpoint: endpoints.document.documentdownload,
        params: { object_id: item?._id },
      }).unwrap();
      downloadFileFromBlob(res, item?.document_name);
    } catch (error) {
      const customMsg = "Fail to Download Document";
      toast.error(getErrorMessage(error, customMsg));
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  return (
    <div className="bulk-container">
      <div className="documentview-row">
        <p>Recent Document Uploads</p>
        <button onClick={() => navigate("/portal/documents")}>View All</button>
      </div>
      <TableView
        tableHead={tableHead}
        tableData={tableData}
        isLoading={isLoading}
        deleteButton
        DownloadButton
        handleDownload={handleDownload}
        handleView={handleView}
        handleDelete={handleDelete}
      />

      {deleteTarget && (
        <DeleteModal
          show={!!deleteTarget}
          onHide={() => setDeleteTarget(null)}
          id={deleteTarget?._id}
          endpoint={endpoints.document.documentdelete}
          label="Document"
          onDeleteSuccess={() => {
            setDeleteTarget(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default DocumentView;
