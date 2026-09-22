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
        "border border-black bg-[#E5E5E5] text-black custom-header text-[11px] font-bold px-[2px] py-[4px] text-center align-middle break-words tracking-tight leading-tight";
    const cellClass =
        "border border-black px-[2px] py-[4px] text-[11px] leading-[1.2] align-top break-words tracking-tight";

    const totalCols = isSpareInvoice
        ? isInterState
            ? 11
            : 12
        : isInterState
            ? 9
            : 10;

    const spareIntraWidths = [
        "4%",     // S.NO
        "19%",    // CODE / DESCRIPTION
        "7.5%",   // HSN/SAC
        "5%",     // UOM
        "4.5%",   // QTY
        "7.5%",   // MRP
        "7.5%",   // PRICE
        "5%",     // DISC
        "9%",     // TAXABLE
        "9%",     // CGST
        "9%",     // SGST
        "13%",    // AMOUNT
    ];

    const spareInterWidths = [
        "4%",     // S.NO
        "19%",    // CODE / DESCRIPTION
        "7.5%",   // HSN/SAC
        "5%",     // UOM
        "4.5%",   // QTY
        "7.5%",   // MRP
        "7.5%",   // PRICE
        "5.5%",   // DISC
        "11%",    // TAXABLE
        "14%",    // IGST
        "14.5%",  // AMOUNT
    ];

    const labourIntraWidths = [
        "4.5%",   // S.NO
        "28.5%",  // SAC / DESCRIPTION
        "5%",     // UOM
        "5%",     // QTY
        "10%",    // RATE
        "6%",     // DISC
        "11%",    // TAXABLE
        "9%",     // CGST
        "9%",     // SGST
        "12%",    // AMOUNT
    ];

    const labourInterWidths = [
        "4.5%",   // S.NO
        "28.5%",  // SAC / DESCRIPTION
        "5%",     // UOM
        "5%",     // QTY
        "10%",    // RATE
        "6.5%",   // DISC
        "12%",    // TAXABLE
        "14%",    // IGST
        "14.5%",  // AMOUNT
    ];

    let columnWidths;

    if (isSpareInvoice) {
        columnWidths = isInterState ? spareInterWidths : spareIntraWidths;
    } else {
        columnWidths = isInterState ? labourInterWidths : labourIntraWidths;
    }

    return (
        <table className="invoice-items-table w-full border-collapse table-fixed mt-2 text-[11px] font-sans">
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
                                    <span>{Number(r.igstPer).toFixed(2)} %</span>
                                    <span>{fmt(r.igstAmt)}</span>
                                </div>
                            </td>
                        ) : (
                            <>
                                <td className={`${cellClass} text-right align-top`}>
                                    <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                        <span>{Number(r.cgstPer).toFixed(2)} %</span>
                                        <span>{fmt(r.cg)}</span>
                                    </div>
                                </td>
                                <td className={`${cellClass} text-right align-top`}>
                                    <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                        <span>{Number(r.sgstPer).toFixed(2)} %</span>
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