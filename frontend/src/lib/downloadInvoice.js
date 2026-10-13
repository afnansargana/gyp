import { apiClient } from "./api/client";

export async function downloadInvoice(orderId) {
  const { data } = await apiClient.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `autofixhub-invoice-${String(orderId).slice(-8)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
