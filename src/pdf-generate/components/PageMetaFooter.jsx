import React from "react";
import { fmtDateTime } from "../utils/formatters";

export default function PageMetaFooter({ pageNumber, totalPages }) {
  return (
    <div className="print-meta-footer mt-auto pt-2 flex justify-between text-[10px] text-gray-600 font-semibold bg-white">
      <span>Printed on : {fmtDateTime(new Date())}</span>
      <span>Page {pageNumber} of {totalPages}</span>
    </div>
  );
}