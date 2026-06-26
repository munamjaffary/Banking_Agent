import { toast } from "react-toastify";
import XLSX from "xlsx-js-style";

export const handleFileDownload = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let c = range.s.c; c <= range.e.c; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};


export function downloadExcel(attachment) {
  const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${attachment}`;
  const downloadLink = document.createElement("a");
  const fileName = `excel.xlsx`;

  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}