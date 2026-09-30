import React from "react";
import { fmtDateTime } from "../utils/formatters";

export default function PageMetaFooter({ pageNumber, totalPages }) {
  return (
    <div className="print-meta-footer mt-auto pt-1 pb-0 flex justify-between text-[9pt] font-normal text-black bg-white">
      <span>Printed on :{fmtDateTime(new Date())}</span>
      <span>Page : {pageNumber} of {totalPages}</span>
    </div>
  );
}