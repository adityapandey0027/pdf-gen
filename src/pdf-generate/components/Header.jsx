import React from "react";
import { COMPANY, fmtDate } from "../utils/formatters";

function InfoRow({ label, value, labelWidth = "w-[135px]" }) {
  return (
    <tr>
      <td className={`${labelWidth} font-bold py-[1px] pr-1 align-top leading-tight text-[9pt]`}>{label}</td>
      <td className="py-[1px] align-top leading-tight text-[9pt]">
        <div className="flex">
          <span className="font-bold mr-1">:</span>
          <span className="font-normal whitespace-nowrap">{value || ""}</span>
        </div>
      </td>
    </tr>
  );
}

export default function Header({ invoice, pageNumber, totalPages, isSpareInvoice }) {
  return (
    <div className="flex flex-col text-[9pt] font-sans">
      <div className="leading-tight text-[9pt]">
        <div className="font-normal">{COMPANY.name}</div>
        <div className="font-normal">{COMPANY.addressLine1}</div>
        <div className="font-normal">{COMPANY.addressLine2}</div>
        <div className="font-normal">Mob No: {COMPANY.mobile}</div>
        <div className="flex">
          <span className="font-bold w-[110px]">GSTIN Number</span>
          <span className="font-bold mr-1">:</span>
          <span className="font-normal">{COMPANY.gstin}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-[110px]">PAN NO</span>
          <span className="font-bold mr-1">:</span>
          <span className="font-normal">{COMPANY.pan}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-[110px]">CIN NO</span>
          <span className="font-bold mr-1">:</span>
          <span className="font-normal">{COMPANY.cin || ""}</span>
        </div>
      </div>
      
      <div className="text-center my-1">
        <div className="text-[14pt] font-bold tracking-normal leading-tight">TAX INVOICE</div>
        <div className="text-[9pt] font-normal leading-tight mt-0.5">CREDIT BILL</div>
      </div>

      <div className="flex justify-between text-[9pt]">
        <div className="w-[49%]">
          <table className="w-full border-none text-[9pt]">
            <tbody>
              <InfoRow label="INVOICE NO" value={invoice.invoice_no} />
              <InfoRow label="JOB CARD NO" value={invoice.jobcard_no} />
              <InfoRow label="ORDER NO" value={invoice.order_no} />
              <InfoRow label="SAP REF NO" value={invoice.sap_ref_no} />
              <tr>
                <td className="w-[135px] font-bold align-top py-[1px] leading-tight text-[9pt]">CUSTOMER</td>
                <td className="py-[1px] align-top leading-tight text-[9pt]">
                  <div className="flex">
                    <span className="font-bold mr-1">:</span>
                    <div className="break-words font-normal">
                      {(() => {
                        const formatText = (text, maxLength) => {
                          if (!text) return [];
                          const words = text.split(" ");
                          const lines = [];
                          let currentLine = "";
                          words.forEach((word) => {
                            if ((currentLine + word).length > maxLength) {
                              if (currentLine) lines.push(currentLine.trim());
                              currentLine = word + " ";
                            } else {
                              currentLine += word + " ";
                            }
                          });
                          if (currentLine) lines.push(currentLine.trim());
                          return lines;
                        };

                        const nameLines = formatText(invoice.customer?.customer_name, 28);
                        const addressLines = formatText(invoice.customer?.address, 28);

                        return (
                          <>
                            {nameLines.map((line, i) => {
                              const isLastLine = i === nameLines.length - 1;
                              return (
                                <div key={`name-${i}`}>
                                  <span>{line}</span>
                                  {isLastLine && invoice.customer?.customer_code && (
                                    <span className="font-bold ml-4">
                                      [{invoice.customer.customer_code}]
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {addressLines.map((line, i) => (
                              <div key={`addr-${i}`}>{line}</div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-[49%]">
          <table className="w-full border-none text-[9pt]">
            <tbody>
              <InfoRow label="INVOICE DATE" value={fmtDate(invoice.invoice_date)} />
              <InfoRow label="JOB CARD DATE" value={fmtDate(invoice.jobcard_date)} />
              <InfoRow label="PLACE OF SERVICE" value={invoice.place_of_supply} />
              <InfoRow label="PLACE OF SUPPLY" value={invoice.place_of_supply} />
              <InfoRow label="CUSTOMER PAN" value={invoice.customer?.customer_pan} />
              <InfoRow label="GSTIN / UIN" value={invoice.customer?.gstin} />
              {isSpareInvoice && (<InfoRow label="VEHICLE OWNER" value={invoice.vehicle?.vehicle_owner} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}