import React from "react";
import TaxInvoice from "./pdf-generate/TaxInvoice";

export default function App() {
  const handlePrint = () => {
    window.print();
  };

  const params = new URLSearchParams(window.location.search);
  const invoiceId = params.get("id") || "1";

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 bg-white px-6 py-3 shadow-sm print:hidden">
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            Tax Invoice Preview
          </h1>

          <p className="text-xs text-gray-500">
            RK Transport Tax Invoice Generator
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Print / Save PDF
        </button>
      </div>

      <main className="py-6 print:p-0">
        <TaxInvoice
          apiUrl={`/invoices/pdf-json/${invoiceId}`}
        />
      </main>
    </div>
  );
}