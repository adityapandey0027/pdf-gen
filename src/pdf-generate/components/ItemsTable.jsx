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
        "border border-black bg-[#D9D9D9] text-black custom-header text-[9pt] font-bold px-[2px] py-[2px] text-center align-middle break-words leading-tight";
    const cellClass =
        "border border-black px-[2px] py-[2px] text-[8pt] font-normal leading-[1.3] align-top break-words";

    const totalCols = isSpareInvoice
        ? isInterState
            ? 11
            : 12
        : isInterState
            ? 9
            : 10;

    const spareIntraWidths = [
        "3.7%",   // S.NO (19.85pt)
        "21.1%",  // CODE / DESCRIPTION (113.40pt)
        "8.9%",   // HSN/SAC CODE (48.20pt)
        "4.2%",   // UOM (22.70pt)
        "5.3%",   // QTY (28.35pt)
        "7.4%",   // MRP (39.70pt)
        "7.4%",   // PRICE (39.70pt)
        "6.8%",   // DISC. (36.85pt)
        "9.5%",   // TAXABLE AMT(INR) (51.00pt)
        "7.9%",   // CGST (42.50pt)
        "7.9%",   // SGST (42.50pt)
        "9.9%",   // AMOUNT (INR) (53.85pt)
    ];

    const spareInterWidths = [
        "3.7%",   // S.NO
        "21.1%",  // CODE / DESCRIPTION
        "8.9%",   // HSN/SAC
        "4.2%",   // UOM
        "5.3%",   // QTY
        "7.4%",   // MRP
        "7.4%",   // PRICE
        "6.8%",   // DISC
        "11.0%",  // TAXABLE
        "14.0%",  // IGST
        "10.2%",  // AMOUNT
    ];

    const labourIntraWidths = [
        "4.5%",   // S.NO
        "26%",    // SAC / DESCRIPTION
        "6.5%",   // UOM
        "5%",     // QTY
        "10%",    // RATE
        "6%",     // DISC
        "11%",    // TAXABLE
        "9%",     // CGST
        "9%",     // SGST
        "13%",    // AMOUNT
    ];

    const labourInterWidths = [
        "4.5%",   // S.NO
        "27.5%",  // SAC / DESCRIPTION
        "5%",     // UOM
        "5%",     // QTY
        "10%",    // RATE
        "6.5%",   // DISC
        "12%",    // TAXABLE
        "14%",    // IGST
        "15.5%",  // AMOUNT
    ];

    let columnWidths;

    if (isSpareInvoice) {
        columnWidths = isInterState ? spareInterWidths : spareIntraWidths;
    } else {
        columnWidths = isInterState ? labourInterWidths : labourIntraWidths;
    }

    return (
        <table className="invoice-items-table w-full border-collapse table-fixed mt-2 text-[9pt] font-sans">
            <colgroup>
                {columnWidths.map((width, index) => (
                    <col key={index} style={{ width }} />
                ))}
            </colgroup>

            <thead>
                <tr className="custom-header-row">
                    <th className={headerClass}>S.N<br />O</th>
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
                    <td colSpan={totalCols} className="border border-black font-bold text-[9pt] py-[2px] px-1 text-left align-middle bg-white">
                        {isSpareInvoice ? "SPARES BILL :" : "LABOUR BILL :"}
                    </td>
                </tr>

                {pageRows.map((r) => (
                    <tr key={r.sno} className="invoice-item-row">
                        <td className={`${cellClass} text-left`}>{r.sno}</td>
                        <td className={`${cellClass} invoice-description-cell text-left`}>
                            <div className="invoice-description">
                                <div className="whitespace-nowrap overflow-hidden text-ellipsis">{r.code}</div>
                                <div className="break-words whitespace-pre-line leading-[1.3]">{r.description}</div>
                            </div>
                        </td>
                        <td className={`${cellClass} text-left text-[9pt] whitespace-nowrap`}>{r.hsn}</td>
                        {isSpareInvoice && <td className={`${cellClass} text-left whitespace-nowrap`}>{r.uom}</td>}
                        <td className={`${cellClass} text-right whitespace-nowrap`}>{fmt(r.qty, 3)}</td>
                        {isSpareInvoice && <td className={`${cellClass} text-right whitespace-nowrap`}>{fmt(r.mrp)}</td>}
                        <td className={`${cellClass} text-right whitespace-nowrap`}>{fmt(r.rate)}</td>
                        <td className={`${cellClass} text-right whitespace-nowrap`}>{fmt(r.discAmt)}</td>
                        <td className={`${cellClass} text-right whitespace-nowrap`}>{fmt(r.taxableAmt)}</td>

                        {isInterState ? (
                            <td className={`${cellClass} text-right align-top text-[9pt]`}>
                                <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                    <span>{Number(r.igstPer).toFixed(2)} %</span>
                                    <span>{fmt(r.igstAmt)}</span>
                                </div>
                            </td>
                        ) : (
                            <>
                                <td className={`${cellClass} text-right align-top text-[9pt]`}>
                                    <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                        <span>{Number(r.cgstPer).toFixed(2)} %</span>
                                        <span>{fmt(r.cg)}</span>
                                    </div>
                                </td>
                                <td className={`${cellClass} text-right align-top text-[9pt]`}>
                                    <div className="flex flex-col justify-start items-end whitespace-nowrap">
                                        <span>{Number(r.sgstPer).toFixed(2)} %</span>
                                        <span>{fmt(r.sg)}</span>
                                    </div>
                                </td>
                            </>
                        )}

                        <td className={`${cellClass} text-right whitespace-nowrap`}>{fmt(r.lineTotal)}</td>
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