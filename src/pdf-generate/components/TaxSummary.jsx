import React from "react";
import { fmt, amountToWordsINR } from "../utils/formatters";

export default function TaxSummary({
  overallTaxPct,
  taxable,
  cgst,
  sgst,
  igst,
  isInterState,
  roundedGrand,
  reverseCharge,
}) {
  return (
    <div className="mt-1 text-[9pt] font-sans relative z-10">
      <table className="w-[55%] border-collapse border border-black text-[9pt]">
        <thead>
          <tr>
            <th className="border border-black font-bold p-1 text-center text-[9pt]">Tax %</th>
            <th className="border border-black font-bold p-1 text-right text-[9pt]">Taxable Amount</th>
            {isInterState ? (
              <th className="border border-black font-bold p-1 text-right text-[9pt]">IGST</th>
            ) : (
              <>
                <th className="border border-black font-bold p-1 text-right text-[9pt]">CGST</th>
                <th className="border border-black font-bold p-1 text-right text-[9pt]">SGST</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black text-center p-1 text-[8pt] font-normal">{Number(overallTaxPct).toFixed(2)}</td>
            <td className="border border-black text-right p-1 text-[8pt] font-normal">{fmt(taxable)}</td>
            {isInterState ? (
              <td className="border border-black text-right p-1 text-[8pt] font-normal">{fmt(igst)}</td>
            ) : (
              <>
                <td className="border border-black text-right p-1 text-[8pt] font-normal">{fmt(cgst)}</td>
                <td className="border border-black text-right p-1 text-[8pt] font-normal">{fmt(sgst)}</td>
              </>
            )}
          </tr>
        </tbody>
      </table>

      <div className="mt-1 uppercase text-[9pt]">
        <span className="font-bold">AMOUNT IN WORDS : </span>
        <span className="font-normal">{amountToWordsINR(roundedGrand)} RUPEES ONLY</span>
      </div>
      <div className="font-bold text-[9pt] mt-0.5">
        Reverse Charges Applicable: {reverseCharge ? "Yes" : "No"}
      </div>
    </div>
  );
}