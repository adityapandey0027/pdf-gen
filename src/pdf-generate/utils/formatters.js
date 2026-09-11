export const COMPANY = {
  name: "RK Transport",
  addressLine1: "Chhuri, Korba Chhattisgarh",
  addressLine2: "Katghora-495450, Chhattisgarh, INDIA,",
  mobile: "6267132458",
  gstin: "22DLCPA4641B2ZZ",
  pan: "DLCPA4641B",
  cin: "",
};

// Dynamic capacity limits per page layout
// export const PAGE_1_MAX_ITEMS = 6;          // Space reduced by Header + Vehicle Details
// export const PAGE_MIDDLE_MAX_ITEMS = 9;     // Space reduced by Header only
// export const PAGE_LAST_MAX_ITEMS = 6;       // Space reduced by Header + Tax Summary + Terms/Signature

const ONES = [
  "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
  "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
  "SEVENTEEN", "EIGHTEEN", "NINETEEN",
];
const TENS = [
  "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY",
];

function twoDigitsToWords(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? " " + ONES[o] : "");
}

function threeDigitsToWords(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let out = "";
  if (h) out += ONES[h] + " HUNDRED" + (rest ? " " : "");
  if (rest) out += twoDigitsToWords(rest);
  return out;
}

export function amountToWordsINR(amount) {
  let n = Math.round(amount);
  if (n === 0) return "ZERO";

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = n;

  const parts = [];
  if (crore) parts.push(threeDigitsToWords(crore) + " CRORE");
  if (lakh) parts.push(threeDigitsToWords(lakh) + " LAKH");
  if (thousand) parts.push(threeDigitsToWords(thousand) + " THOUSAND");
  if (hundred) parts.push(threeDigitsToWords(hundred));

  return parts.join(" ").trim();
}

export function fmt(n, decimals = 2) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function fmtDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const datePart = fmtDate(d);
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${datePart} ${String(h).padStart(2, "0")}:${mm} ${ampm}`;
}

export function buildComputedItems(invoice) {
  const isInterState = invoice.place_of_supply !== "22-CHHATTISGARH";
  const isSpare = invoice.invoice_type === "SPARE";

  let taxable = 0, cgst = 0, sgst = 0, igst = 0, grand = 0;

  const rawItems = invoice.items || [];
  const rows = rawItems.map((row, idx) => {
    const qty = Number(row.qty || 0);
    const discAmt = Number(row.discount || 0);
    
    // Determine unit price / standard rate
    let unitRate = Number(row.price ?? row.item?.standard_rate ?? 0);
    let mrp = Number(row.item?.standard_rate ?? row.price ?? 0);

    let taxableAmt = 0;
    let cg = 0, sg = 0, igstAmt = 0, lineTotal = 0;

    if (row.cgst_amt !== undefined && row.total !== undefined) {
      // Direct amounts provided in JSON payload
      taxableAmt = Math.max((unitRate * qty) - discAmt, 0);
      cg = Number(row.cgst_amt || 0);
      sg = Number(row.sgst_amt || 0);
      igstAmt = Number(row.igst_amt || 0);
      lineTotal = Number(row.total || 0);
    } else {
      // Calculated standard approach
      const gross = unitRate * qty;
      taxableAmt = Math.max(gross - discAmt, 0);

      if (isInterState) {
        igstAmt = taxableAmt * (Number(row.igst_per || 0) / 100);
        lineTotal = taxableAmt + igstAmt;
      } else {
        cg = taxableAmt * (Number(row.cgst_per || 0) / 100);
        sg = taxableAmt * (Number(row.sgst_per || 0) / 100);
        lineTotal = taxableAmt + cg + sg;
      }
    }

    taxable += taxableAmt;
    cgst += cg;
    sgst += sg;
    igst += igstAmt;
    grand += lineTotal;

    return {
      sno: idx + 1,
      code: (row.item?.code || "").trim(),
      description: row.item?.description || "",
      hsn: row.item?.hsn_sac_code || "",
      uom: row.item?.uom || "EA",
      qty,
      mrp,
      rate: unitRate,
      discAmt,
      taxableAmt,
      cg,
      sg,
      igstAmt,
      cgstPer: Number(row.cgst_per || 0),
      sgstPer: Number(row.sgst_per || 0),
      igstPer: Number(row.igst_per || 0),
      lineTotal,
    };
  });

  const roundedGrand = Math.round(grand);
  const roundOff = roundedGrand - grand;

  return { rows, isInterState, isSpare, taxable, cgst, sgst, igst, grand, roundedGrand, roundOff };
}