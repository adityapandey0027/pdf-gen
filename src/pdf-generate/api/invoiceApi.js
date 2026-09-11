import mockInvoice from "../../../public/mockInvoice.json";

export async function fetchInvoiceData() {
  return mockInvoice.data ?? mockInvoice;
}


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