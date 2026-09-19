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

    const estimateLines = (r) => {
      let descLines = 0;
      if (r.description) {
        const desc = String(r.description);
        const parts = desc.split('\n');
        for (const part of parts) {
          // At 11px font in a ~16% width column, ~20 characters fit per line
          descLines += Math.max(1, Math.ceil(part.length / 20));
        }
      } else {
        descLines = 1;
      }
      // 1 line for the code + the description lines
      const totalItemLines = 1 + descLines;
      
      // The CGST/SGST/IGST columns render as 2 lines (e.g., '9%' \n '216.00')
      return Math.max(2, totalItemLines);
    };

    let runningTaxable = 0, runningCgst = 0, runningSgst = 0, runningIgst = 0, runningGrand = 0;
    let currentIdx = 0;
    let pageNum = 1;

    while (currentIdx < rows.length || (rows.length === 0 && pageNum === 1)) {
      const remainingRows = rows.length - currentIdx;
      let currentCapacity = 0;

      if (pageNum === 1) {
        const prefLines = 20;
        const maxLines = 23;
        let linesCount = 0;
        for (let i = currentIdx; i < rows.length; i++) {
          const itemLines = estimateLines(rows[i]);
          if (linesCount + itemLines > maxLines && currentCapacity > 0) {
            break;
          }
          linesCount += itemLines;
          currentCapacity++;
          if (linesCount >= prefLines) {
            break;
          }
        }
      } else {
        const prefLines = 26;
        const maxLines = 28;
        const lastPageMaxLines = 16; 
        
        let remainingLines = 0;
        for (let i = currentIdx; i < rows.length; i++) {
          remainingLines += estimateLines(rows[i]);
        }
        
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
            if (linesCount >= prefLines) {
              break;
            }
          }
          
          if (currentCapacity === remainingRows) {
             currentCapacity = Math.max(1, remainingRows - 1);
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
  const overallTaxPct = Number(invoice.items?.[0]?.cgst_per || 0) + Number(invoice.items?.[0]?.sgst_per || 0) + Number(invoice.items?.[0]?.igst_per || 0);

  return (
    <div className="bg-gray-100 py-8 print:bg-white print:py-0">
      <div ref={measureRef} className="absolute top-[-9999px] left-[-9999px] w-[900px] pointer-events-none opacity-0">
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
            className="print-page-container relative mx-auto max-w-[900px] bg-white p-8 text-[13px] leading-[1.25] text-black shadow print:shadow-none print:p-0 font-sans mb-8 print:mb-0 print:break-after-page flex flex-col justify-between min-h-[1050px] print:min-h-0 pb-10"
          >
            <div className="pb-8">
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