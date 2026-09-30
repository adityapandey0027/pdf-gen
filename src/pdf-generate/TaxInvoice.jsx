import React, { useEffect, useState, useMemo, useRef } from "react";
import { fetchInvoiceData } from "./api/invoiceApi";
import Header from "./components/Header";
import VehicleDetails from "./components/VehicleDetails";
import ItemsTable from "./components/ItemsTable";
import TaxSummary from "./components/TaxSummary";
import Footer from "./components/Footer";
import PageMetaFooter from "./components/PageMetaFooter";
import { buildComputedItems } from "./utils/formatters";

const PRINT_PAGE_HEIGHT_PX = 920;
let measureCanvas = null;

export default function TaxInvoice({ apiUrl = "/mockInvoice.json" }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const measureRef = useRef(null);
  const [pageCapacities, setPageCapacities] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchInvoiceData(apiUrl);
        if (!cancelled) setInvoice(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load invoice");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const computedData = useMemo(() => {
    if (!invoice) return null;
    return buildComputedItems(invoice);
  }, [invoice]);

  useEffect(() => {
    if (!measureRef.current || !computedData) return;

    const measureEl = measureRef.current;
    const headerHeight = measureEl.querySelector(".measure-header")?.offsetHeight || 180;
    const vehicleHeight = measureEl.querySelector(".measure-vehicle")?.offsetHeight || 140;
    const tableHeaderHeight = measureEl.querySelector(".measure-table-head")?.offsetHeight || 35;
    const subtotalHeight = measureEl.querySelector(".measure-subtotal")?.offsetHeight || 35;
    const singleRowHeight = measureEl.querySelector(".measure-row")?.offsetHeight || 32;
    const taxSummaryHeight = measureEl.querySelector(".measure-tax-summary")?.offsetHeight || 100;
    const footerHeight = measureEl.querySelector(".measure-footer")?.offsetHeight || 120;
    const metaFooterHeight = measureEl.querySelector(".measure-meta")?.offsetHeight || 30;

    const page1AvailableHeight =
      PRINT_PAGE_HEIGHT_PX - headerHeight - vehicleHeight - tableHeaderHeight - subtotalHeight - metaFooterHeight;
    const middleAvailableHeight =
      PRINT_PAGE_HEIGHT_PX - headerHeight - tableHeaderHeight - subtotalHeight - metaFooterHeight;
    const lastPageAvailableHeight =
      PRINT_PAGE_HEIGHT_PX - headerHeight - tableHeaderHeight - subtotalHeight - taxSummaryHeight - footerHeight - metaFooterHeight;

    const page1Max = 7; // Front page limit as requested
    const middleMax = Math.max(1, Math.floor(middleAvailableHeight / singleRowHeight));
    const lastPageMax = Math.max(1, Math.floor(lastPageAvailableHeight / singleRowHeight));

    setPageCapacities({ page1Max, middleMax, lastPageMax });
  }, [computedData]);

  const pagesData = useMemo(() => {
    if (!computedData) return [];
    const { rows } = computedData;
    const pages = [];

    const isSpare = computedData?.isSpare ?? true;
    // In 8pt font:
    // Spare bill description column is 21.1% (~146px / ~24 chars).
    // Labour bill description column is 26.0% (~188px / ~31 chars).
    const charLimit = isSpare ? 24 : 31;
    const maxPixelWidth = isSpare ? 146 : 188;

    const estimateLines = (r) => {
      let ctx = null;
      if (typeof document !== "undefined") {
        if (!measureCanvas) {
          measureCanvas = document.createElement("canvas");
        }
        ctx = measureCanvas.getContext("2d");
        if (ctx) {
          ctx.font = '8pt Arial, "Helvetica Neue", Helvetica, sans-serif';
        }
      }

      const countWrapped = (text) => {
        if (!text) return 0;
        const paragraphs = String(text).split("\n");
        let lines = 0;
        for (const p of paragraphs) {
          const trimmed = p.trim();
          if (!trimmed) {
            lines += 1;
            continue;
          }
          const rawWords = trimmed.split(/\s+/);
          const words = [];
          for (const rw of rawWords) {
            const isTooLong = ctx ? ctx.measureText(rw).width > maxPixelWidth : rw.length > charLimit;
            if (isTooLong) {
              const chunk = charLimit;
              for (let k = 0; k < rw.length; k += chunk) {
                words.push(rw.substring(k, k + chunk));
              }
            } else {
              words.push(rw);
            }
          }

          let curLine = "";
          for (const w of words) {
            const test = curLine ? `${curLine} ${w}` : w;
            const fits = ctx
              ? ctx.measureText(test).width <= maxPixelWidth
              : test.length <= charLimit;
            if (fits) {
              curLine = test;
            } else {
              if (curLine) lines += 1;
              curLine = w;
            }
          }
          if (curLine) lines += 1;
        }
        return Math.max(1, lines);
      };

      const codeLines = countWrapped(r.code);
      const descLines = countWrapped(r.description);
      const totalItemLines = codeLines + descLines;

      // The CGST and SGST columns render 2 lines ('9.00 %' \n amount), so each row takes at least 2 lines
      return Math.max(2, totalItemLines);
    };

    // If the entire invoice is short (<= 17 lines total, e.g. 1-5 items),
    // it fits completely on 1 page along with Vehicle Details, Tax Summary, and Signatures!
    const SINGLE_PAGE_MAX_LINES = 17;
    const totalLinesAllRows = rows.reduce((acc, r) => acc + estimateLines(r), 0);

    let runningTaxable = 0, runningCgst = 0, runningSgst = 0, runningIgst = 0, runningGrand = 0;
    let currentIdx = 0;
    let pageNum = 1;

    while (currentIdx < rows.length || (rows.length === 0 && pageNum === 1)) {
      const remainingRows = rows.length - currentIdx;
      let currentCapacity = 0;

      if (pageNum === 1) {
        if (totalLinesAllRows <= SINGLE_PAGE_MAX_LINES) {
          currentCapacity = remainingRows;
        } else {
          // Multi-page invoice:
          // Front page constraint: strictly up to 20 text lines in the table.
          // Less than 20 (like 17, 18, 19) happens only when the next item cannot fully fit under 20 lines.
          const maxLines = 20;
          let linesCount = 0;
          for (let i = currentIdx; i < rows.length; i++) {
            const itemLines = estimateLines(rows[i]);
            if (linesCount + itemLines > maxLines && currentCapacity > 0) {
              break;
            }
            linesCount += itemLines;
            currentCapacity++;
          }
          // Ensure at least 1 item is pushed to page 2 so the final page carries items + Tax Summary + Signatures
          if (currentCapacity === remainingRows && remainingRows > 1) {
            currentCapacity = remainingRows - 1;
          }
        }
      } else {
        // Rest of the pages constraint: strictly at most 30 text lines.
        const maxLines = 30;
        const lastPageMaxLines = 18; 
        
        let remainingLines = 0;
        for (let i = currentIdx; i < rows.length; i++) {
          remainingLines += estimateLines(rows[i]);
        }
        
        // If all remaining rows can fit on this last page along with Tax Summary & Footer
        if (remainingLines <= lastPageMaxLines) {
          currentCapacity = remainingRows;
        } else {
          let linesCount = 0;
          for (let i = currentIdx; i < rows.length; i++) {
            const itemLines = estimateLines(rows[i]);
            if (linesCount + itemLines > maxLines && currentCapacity > 0) {
              break; 
            }
            linesCount += itemLines;
            currentCapacity++;
          }
          
          if (currentCapacity === remainingRows && remainingLines > lastPageMaxLines && remainingRows > 1) {
            currentCapacity = remainingRows - 1;
          }
        }
      }
      
      if (currentCapacity === 0) currentCapacity = 1;

      const pageRows = rows.slice(currentIdx, currentIdx + currentCapacity);
      currentIdx += pageRows.length;

      let pageTaxable = 0, pageCgst = 0, pageSgst = 0, pageIgst = 0, pageGrand = 0;

      pageRows.forEach((r) => {
        pageTaxable += r.taxableAmt;
        pageCgst += r.cg;
        pageSgst += r.sg;
        pageIgst += r.igstAmt;
        pageGrand += r.lineTotal;
      });

      runningTaxable += pageTaxable;
      runningCgst += pageCgst;
      runningSgst += pageSgst;
      runningIgst += pageIgst;
      runningGrand += pageGrand;

      pages.push({
        pageNumber: pageNum,
        pageRows,
        pageSubtotal: { taxable: pageTaxable, cgst: pageCgst, sgst: pageSgst, igst: pageIgst, grand: pageGrand },
        runningTotal: { taxable: runningTaxable, cgst: runningCgst, sgst: runningSgst, igst: runningIgst, grand: runningGrand },
      });

      pageNum++;
    }

    const totalPages = pages.length;
    return pages.map((p) => ({ ...p, totalPages }));
  }, [computedData, pageCapacities]);

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-sm text-gray-500">Loading invoice…</div>;
  if (error) return <div className="flex items-center justify-center min-h-[400px] text-sm text-red-600">Could not load invoice: {error}</div>;
  if (!invoice || !computedData) return null;

  const { isInterState, taxable, cgst, sgst, igst, roundedGrand, roundOff } = computedData;
  const isSpareInvoice = invoice.invoice_type === "SPARE";
  const overallTaxPct = isInterState ? Number(invoice.items?.[0]?.igst_per || 0) : Number(invoice.items?.[0]?.cgst_per || 0);

  return (
    <div className="bg-gray-100 py-8 print:bg-white print:py-0 print:m-0 print:h-auto">
      <div ref={measureRef} className="absolute top-[-9999px] left-[-9999px] w-[900px] pointer-events-none opacity-0 print:hidden">
        <div className="measure-header"><Header invoice={invoice} pageNumber={1} totalPages={1} /></div>
        <div className="measure-vehicle"><VehicleDetails invoice={invoice} /></div>
        <table className="w-full">
          <thead className="measure-table-head">
            <tr><th>Header</th></tr>
          </thead>
          <tbody>
            <tr className="measure-row"><td>Row Height Test</td></tr>
          </tbody>
          <tfoot className="measure-subtotal">
            <tr><td>Subtotal Test</td></tr>
          </tfoot>
        </table>
        <div className="measure-tax-summary">
          <TaxSummary overallTaxPct={overallTaxPct} taxable={taxable} cgst={cgst} sgst={sgst} igst={igst} isInterState={isInterState} roundedGrand={roundedGrand} reverseCharge={invoice.reverse_charge_applicable} />
        </div>
        <div className="measure-footer"><Footer isLastPage={true} /></div>
        <div className="measure-meta"><PageMetaFooter pageNumber={1} totalPages={1} /></div>
      </div>

      {/* Rendered Invoice Pages */}
      {pagesData.map((page) => {
        const isFirstPage = page.pageNumber === 1;
        const isLastPage = page.pageNumber === page.totalPages;

        return (
          <div
            key={page.pageNumber}
            className="print-page-container relative mx-auto max-w-[900px] w-full bg-white p-8 text-[9pt] leading-normal text-black shadow print:shadow-none print:p-0 font-sans mb-8 print:mb-0 print:break-after-page flex flex-col justify-between min-h-[1050px] print:min-h-[250mm] print:h-[250mm] print:max-h-[250mm] print:break-inside-avoid print:bg-white pb-8 print:pb-0 overflow-x-hidden"
          >
            <div className="flex-1 flex flex-col print:pb-0">
              <Header invoice={invoice} pageNumber={page.pageNumber} totalPages={page.totalPages} isSpareInvoice={isSpareInvoice} />
              {isFirstPage && <VehicleDetails invoice={invoice} />}
              <ItemsTable
                pageRows={page.pageRows}
                isSpareInvoice={isSpareInvoice}
                isInterState={isInterState}
                pageSubtotal={page.pageSubtotal}
                runningTotal={page.runningTotal}
                isLastPage={isLastPage}
                roundOff={roundOff}
                roundedGrand={roundedGrand}
              />
              {isLastPage && (
                <TaxSummary
                  overallTaxPct={overallTaxPct}
                  taxable={taxable}
                  cgst={cgst}
                  sgst={sgst}
                  igst={igst}
                  isInterState={isInterState}
                  roundedGrand={roundedGrand}
                  reverseCharge={invoice.reverse_charge_applicable}
                />
              )}
              <Footer isLastPage={isLastPage} />
            </div>

            <PageMetaFooter pageNumber={page.pageNumber} totalPages={page.totalPages} />
          </div>
        );
      })}
    </div>
  );
}