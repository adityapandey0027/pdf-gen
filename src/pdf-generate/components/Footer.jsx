import React from "react";
import { COMPANY } from "../utils/formatters";

export default function Footer({ isLastPage }) {
  if (!isLastPage) return null;

  return (
    <div className="mt-3 text-[9pt] font-sans">
      {/* Terms & Conditions */}
      <div>
        <div className="font-bold text-[9pt] uppercase">
          TERMS AND CONDITIONS :
        </div>

        <div className="text-[7pt] leading-[1.3] font-normal mt-0.5">
          1) Articles once sold will not be taken back. &nbsp; 2) Interest @18% will be charged if payment not made within 15 days from the date of bill.
          <br />
          3) Subject to Katghora Jurisdiction. &nbsp; &nbsp; Thank You. Visit Again.
          <br />
          The above job carried out to my entire satisfaction.
        </div>
      </div>

      {/* Signature section */}
      <div className="mt-6 flex text-[9pt] justify-center gap-44 text-center">
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
          <div className="mt-7 font-bold">
            __________________________________
          </div>
          <div className="font-bold italic mt-[1px]">
            Authorized Signatory &amp; Date
          </div>
        </div>
      </div>
    </div>
  );
}