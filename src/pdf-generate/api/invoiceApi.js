import mockInvoice from "../../../public/mockInvoice.json";

// export async function fetchInvoiceData() {
//   return mockInvoice.data ?? mockInvoice;
// }


// export async function fetchInvoiceData(apiUrl) {
//   const response = await fetch(apiUrl, {
//     headers: {
//       Accept: "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Request failed with status ${response.status}`
//     );
//   }

//   const result = await response.json();

//   return result.data ?? result;
// }


export async function fetchInvoiceData() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        return mockInvoice.data ?? mockInvoice;
    }

    try {
        const response = await fetch(
            `https://aliceblue-owl-869729.hostingersite.com/invoices/pdf-json/${id}`
        );

        if (!response.ok) {
            console.warn(`Request failed with status ${response.status}, falling back to mockInvoice`);
            return mockInvoice.data ?? mockInvoice;
        }
        console.log("Response from API:", response);
        const result = await response.json();
        return result.data ?? result;
    } catch (err) {
        console.warn("API fetch error, falling back to mockInvoice:", err);
        return mockInvoice.data ?? mockInvoice;
    }
}