import React from "react";
import { COMPANY } from "../utils/formatters";

export default function Footer({ isLastPage }) {
  if (!isLastPage) return null;

  return (
    <div className="mt-4 pt-2 border-t border-black">
      <div className="text-[10px]">
        <b>TERMS &amp; CONDITIONS:</b> 1) Goods once sold will not be taken back. 2) Interest @18% p.a. charged if unpaid within 15 days. 3) Subject to Katghora Jurisdiction.
      </div>

      <table className="w-full border-none mt-6">
        <tbody>
          <tr>
            <td className="w-1/2 font-bold align-bottom border-none">
              _________________________________<br />
              Customer Signatory &amp; Date
            </td>
            <td className="w-1/2 text-right font-bold align-bottom border-none">
              For : {COMPANY.name}<br /><br /><br />
              _________________________________<br />
              Authorized Signatory &amp; Date
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}