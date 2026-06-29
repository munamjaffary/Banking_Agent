import React, { useState } from "react";
import TableView from "../../components/TableView";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { endpoints } from "../../api/config";
import { useGetQuery, useLazyBlobRequestQuery } from "../../api/apiSlice";
import {
  downloadFileFromBlob,
  getErrorMessage,
} from "../../utils/HelperFunction";
import { handleFileDownload } from "../../utils/Excel";
import Breadcrumbs from "../../components/Breadcrumbs";
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

const DocumentTable = () => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 5;
  const {
    data: documenttable,
    refetch,
    isLoading,
  } = useGetQuery({
    endpoint: endpoints.document.documenttable,
    params: {
      skip: (currentPage - 1) * limit,
      limit: limit,
    },
  });

  const tableData = (documenttable?.documents || []).map((doc) => ({
    ...doc,
    extraction_progress: doc.status === "Completed" ? 100 : doc.started_at && !doc.completed_at ? 66 : 0,
  }));
  const totalRecords = documenttable?.total || 0;
  const totalPages = Math.ceil(totalRecords / limit);

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
      toast.success("File downloaded successfully");
    } catch (error) {
      const customMsg = "Fail to Download Document";
      toast.error(getErrorMessage(error, customMsg));
    }
  };

  const handleExport = () => {
    try {
      if (!tableData || tableData.length === 0) {
        return toast.warn("No data available to export");
      }
      const exportData = tableData.map(({ _id, id, ...rest }) => rest);
      handleFileDownload(exportData, "Document-List");
      toast.success(`${tableData.length} documents exported successfully`);
    } catch (error) {
      const errorMsg = getErrorMessage(error, "Failed to generate export file");
      toast.error(errorMsg);
      console.error("Export Error:", error);
    }
  };
  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  return (
    <div className="bulk-container ">
      <div className="company-managment-action-row">
        <Breadcrumbs
          title={"Recent Document Uploads"}
          currentPage={"Document Uploads"}
        />
        <button
          className="back-to-activity-btn"
          onClick={() => navigate("/portal/knowledgebase?tab=activity")}
        >
          <span className="back-icon">←</span>
          <span className="back-label">Back to Activity</span>
        </button>
      </div>

      <TableView
        tableHead={tableHead}
        tableData={tableData}
        isLoading={isLoading}
        deleteButton
        DownloadButton
        searchRow={true}
        filterRow={true}
        handleDownload={handleDownload}
        handleView={handleView}
        handleDelete={handleDelete}
        exportData={handleExport}
        pagination={{
          currentPage: currentPage,
          totalPages: totalPages,
        }}
        onPageChange={(page) => setCurrentPage(page)}
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

export default DocumentTable;
