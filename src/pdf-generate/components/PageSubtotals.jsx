import React from "react";
import { fmt } from "../utils/formatters";

export default function PageSubtotals({
  isSpareInvoice,
  isInterState,
  pageSubtotal,
  runningTotal,
  isLastPage,
  roundOff,
  roundedGrand,
}) {
  // Columns preceding the Discount column
  // SPARE: S.NO(1), CODE/DESC(2), HSN(3), UOM(4), QTY(5), MRP(6), PRICE(7) -> 7
  // LABOUR: S.NO(1), CODE/DESC(2), HSN(3), QTY(4), LABOUR VALUE(5) -> 5
  const preDiscColSpan = isSpareInvoice ? 7 : 5;

  // Total columns in table
  // SPARE + IntraState = 11 | SPARE + InterState = 10
  // LABOUR + IntraState = 10 | LABOUR + InterState = 9
  const fullColSpan = isSpareInvoice
    ? isInterState
      ? 10
      : 11
    : isInterState
    ? 9
    : 10;

  const labelColSpan = fullColSpan - preDiscColSpan;

  return (
    <tfoot>
      <tr className="font-bold border-b border-black">
        <td
          colSpan={preDiscColSpan}
          className="border-t border-b border-l border-r-0 border-black text-center p-1"
        >
          Subtotal
        </td>
        <td className="border border-black text-right p-1">
          {fmt(pageSubtotal.discAmt)}
        </td>
        <td className="border border-black text-right p-1">
          {fmt(pageSubtotal.taxable)}
        </td>
        {isInterState ? (
          <td className="border border-black text-right p-1">
            {fmt(pageSubtotal.igst)}
          </td>
        ) : (
          <>
            <td className="border border-black text-right p-1">
              {fmt(pageSubtotal.cgst)}
            </td>
            <td className="border border-black text-right p-1">
              {fmt(pageSubtotal.sgst)}
            </td>
          </>
        )}
        <td className="border border-black text-right p-1">
          {fmt(pageSubtotal.grand)}
        </td>
      </tr>

      <tr className="font-bold bg-gray-50 hidden">
        <td
          colSpan={preDiscColSpan}
          className="border border-black text-center p-1"
        >
          CUMULATIVE RUNNING TOTAL
        </td>
        <td className="border border-black text-right p-1">
          {fmt(runningTotal.discAmt)}
        </td>
        <td className="border border-black text-right p-1">
          {fmt(runningTotal.taxable)}
        </td>
        {isInterState ? (
          <td className="border border-black text-right p-1">
            {fmt(runningTotal.igst)}
          </td>
        ) : (
          <>
            <td className="border border-black text-right p-1">
              {fmt(runningTotal.cgst)}
            </td>
            <td className="border border-black text-right p-1">
              {fmt(runningTotal.sgst)}
            </td>
          </>
        )}
        <td className="border border-black text-right p-1">
          {fmt(runningTotal.grand)}
        </td>
      </tr>

      {/*  Roundoff & Grand Total Rows */}
      {isLastPage && (
        <>
          {/* ROUNDOFF ROW */}
          <tr>
            <td colSpan={preDiscColSpan} className="border-none"></td>
            <td
              colSpan={labelColSpan}
              className="border-t border-b border-l border-r border-black text-right p-1"
            >
              ROUNDOFF (INR)
            </td>
            <td className="border-t border-b border-l border-r border-black text-right font-bold p-1">
              {fmt(roundOff)}
            </td>
          </tr>

          {/* GRAND TOTAL ROW */}
          <tr>
            <td colSpan={preDiscColSpan} className="border-none"></td>
            <td
              colSpan={labelColSpan}
              className="border-t border-b border-l border-r border-black text-right  p-1"
            >
              GRAND TOTAL (INR)
            </td>
            <td className="border-t border-b border-l border-r border-black text-right font-bold p-1">
              {fmt(roundedGrand)}
            </td>
          </tr>
        </>
      )}
    </tfoot>
  );
}