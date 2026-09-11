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
            <td colSpan={2} className="border-none text-center pt-2">
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
                  <InfoRow label="INVOICE NO" value={invoice.id} labelWidth="w-24" />
                  <InfoRow label="JOB CARD NO" value={invoice.jobcard_no} labelWidth="w-24" />
                  <InfoRow label="ORDER NO" value={invoice.order_no} labelWidth="w-24" />
                  <InfoRow label="SAP REF NO" value={invoice.sap_ref_no} labelWidth="w-24" />
                  <tr>
                    <td className="w-24 font-bold align-top py-0.5">CUSTOMER</td>
                    <td className="py-0.5 align-top">
                      : {invoice.customer?.customer_name}
                      <br />
                      &nbsp;&nbsp;{invoice.customer?.address}
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