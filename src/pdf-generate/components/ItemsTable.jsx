import React from "react";
import { fmt } from "../utils/formatters";
import PageSubtotals from "./PageSubtotals";

export default function ItemsTable({
    pageRows,
    isSpareInvoice,
    isInterState,
    pageSubtotal,
    runningTotal,
    isLastPage,
    roundOff,
    roundedGrand,
}) {
    const headerClass =
        "border border-black bg-[#D9D9D9] text-black custom-header text-[10px] font-bold p-1 text-center align-top";
    const cellClass =
        "border border-black p-1 text-[10px] leading-[1.15] align-top";

    const totalCols = isSpareInvoice
        ? isInterState
            ? 11
            : 12
        : isInterState
            ? 9
            : 10;

    const spareIntraWidths = [
        "4.3%",   // S.NO
        "16.8%",  // CODE / DESCRIPTION
        "8.5%",   // HSN/SAC
        "4.7%",   // UOM
        "5.6%",   // QTY
        "7.6%",   // MRP
        "9.3%",   // PRICE
        "7.5%",   // DISC
        "9.3%",   // TAXABLE
        "8.5%",   // CGST
        "8.3%",   // SGST
        "9.6%",   // AMOUNT
    ];

    const spareInterWidths = [
        "4.5%",   // S.NO
        "18.5%",  // CODE / DESCRIPTION
        "9%",      // HSN/SAC
        "5%",      // UOM
        "6%",      // QTY
        "8%",      // MRP
        "10%",     // PRICE
        "8%",      // DISC
        "10%",     // TAXABLE
        "10%",     // IGST
        "11%",     // AMOUNT
    ];

    const labourIntraWidths = [
        "4.5%",   // S.NO
        "20%",     // CODE / DESCRIPTION
        "9%",      // HSN/SAC
        "6%",      // QTY
        "10%",     // LABOUR VALUE
        "8%",      // DISC
        "10%",     // TAXABLE
        "9%",      // CGST
        "9%",      // SGST
        "14.5%",  // AMOUNT
    ];

    const labourInterWidths = [
        "5%",      // S.NO
        "21%",     // CODE / DESCRIPTION
        "10%",     // HSN/SAC
        "7%",      // QTY
        "11%",     // LABOUR VALUE
        "9%",      // DISC
        "11%",     // TAXABLE
        "12%",     // IGST
        "14%",     // AMOUNT
    ];

    let columnWidths;

    if (isSpareInvoice) {
        columnWidths = isInterState ? spareInterWidths : spareIntraWidths;
    } else {
        columnWidths = isInterState ? labourInterWidths : labourIntraWidths;
    }

    return (
        <table className="invoice-items-table w-full border-collapse table-fixed mt-2 text-[10px] font-sans">
            <colgroup>
                {columnWidths.map((width, index) => (
                    <col key={index} style={{ width }} />
                ))}
            </colgroup>

            <thead>
                <tr className="custom-header-row">
                    <th className={headerClass}>S.NO</th>
                    <th className={headerClass}>CODE / DESCRIPTION</th>
                    <th className={headerClass}>HSN/SAC<br />CODE</th>
                    {isSpareInvoice && <th className={headerClass}>UOM</th>}
                    <th className={headerClass}>QTY</th>
                    {isSpareInvoice && <th className={headerClass}>MRP<br />(INR)</th>}
                    <th className={headerClass}>
                        {isSpareInvoice ? <>PRICE<br />(INR)</> : <>LABOUR<br />VALUE (INR)</>}
                    </th>
                    <th className={headerClass}>DISC.<br />(INR)</th>
                    <th className={headerClass}>TAXABLE<br />AMT(INR)</th>
                    <th className={headerClass}>{isInterState ? "IGST" : "CGST"}</th>
                    {!isInterState && <th className={headerClass}>SGST</th>}
                    <th className={headerClass}>AMOUNT<br />(INR)</th>
                </tr>
            </thead>

            <tbody>
                <tr className="invoice-category-row">
                    <td colSpan={totalCols} className="border border-black font-bold p-1 text-left align-bottom bg-white">
                        {isSpareInvoice ? "SPARES BILL :" : "LABOUR BILL :"}
                    </td>
                </tr>

                {pageRows.map((r) => (
                    <tr key={r.sno} className="invoice-item-row">
                        <td className={`${cellClass} text-left`}>{r.sno}</td>
                        <td className={`${cellClass} invoice-description-cell text-left`}>
                            <div className="invoice-description">
                                <div>{r.code}</div>
                                <div>{r.description}</div>
                            </div>
                        </td>
                        <td className={`${cellClass} text-left`}>{r.hsn}</td>
                        {isSpareInvoice && <td className={`${cellClass} text-left`}>{r.uom}</td>}
                        <td className={`${cellClass} text-right`}>{fmt(r.qty, 3)}</td>
                        {isSpareInvoice && <td className={`${cellClass} text-right`}>{fmt(r.mrp)}</td>}
                        <td className={`${cellClass} text-right`}>{fmt(r.rate)}</td>
                        <td className={`${cellClass} text-right`}>{fmt(r.discAmt)}</td>
                        <td className={`${cellClass} text-right`}>{fmt(r.taxableAmt)}</td>

                        {isInterState ? (
                            <td className={`${cellClass} text-center align-top`}>
                                <div className="flex flex-col justify-start items-center whitespace-nowrap">
                                    <span>{r.igstPer}%</span>
                                    <span>{fmt(r.igstAmt)}</span>
                                </div>
                            </td>
                        ) : (
                            <>
                                <td className={`${cellClass} text-right align-top`}>
                                    <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                        <span>{r.cgstPer}%</span>
                                        <span>{fmt(r.cg)}</span>
                                    </div>
                                </td>
                                <td className={`${cellClass} text-right align-top`}>
                                    <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                        <span>{r.sgstPer}%</span>
                                        <span>{fmt(r.sg)}</span>
                                    </div>
                                </td>
                            </>
                        )}

                        <td className={`${cellClass} text-right`}>{fmt(r.lineTotal)}</td>
                    </tr>
                ))}
            </tbody>

            <PageSubtotals
                isSpareInvoice={isSpareInvoice}
                isInterState={isInterState}
                pageSubtotal={pageSubtotal}
                runningTotal={runningTotal}
                isLastPage={isLastPage}
                roundOff={roundOff}
                roundedGrand={roundedGrand}
            />
        </table>
    );
}