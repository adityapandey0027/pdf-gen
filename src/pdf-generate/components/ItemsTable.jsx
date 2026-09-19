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
        "border border-black bg-[#D9D9D9] text-black custom-header text-[12px] font-bold px-1 py-1 text-center align-top break-words tracking-tight";
    const cellClass =
        "border border-black px-[2px] py-1 text-[11px] leading-[1.15] align-top break-words tracking-tight";

    const totalCols = isSpareInvoice
        ? isInterState
            ? 11
            : 12
        : isInterState
            ? 9
            : 10;

    const spareIntraWidths = [
        "4.3%",   // S.NO
        "16.5%",  // CODE / DESCRIPTION
        "8%",     // HSN/SAC
        "3.5%",   // UOM
        "4.5%",   // QTY
        "8%",     // MRP
        "8.5%",   // PRICE
        "6%",     // DISC
        "8.5%",   // TAXABLE
        "7.5%",   // CGST
        "7.5%",   // SGST
        "17.2%",  // AMOUNT
    ];

    const spareInterWidths = [
        "4.5%",   // S.NO
        "17.5%",  // CODE / DESCRIPTION
        "8%",     // HSN/SAC
        "3.5%",   // UOM
        "4.5%",   // QTY
        "8%",     // MRP
        "8.5%",   // PRICE
        "6.5%",   // DISC
        "10.5%",  // TAXABLE
        "11%",    // IGST
        "17.5%",  // AMOUNT
    ];

    const labourIntraWidths = [
        "4.5%",   // S.NO
        "19.5%",  // CODE / DESCRIPTION
        "9%",     // HSN/SAC
        "5.5%",   // QTY
        "10.5%",  // LABOUR VALUE
        "7.5%",   // DISC
        "10%",    // TAXABLE
        "9%",     // CGST
        "9%",     // SGST
        "15.5%",  // AMOUNT
    ];

    const labourInterWidths = [
        "5%",     // S.NO
        "20.5%",  // CODE / DESCRIPTION
        "10%",    // HSN/SAC
        "6%",     // QTY
        "12%",    // LABOUR VALUE
        "8.5%",   // DISC
        "12%",    // TAXABLE
        "12%",    // IGST
        "14%",    // AMOUNT
    ];

    let columnWidths;

    if (isSpareInvoice) {
        columnWidths = isInterState ? spareInterWidths : spareIntraWidths;
    } else {
        columnWidths = isInterState ? labourInterWidths : labourIntraWidths;
    }

    return (
        <table className="invoice-items-table w-full border-collapse table-fixed mt-2 text-[12px] font-sans">
            <colgroup>
                {columnWidths.map((width, index) => (
                    <col key={index} style={{ width }} />
                ))}
            </colgroup>

            <thead>
                <tr className="custom-header-row">
                    <th className={headerClass}>S.NO</th>
                    <th className={`${headerClass} whitespace-nowrap`}>CODE / DESCRIPTION</th>
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
                    <td colSpan={totalCols} className="border border-black font-bold pt-1 pb-0 px-1 text-left align-bottom bg-white">
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