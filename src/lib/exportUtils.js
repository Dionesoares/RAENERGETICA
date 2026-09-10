import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { tintBrandLogos } from "@/lib/brandLogo";

const A4_WIDTH_MM = 210;

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

async function captureElement(element) {
  await waitForImages(element);
  await tintBrandLogos(element);
  await waitForImages(element);
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: element.scrollWidth,
    windowWidth: element.scrollWidth,
    height: element.offsetHeight,
    windowHeight: element.offsetHeight,
    logging: false,
  });
}

function rowHasDarkInk(ctx, y, width) {
  const clampedY = Math.max(0, Math.min(y, ctx.canvas.height - 1));
  const { data } = ctx.getImageData(0, clampedY, width, 1);
  for (let x = 0; x < width; x += 3) {
    const i = x * 4;
    if (data[i] < 160 && data[i + 1] < 160 && data[i + 2] < 160 && data[i + 3] > 200) {
      return true;
    }
  }
  return false;
}

function findSafeCut(ctx, width, startY, idealY) {
  const pxPerMm = width / A4_WIDTH_MM;
  const searchPx = Math.max(24, Math.round(24 * pxPerMm));
  const minY = Math.max(startY + Math.round((idealY - startY) * 0.55), idealY - searchPx);
  const band = Math.max(4, Math.round(1.2 * pxPerMm));

  for (let y = idealY; y >= minY; y -= 1) {
    let clear = true;
    for (let i = 0; i < band; i += 1) {
      if (rowHasDarkInk(ctx, y - i, width)) {
        clear = false;
        break;
      }
    }
    if (clear) return Math.max(minY, y - Math.floor(band / 2));
  }
  return idealY;
}

function addCanvasSlices(pdf, canvas, { startNewPage } = {}) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pxPerMm = canvas.width / pageWidth;
  const pageHeightPx = Math.floor(pageHeight * pxPerMm);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let y = 0;
  let pageIndex = 0;

  while (y < canvas.height - 1) {
    const remaining = canvas.height - y;
    let cut = y + Math.min(pageHeightPx, remaining);
    if (cut < canvas.height) {
      cut = findSafeCut(ctx, canvas.width, y, cut);
    }
    const sliceHeight = Math.max(1, cut - y);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;
    pageCanvas.getContext("2d").drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    if (pageIndex > 0 || startNewPage) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pageWidth, sliceHeight / pxPerMm);
    y = cut;
    pageIndex += 1;
  }
}

function createA4Page(sourceElement, watermark) {
  const page = document.createElement("div");
  page.className = sourceElement.className;
  page.style.cssText = [
    "width:210mm",
    "height:297mm",
    "max-width:210mm",
    "box-sizing:border-box",
    "overflow:hidden",
    "position:relative",
    "background:#ffffff",
    "margin:0",
    `padding:${sourceElement.style.padding || "16mm 18mm"}`,
  ].join(";");

  if (watermark) {
    const mark = watermark.cloneNode(true);
    mark.style.position = "absolute";
    mark.style.inset = "0";
    mark.style.height = "297mm";
    mark.style.overflow = "hidden";
    page.appendChild(mark);
  }

  const flow = document.createElement("div");
  flow.className = "relative";
  flow.style.position = "relative";
  page.appendChild(flow);
  return { page, flow };
}

function pageOverflows(page) {
  return page.scrollHeight > page.clientHeight + 2;
}

function buildPaginatedPages(element) {
  const flowRoot = element.querySelector("[data-pdf-flow]");
  if (!flowRoot) return null;
  const blocks = [...flowRoot.children];
  if (!blocks.length) return null;

  const watermark = element.querySelector("[data-pdf-watermark]");
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-220mm;top:0;width:210mm;background:#ffffff;z-index:0;pointer-events:none;";
  document.body.appendChild(host);

  try {
    const pages = [];
    let current = createA4Page(element, watermark);
    host.appendChild(current.page);
    pages.push(current.page);

    const startNewPage = () => {
      current = createA4Page(element, watermark);
      host.appendChild(current.page);
      pages.push(current.page);
    };

    for (const block of blocks) {
      const clone = block.cloneNode(true);
      current.flow.appendChild(clone);

      if (!pageOverflows(current.page)) continue;

      if (current.flow.childElementCount === 1) {
        current.page.style.height = "auto";
        current.page.style.minHeight = "297mm";
        current.page.style.overflow = "visible";
        continue;
      }

      current.flow.removeChild(clone);
      const carried = [];
      while (current.flow.lastElementChild?.getAttribute("data-keep-with-next") === "true") {
        carried.unshift(current.flow.lastElementChild);
        current.flow.removeChild(current.flow.lastElementChild);
      }

      if (current.flow.childElementCount > 0) {
        startNewPage();
      }

      carried.forEach((node) => current.flow.appendChild(node));
      current.flow.appendChild(clone);

      if (pageOverflows(current.page)) {
        current.page.style.height = "auto";
        current.page.style.minHeight = "297mm";
        current.page.style.overflow = "visible";
      }
    }

    return { host, pages };
  } catch (error) {
    host.remove();
    throw error;
  }
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

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  try {
    await waitForImages(clone);
    await tintBrandLogos(clone);
    await waitForImages(clone);

    if (fitToOnePage) {
      const canvas = await captureElement(clone);
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (imgHeight <= pageHeight) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        const scaledHeight = pageHeight;
        const scaledWidth = (canvas.width * pageHeight) / canvas.height;
        const x = (pageWidth - scaledWidth) / 2;
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, 0, scaledWidth, scaledHeight);
      }
      pdf.save(filename);
      return;
    }

    const paginated = buildPaginatedPages(clone);
    if (paginated) {
      try {
        for (let i = 0; i < paginated.pages.length; i += 1) {
          const page = paginated.pages[i];
          const canvas = await captureElement(page);
          const imgHeight = (canvas.height * pageWidth) / canvas.width;
          if (imgHeight <= pageHeight + 0.8) {
            if (i > 0) pdf.addPage();
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pageWidth, Math.min(imgHeight, pageHeight));
          } else {
            addCanvasSlices(pdf, canvas, { startNewPage: i > 0 });
          }
        }
      } finally {
        paginated.host.remove();
      }
      pdf.save(filename);
      return;
    }

    const canvas = await captureElement(clone);
    addCanvasSlices(pdf, canvas, { startNewPage: false });
    pdf.save(filename);
  } finally {
    host.remove();
  }
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
