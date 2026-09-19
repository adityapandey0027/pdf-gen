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
      <tr className="font-bold border-b border-black text-[11px] tracking-tight">
        <td className="border-t border-b border-l border-r-0 border-black px-[2px] py-1 break-words"></td>
        <td className="border-t border-b border-l-0 border-r-0 border-black text-center px-[2px] py-1 break-words">
          Subtotal
        </td>
        <td
          colSpan={preDiscColSpan - 2}
          className="border-t border-b border-l-0 border-r-0 border-black px-[2px] py-1 break-words"
        ></td>
        <td className="border border-black text-right px-[2px] py-1 break-words">
          {fmt(pageSubtotal.discAmt)}
        </td>
        <td className="border border-black text-right px-[2px] py-1 break-words">
          {fmt(pageSubtotal.taxable)}
        </td>
        {isInterState ? (
          <td className="border border-black text-right px-[2px] py-1 break-words">
            {fmt(pageSubtotal.igst)}
          </td>
        ) : (
          <>
            <td className="border border-black text-right px-[2px] py-1 break-words">
              {fmt(pageSubtotal.cgst)}
            </td>
            <td className="border border-black text-right px-[2px] py-1 break-words">
              {fmt(pageSubtotal.sgst)}
            </td>
          </>
        )}
        <td className="border border-black text-right px-[2px] py-1 break-words">
          {fmt(pageSubtotal.grand)}
        </td>
      </tr>

      <tr className="font-bold bg-gray-50 hidden text-[11px] tracking-tight">
        <td
          colSpan={preDiscColSpan}
          className="border border-black text-center px-[2px] py-1 break-words"
        >
          CUMULATIVE RUNNING TOTAL
        </td>
        <td className="border border-black text-right px-[2px] py-1 break-words">
          {fmt(runningTotal.discAmt)}
        </td>
        <td className="border border-black text-right px-[2px] py-1 break-words">
          {fmt(runningTotal.taxable)}
        </td>
        {isInterState ? (
          <td className="border border-black text-right px-[2px] py-1 break-words">
            {fmt(runningTotal.igst)}
          </td>
        ) : (
          <>
            <td className="border border-black text-right px-[2px] py-1 break-words">
              {fmt(runningTotal.cgst)}
            </td>
            <td className="border border-black text-right px-[2px] py-1 break-words">
              {fmt(runningTotal.sgst)}
            </td>
          </>
        )}
        <td className="border border-black text-right px-[2px] py-1 break-words">
          {fmt(runningTotal.grand)}
        </td>
      </tr>

      {isLastPage && roundOff !== 0 && (
        <tr className="font-bold text-[11px] tracking-tight">
          <td
            colSpan={fullColSpan - 1}
            className="border-t border-b border-l border-r-0 border-black text-right px-[2px] py-1 break-words pr-4"
          >
            ROUNDOFF (INR)
          </td>
          <td className="border border-black text-right px-[2px] py-1 break-words">
            {fmt(roundOff)}
          </td>
        </tr>
      )}

      {isLastPage && (
        <tr className="font-bold text-[11px] tracking-tight">
          <td
            colSpan={fullColSpan - 1}
            className="border-t border-b border-l border-r-0 border-black text-right px-[2px] py-1 break-words pr-4 uppercase"
          >
            GRAND TOTAL (INR)
          </td>
          <td className="border border-black text-right px-[2px] py-1 break-words">
            {fmt(roundedGrand)}
          </td>
        </tr>
      )}
    </tfoot>
  );
}