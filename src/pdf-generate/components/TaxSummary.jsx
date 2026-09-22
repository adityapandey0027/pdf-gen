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
    <div className="mt-0 text-[13px] font-sans relative z-10">
      <table className="w-[55%] border-collapse border border-black text-[13px]">
        <thead>
          <tr>
            <th className="border border-black font-bold p-1 text-center">Tax %</th>
            <th className="border border-black font-bold p-1 text-right">Taxable Amount</th>
            {isInterState ? (
              <th className="border border-black font-bold p-1 text-right">IGST</th>
            ) : (
              <>
                <th className="border border-black font-bold p-1 text-right">CGST</th>
                <th className="border border-black font-bold p-1 text-right">SGST</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black text-center p-1">{Number(overallTaxPct).toFixed(2)}</td>
            <td className="border border-black text-right p-1">{fmt(taxable)}</td>
            {isInterState ? (
              <td className="border border-black text-right p-1">{fmt(igst)}</td>
            ) : (
              <>
                <td className="border border-black text-right p-1">{fmt(cgst)}</td>
                <td className="border border-black text-right p-1">{fmt(sgst)}</td>
              </>
            )}
          </tr>
        </tbody>
      </table>

      <div className="mt-3 uppercase">
        <span className="font-bold">AMOUNT IN WORDS:</span> {amountToWordsINR(roundedGrand)} RUPEES ONLY
      </div>
      <div className="font-bold">
        Reverse Charges Applicable: {reverseCharge ? "Yes" : "No"}
      </div>
    </div>
  );
}