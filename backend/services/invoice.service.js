const PDFDocument = require("pdfkit");

function money(n) {
  return `$${(Number(n) || 0).toFixed(2)}`;
}

function generateInvoicePdf(order, user) {
  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const chunks = [];

  return new Promise((resolve, reject) => {
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, doc.page.width, 88).fill("#020617");
    doc.fillColor("#22d3ee").fontSize(22).text("AutoFixHub", 48, 28);
    doc
      .fillColor("#94a3b8")
      .fontSize(10)
      .text("Premium auto repair · Islamabad", 48, 54);

    doc.fillColor("#0f172a").fontSize(18).text("Tax Invoice", 48, 120);
    doc.fontSize(10).fillColor("#475569");
    doc.text(`Invoice #: ${String(order._id).slice(-8).toUpperCase()}`, 48, 148);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`);
    doc.text(`Status: ${order.status || "Pending"} · Payment: ${order.paymentStatus || "unpaid"}`);

    doc.moveDown();
    doc.fillColor("#0f172a").fontSize(12).text("Billed to");
    doc.fillColor("#475569").fontSize(10);
    doc.text(user?.username || "Customer");
    doc.text(user?.email || "");

    const tableTop = 260;
    doc.fillColor("#020617").rect(48, tableTop, 500, 24).fill();
    doc.fillColor("#ecfeff").fontSize(10);
    doc.text("Item", 56, tableTop + 7);
    doc.text("Qty", 320, tableTop + 7);
    doc.text("Price", 380, tableTop + 7);
    doc.text("Total", 470, tableTop + 7);

    let y = tableTop + 32;
    const lines = order.products || [];
    lines.forEach((line, i) => {
      if (i % 2 === 0) doc.fillColor("#f8fafc").rect(48, y - 6, 500, 22).fill();
      const title = line.title || line.product?.title || "Part";
      const qty = line.quantity || 1;
      const price = line.price || 0;
      doc.fillColor("#0f172a").fontSize(10);
      doc.text(title, 56, y, { width: 250 });
      doc.text(String(qty), 320, y);
      doc.text(money(price), 380, y);
      doc.text(money(qty * price), 470, y);
      y += 22;
    });

    y += 16;
    doc.fillColor("#0f172a").fontSize(12);
    doc.text(`Grand total: ${money(order.totalAmount)}`, 48, y, { align: "right" });

    doc
      .fillColor("#64748b")
      .fontSize(9)
      .text(
        "Thank you for choosing AutoFixHub. This receipt is generated electronically.",
        48,
        740,
        { align: "center" }
      );

    doc.end();
  });
}

module.exports = { generateInvoicePdf };
