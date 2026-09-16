import React from "react";
import { COMPANY } from "../utils/formatters";

export default function Footer({ isLastPage }) {
  if (!isLastPage) return null;

  return (
    <div className="mt-4 text-[10px] leading-[1.7] font-sans">
      {/* Terms & Conditions */}
      <div>
        <div className="font-bold text-[13px] uppercase">
          TERMS AND CONDITIONS :
        </div>

        <div className="">
          1) Articles once sold will not be taken back.
          &nbsp;&nbsp; 2) Interest @18% will be charged if payment not made within
          15 days from the date of bill.
        </div>

        <div>
          3) Subject to Katghora Jurisdiction.&nbsp; &nbsp; Thank You. Visit Again.
          <br />
          The above job carried out to my entire satisfaction.
        </div>
      </div>

      {/* Signature section */}
      <div className="mt-7 flex text-[12px] justify-center gap-45 text-center">
        {/* Customer */}
        <div className="flex flex-col justify-end">
          <div className="font-bold">
            __________________________________
          </div>
          <div className="font-bold mt-[1px]">
            Customer Signatory &amp; Date
          </div>
        </div>

        {/* Company */}
        <div className="flex flex-col justify-end">
          <div className="font-bold">
            For : {COMPANY.name}
          </div>
          <div className="mt-8 font-bold">
            __________________________________
          </div>
          <div className="font-bold mt-[1px] italic">
            Authorized Signatory &amp; Date
          </div>
        </div>
      </div>
    </div>
  );
}