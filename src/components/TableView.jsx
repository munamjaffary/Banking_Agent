import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import Select from "react-select";
import { customSelectStyles } from "../utils/SelectStyle";
import { getDocIcon } from "../utils/HelperFunction";
import { add3Dots } from "../utils/Validations";
import Eye from "../assets/icons/eye.svg";
import searchIcon from "../assets/icons/header-search.png";
import calender from "../assets/icons/calender.png";
import download from "../assets/icons/download-icon.svg";
import nodata from "../assets/icons/no-data-found.svg";
import DownloadIcon from "../assets/icons/download.svg";
import Delete from "../assets/icons/table-delete-icon.svg";

import "../assets/css/pagination.css";
import "react-day-picker/style.css";

const TableView = ({
  tableHead,
  tableData,
  isLoading,
  handleView,
  DownloadButton,
  handleDownload,
  options,
  onChange,
  filterRow,
  handleDelete,
  deleteButton,
  exportData,
  query,
  pagination,
  onPageChange,
  handleDateRange,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {filterRow && (
        <div className="filter-row">
          <div className="search-bar-row">
            <span className="search-bar-span">
              <img src={searchIcon} alt="Search" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </span>
            <div className="mobile-menu-btns" ref={anchorRef}>
              <button className="date-filter" onClick={() => setOpen(!open)}>
                <img src={calender} alt="Calendar" />
              </button>
              {open && (
                <div className="datepicker-modal">
                  <DayPicker
                    mode="range"
                    selected={{ to: query?.toDate, from: query?.fromDate }}
                    onSelect={handleDateRange}
                    disabled={{ after: new Date() }}
                    footer={
                      <div className="datepicker-footer">
                        <button
                          type="button"
                          className="clear-date-btn"
                          onClick={() => {
                            handleDateRange(null);
                            if (onPageChange) onPageChange(1);
                            setOpen(false);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <button type="button" className="export-btn" onClick={exportData}>
            <img src={download} alt="export" /> Export CSV
          </button>
        </div>
      )}

      <div className="managment-table table-responsive">
        <table>
          <thead>
            <tr>
              <th>
                <label className="custom-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
              </th>
              {tableHead?.map((col) => (
                <th key={col.id}>{col.label}</th>
              ))}
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
             [...Array(6)].map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td>
                    <div className="skeleton-box skeleton-checkbox"></div>
                  </td>
                  {tableHead?.map((col) => (
                    <td key={col.id}>
                      <div className={`skeleton-box ${col.label === "Status" ? "skeleton-status mx-auto" : "skeleton-text"}`}></div>
                    </td>
                  ))}
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <div className="skeleton-box skeleton-action"></div>
                      <div className="skeleton-box skeleton-action"></div>
                      <div className="skeleton-box skeleton-action"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : tableData?.length > 0 ? (
              tableData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <label className="custom-checkbox">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </td>

                  {tableHead?.map((col) => {
                    const value = item[col.id];
                    const isEmpty = !value?.toString().trim();

                    if (col.label === "Status") {
                      return (
                        <td key={col.id} className="text-center">
                          <span
                            className={`table-status status-${value?.toLowerCase().replace(/\s/g, "")}`}
                          >
                            {value || "----"}
                          </span>
                        </td>
                      );
                    }

                    if (col.label === "Document Type") {
                      const icon = getDocIcon(value);
                      return (
                        <td key={col.id} className="text-center">
                          <div className="doc-type-cell">
                            {icon && (
                              <img src={icon} alt="icon" className="doc-icon" />
                            )}
                            <span>{value || "----"}</span>
                          </div>
                        </td>
                      );
                    }

                    if (col.type === "date") {
                      return (
                        <td key={col.id} className="text-center">
                          {value ? moment(value).format("DD/MMM/YYYY") : "----"}
                        </td>
                      );
                    }
                    if (col.type === "time") {
                      return (
                        <td key={col.id} className="text-center">
                          {value
                            ? moment(value, ["HH:mm", "h:mm A"]).format(
                                "hh:mm A",
                              )
                            : "----"}
                        </td>
                      );
                    }

                    return (
                      <td key={col.id} className={isEmpty ? "text-center" : ""}>
                        {!isEmpty ? add3Dots(value, 20) : "----"}
                      </td>
                    );
                  })}

                  <td className="table-actions">
                    <div className="action-btns-wrapper">
                      <button onClick={() => handleView(item)}>
                        <img src={Eye} alt="view" />
                      </button>
                      {DownloadButton && (
                        <button onClick={() => handleDownload(item)}>
                          <img src={DownloadIcon} alt="download" />
                        </button>
                      )}
                      {deleteButton && (
                        <button onClick={() => handleDelete(item)}>
                          <img src={Delete} alt="delete" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHead?.length + 2}
                  className="nodata-found text-center"
                >
                  <img src={nodata} alt="No Data" />
                  <h5>No Data Found</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination?.totalPages > 1 && (
        <div className="pagination-row">
          <div className="center premium-pagination">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              className="prev"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={page === pagination.currentPage ? "active" : ""}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ),
            )}
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              className="next"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TableView;
