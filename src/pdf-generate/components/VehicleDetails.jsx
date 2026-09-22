import React from "react";
import { fmtDate } from "../utils/formatters";

export default function VehicleDetails({ invoice }) {
const sectionHeaderClass =
  "border border-black font-bold text-center px-[4px] py-[2px] text-black align-middle leading-tight bg-white";

const cellClass =
  "border border-black px-[4px] py-[2px] text-[13px] leading-tight align-top";

  return (
    <table className="w-full border-collapse mt-1 mb-0 text-[13px] font-sans">
      <tbody>
        <tr>
          <th colSpan={2} className={sectionHeaderClass}>
            VEHICLE DETAILS
          </th>
          <th colSpan={2} className={sectionHeaderClass}>
            JOB CARD DETAILS
          </th>
        </tr>

        <tr>
          <td className={`${cellClass} font-bold w-[20%]`}>
            VEHICLE MODEL
          </td>
          <td className={`${cellClass} w-[30%]`}>
            {invoice.vehicle?.vehicle_model}
          </td>
          <td className={`${cellClass} font-bold w-[20%]`}>
            CREATION DATE
          </td>
          <td className={`${cellClass} w-[30%]`}>
            {fmtDate(invoice.created_at)}
          </td>
        </tr>

        <tr>
          <td className={`${cellClass} font-bold`}>
            REGISTRATION
          </td>
          <td className={cellClass}>
            {invoice.vehicle?.registration_number}
          </td>
          <td className={`${cellClass} font-bold`}>
            REPAIR TYPE
          </td>
          <td className={cellClass}>
            {invoice.repair_type?.repair_type_name}
          </td>
        </tr>

        <tr>
          <td className={`${cellClass} font-bold`}>
            CHASSIS NO
          </td>
          <td className={cellClass}>
            {invoice.vehicle?.chassis_no}
          </td>
          <td className={`${cellClass} font-bold`}>
            KM/HM READING
          </td>
          <td className={cellClass}>
            {invoice.meter_reading}
          </td>
        </tr>

        <tr>
          <td className={`${cellClass} font-bold`}>
            AGGREGATE NO
          </td>
          <td className={cellClass}>
            {invoice.vehicle?.aggregate_no}
          </td>
          <td className={`${cellClass} font-bold`}>
            Cum. KM/HM READING
          </td>
          <td className={cellClass}>
            {invoice.meter_reading}
          </td>
        </tr>

        <tr>
          <td className={`${cellClass} font-bold`}>
            ENGINE NO
          </td>
          <td className={cellClass}>
            {invoice.vehicle?.engine_no}
          </td>

          <td colSpan={2} className="border-b border-r border-black py-0 px-[4px] align-top"></td>
        </tr>
      </tbody>
    </table>
  );
}