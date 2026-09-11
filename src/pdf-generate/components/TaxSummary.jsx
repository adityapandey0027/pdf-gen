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
    <div className="mt-2 text-[10px] font-sans">
      <table className="w-[50%] border-collapse border border-black text-[9.5px]">
        <thead>
          <tr className="bg-gray-100">
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
            <td className="border border-black text-center p-1">{fmt(overallTaxPct)}</td>
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

      <div className="mt-2 font-bold uppercase">
        AMOUNT IN WORDS: {amountToWordsINR(roundedGrand)} RUPEES ONLY
      </div>
      <div className="font-bold">
        Reverse Charges Applicable: {reverseCharge ? "Yes" : "No"}
      </div>
    </div>
  );
}