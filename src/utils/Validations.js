export const validationRules = {
  required: (fieldName, customMsg) => (value) =>
    value?.toString().trim() !== "" || customMsg || `${fieldName} is required.`,
  email:
    (customMsg = "Invalid email format.") =>
    (value) =>
      /^\S+@\S+\.\S+$/.test(value) || customMsg,
  minLength: (min, fieldName, customMsg) => (value) =>
    value.length >= min ||
    customMsg ||
    `${fieldName} must be at least ${min} characters.`,

  maxLength: (max, fieldName, customMsg) => (value) =>
    value.length <= max ||
    customMsg ||
    `${fieldName} must be less than ${max} characters.`,

  number: (fieldName, customMsg) => (value) =>
    !isNaN(value) || customMsg || `${fieldName} must be a number.`,

  range: (min, max, fieldName, customMsg) => (value) =>
    (value >= min && value <= max) ||
    customMsg ||
    `${fieldName} must be between ${min} and ${max}.`,

  regex:
    (pattern, customMsg = "Invalid format.") =>
    (value) =>
      pattern.test(value) || customMsg,
};

import { toast } from "react-toastify";

export const filetypes = [
  {
    label: "JPEG ",
    value: "image/jpeg",
    extensions: [".jpeg"],
  },

  {
    label: "PNG",
    value: "image/png",
    extensions: [".png"],
  },
  {
    label: "PDF",
    value: "application/pdf",
    extensions: [".pdf"],
  },
  {
    label: "Word",
    value:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: [".doc", ".docx"],
  },
  {
    label: "Excel",
    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extensions: [".xls", ".xlsx"],
  },
];

export function validateFile(file, acceptedTypes, acceptedExtensions = []) {
  if (!file) {
    toast.error("No file selected");
    return false;
  }

  const allowedMimeTypes = acceptedTypes
    .split(",")
    .map((type) => type.trim().toLowerCase());

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  const hasValidMime = allowedMimeTypes.some((allowed) => {
    if (allowed.endsWith("/*")) {
      const baseType = allowed.split("/")[0];
      return fileType.startsWith(baseType + "/");
    }
    return fileType === allowed;
  });

  const hasValidExtension = acceptedExtensions.some((ext) =>
    fileName.endsWith(ext.toLowerCase()),
  );

  if (!hasValidMime || !hasValidExtension) {
    toast.error("Invalid file type");
    return false;
  }

  return true;
}

export const filetypeMap = Object.fromEntries(
  filetypes.map((f) => [f.value, f]),
);

export const assignrole = [
  { label: "Role", value: 1 },
  { label: "User", value: 2 },
];

export function add3Dots(string, limit) {
  var dots = "...";
  if (string?.length > limit) {
    string = string?.substring(0, limit) + dots;
  }

  return string;
}

export const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str?.toUpperCase());
};

export const validateEmptyObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    throw new Error("Invalid object provided.");
  }

  for (let key in obj) {
    const value = obj[key];

    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      toast.error(`Please enter ${formatLabel ? formatLabel(key) : key}`);
      throw new Error(`Please enter ${formatLabel ? formatLabel(key) : key}`);
    }
  }

  return obj;
};

export const SelectAllOptions = (selected, optionsList, dataArray) => {
  let temp = [];
  const isSelectAll = selected?.some((option) => option?.value === "*");

  if (isSelectAll) {
    const alreadyAllSelected = dataArray?.length === optionsList?.length - 1;
    if (alreadyAllSelected) {
      temp = [];
    } else {
      temp = optionsList?.slice(1)?.map((item) => item?.value);
    }
  } else {
    temp = selected?.map((item) => item.value) || [];
  }

  return temp;
};
