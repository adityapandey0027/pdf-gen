import React from "react";
import { COMPANY, fmtDate } from "../utils/formatters";

function InfoRow({ label, value, labelWidth = "w-[140px]" }) {
  return (
    <tr>
      <td className={`${labelWidth} font-bold py-[1px] pr-1 align-top leading-tight`}>{label}</td>
      <td className="py-[1px] align-top leading-tight whitespace-nowrap">: {value || ""}</td>
    </tr>
  );
}

export default function Header({ invoice, pageNumber, totalPages, isSpareInvoice}) {
  return (
    <div className="flex flex-col text-[13px] font-sans">
      <div className="leading-tight">
        <div>{COMPANY.name}</div>
        <div>{COMPANY.addressLine1}</div>
        <div>{COMPANY.addressLine2}</div>
        <div>Mob No: {COMPANY.mobile}</div>
        <div className="flex"><div className="w-[110px] font-bold">GSTIN Number</div><div>: {COMPANY.gstin}</div></div>
        <div className="flex"><div className="w-[110px] font-bold">PAN NO</div><div>: {COMPANY.pan}</div></div>
        <div className="flex"><div className="w-[110px] font-bold">CIN NO</div><div>: {COMPANY.cin || ""}</div></div>
      </div>
      
      <div className="text-center mt-6 mb-8">
        <div className="text-lg font-bold tracking-wide">TAX INVOICE</div>
        <div>CREDIT BILL</div>
      </div>

      <div className="flex justify-between">
        <div className="w-[49%]">
          <table className="w-full border-none text-[13px]">
            <tbody>
              <InfoRow label="INVOICE NO" value={invoice.id} />
              <InfoRow label="JOB CARD NO" value={invoice.jobcard_no} />
              <InfoRow label="ORDER NO" value={invoice.order_no} />
              <InfoRow label="SAP REF NO" value={invoice.sap_ref_no} />
              <tr>
                <td className="w-[140px] font-bold align-top py-[1px] leading-tight">CUSTOMER</td>
                    <td className="py-[1px] align-top leading-tight">
                      <div className="flex">
                        <span className="mr-1">:</span>
                        <div className="break-words">
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

                            const nameLines = formatText(invoice.customer?.customer_name, 35);
                            const addressLines = formatText(invoice.customer?.address, 35);

                            return (
                              <>
                                {nameLines.map((line, i) => (
                                  <div key={`name-${i}`}>{line}</div>
                                ))}
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
              <table className="w-full border-none text-[13px]">
                <tbody>
                  <InfoRow label="INVOICE DATE" value={fmtDate(invoice.invoice_date)} />
                  <InfoRow label="JOB CARD DATE" value={fmtDate(invoice.jobcard_date)} />
                  <InfoRow label="PLACE OF SERVICE" value={invoice.place_of_supply} />
                  <InfoRow label="PLACE OF SUPPLY" value={invoice.place_of_supply} />
                  <InfoRow label="CUSTOMER PAN" value={invoice.customer?.customer_pan} />
                  <InfoRow label="GSTIN / UIN" value={invoice.customer?.gstin} />
                  {isSpareInvoice && (<InfoRow label="VEHICLE OWNER" value={invoice.vehicle?.vehicle_owner} /> )}
                </tbody>
              </table>
            </div>
      </div>
    </div>
  );
}