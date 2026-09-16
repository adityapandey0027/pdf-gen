import React from "react";
import { COMPANY, fmtDate } from "../utils/formatters";

function InfoRow({ label, value, labelWidth = "w-32" }) {
  return (
    <tr>
      <td className={`${labelWidth} font-bold py-0.5 pr-1 align-top`}>{label}</td>
      <td className="py-0.5 align-top">: {value}</td>
    </tr>
  );
}

export default function Header({ invoice, pageNumber, totalPages }) {
  return (
    <div className="flex flex-col gap-1">
      <table className="w-full border-none">
        <tbody>
          <tr>
            <td className="border-none p-0 align-bottom">
              <table className="border-none">
                <tbody>
                  <tr><td colSpan={2} className="border-none p-0.5">{COMPANY.name}</td></tr>
                  <tr><td colSpan={2} className="border-none p-0.5">{COMPANY.addressLine1}</td></tr>
                  <tr><td colSpan={2} className="border-none p-0.5">{COMPANY.addressLine2}</td></tr>
                  <tr><td colSpan={2} className="border-none p-0.5">Mob No: {COMPANY.mobile}</td></tr>
                  <InfoRow label="GSTIN Number" value={COMPANY.gstin} labelWidth="w-28" />
                  <InfoRow label="PAN NO" value={COMPANY.pan} labelWidth="w-28" />
                  <InfoRow label="CIN NO" value={COMPANY.cin || ""} labelWidth="w-28" />
                </tbody>
              </table>
            </td>
           
          </tr>
          <tr>
            <td colSpan={2} className="border-none text-center pt-0">
              <div className="text-lg font-bold">TAX INVOICE</div>
              <div className="text-[10px]">CREDIT BILL</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-none mt-2">
        <tbody>
          <tr>
            <td className="w-[52%] align-top border-none p-0">
              <table className="border-none">
                <tbody>
                  <InfoRow label="INVOICE NO" value={invoice.id} labelWidth="w-32" />
                  <InfoRow label="JOB CARD NO" value={invoice.jobcard_no} labelWidth="w-32" />
                  <InfoRow label="ORDER NO" value={invoice.order_no} labelWidth="w-32" />
                  <InfoRow label="SAP REF NO" value={invoice.sap_ref_no} labelWidth="w-32" />
                  <tr>
                    <td className="w-32 font-bold align-top py-0.5">CUSTOMER</td>
                    <td className="py-0.5 align-top">
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

                            const nameLines = formatText(invoice.customer?.customer_name, 30);
                            const addressLines = formatText(invoice.customer?.address, 30);

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
            </td>
            <td className="w-[48%] align-top border-none p-0">
              <table className="border-none">
                <tbody>
                  <InfoRow label="INVOICE DATE" value={fmtDate(invoice.invoice_date)} labelWidth="w-32" />
                  <InfoRow label="JOB CARD DATE" value={fmtDate(invoice.jobcard_date)} labelWidth="w-32" />
                  <InfoRow label="PLACE OF SERVICE" value={invoice.place_of_supply} labelWidth="w-32" />
                  <InfoRow label="PLACE OF SUPPLY" value={invoice.place_of_supply} labelWidth="w-32" />
                  <InfoRow label="CUSTOMER PAN" value={invoice.customer?.customer_pan} labelWidth="w-32" />
                  <InfoRow label="GSTIN / UIN" value={invoice.customer?.gstin} labelWidth="w-32" />
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}