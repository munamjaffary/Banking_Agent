import PDF from "../assets/icons/pdf.svg";
import Word from "../assets/icons/word.svg";
import Jpg from "../assets/icons/jpg.svg";
import PowerPoint from "../assets/icons/power-point.svg";
import Excel from "../assets/icons/excel.svg";

const ICON_MAP = {
  pdf: PDF,
  excel: Excel,
  xls: Excel,
  word: Word,
  doc: Word,
  jpg: Jpg,
  jpeg: Jpg,
  png: Jpg,
  ppt: PowerPoint,
  power: PowerPoint,
};

export const getDocIcon = (type) => {
  if (!type) return null;
  const lowerType = type.toLowerCase();
  const key = Object.keys(ICON_MAP).find((item) => lowerType.includes(item));
  return ICON_MAP[key] || null;
};

export const downloadFileFromBlob = (blob, fileName) => {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "downloaded_file";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getErrorMessage = (
  error,
  fallback = "An unexpected error occurred",
) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const serverError = error?.data || error?.response?.data || error;
  if (serverError?.detail) {
    if (Array.isArray(serverError.detail)) {
      return serverError.detail[0]?.msg || fallback;
    }
    return serverError.detail;
  }
  if (serverError?.message) return serverError.message;
  if (error?.error) return typeof error.error === "string" ? error.error : fallback;
  return fallback;
};
