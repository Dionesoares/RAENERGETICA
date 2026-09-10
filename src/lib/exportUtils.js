import jsPDF from "jspdf";
import html2canvas from "html2canvas";

async function waitForImages(element) {
  const images = [...element.querySelectorAll("img")];
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

export async function exportElementToPdf(elementId, filename = "documento.pdf", { fitToOnePage = false } = {}) {
  const element = document.getElementById(elementId);
  if (!element) return;
  await waitForImages(element);

  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-220mm;top:0;width:210mm;background:#ffffff;z-index:0;pointer-events:none;";
  const clone = element.cloneNode(true);
  clone.id = `${elementId}-pdf-clone`;
  clone.style.width = "210mm";
  clone.style.maxWidth = "210mm";
  clone.style.margin = "0";
  host.appendChild(clone);
  document.body.appendChild(host);
  await waitForImages(clone);

  let canvas;
  try {
    canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: clone.scrollWidth,
      windowWidth: clone.scrollWidth,
      logging: false,
    });
  } finally {
    host.remove();
  }

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  if (fitToOnePage) {
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      const scaledHeight = pageHeight;
      const scaledWidth = (canvas.width * pageHeight) / canvas.height;
      const x = (pageWidth - scaledWidth) / 2;
      pdf.addImage(imgData, "PNG", x, 0, scaledWidth, scaledHeight);
    }
    pdf.save(filename);
    return;
  }

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  pdf.save(filename);
}

export function exportToCsv(filename, rows, headers) {
  const csvContent = [
    headers.map((h) => h.label).join(";"),
    ...rows.map((row) =>
      headers.map((h) => `"${String(row[h.key] ?? "").replace(/"/g, '""')}"`).join(";")
    ),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
