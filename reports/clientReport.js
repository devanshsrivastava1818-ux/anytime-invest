
const PDFDocument = require("pdfkit");

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2
  }).format(number);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

function generateClientReport(client, res) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: "Anytime Invest - Client Portfolio Report",
      Author: "Anytime Invest"
    }
  });

  const filename = `Anytime-Invest-Client-${client.client_id}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const left = 50;
  const right = pageWidth - 50;
  const contentWidth = right - left;

  // Header
  doc.rect(0, 0, pageWidth, 150).fill("#08251b");

  doc.fillColor("#8ce8b5")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("ANYTIME INVEST", left, 38);

  doc.fillColor("#ffffff")
    .fontSize(24)
    .text("Client Portfolio Report", left, 65);

  doc.fillColor("#c3d9ce")
    .font("Helvetica")
    .fontSize(10)
    .text(`Client ID: ${client.client_id}`, left, 108);

  let y = 178;

  function sectionHeading(title) {
    doc.fillColor("#08784d")
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(title, left, y);

    y += 27;
  }

  function detail(label, value) {
    doc.fillColor("#63736a")
      .font("Helvetica")
      .fontSize(10)
      .text(label, left, y, {
        width: 170
      });

    doc.fillColor("#142b20")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(String(value), left + 185, y, {
        width: contentWidth - 185
      });

    y += 29;

    doc.moveTo(left, y - 8)
      .lineTo(right, y - 8)
      .strokeColor("#e0e9e2")
      .lineWidth(0.5)
      .stroke();
  }

  // Client details
  sectionHeading("CLIENT PROFILE");

  detail("Client Name", client.client_name ?? "Not available");
  detail("Advisor Name", client.advisor_name ?? "Not available");
  detail("Report Generated", formatDate(new Date()));

  y += 13;

  // Portfolio details
  sectionHeading("PORTFOLIO OVERVIEW");

  detail("Current Value", formatCurrency(client.current_value));
  detail("Total Investment", formatCurrency(client.total_investment));
  detail("Gain / Loss", formatCurrency(client.gain_loss));

  detail(
    "Gain Percentage",
    client.gain_percent == null
      ? "Not available"
      : `${formatNumber(client.gain_percent)}%`
  );

  detail("Active Schemes", formatNumber(client.active_scheme_count));
  detail("Total Units", formatNumber(client.total_units));
  detail("Last Updated", formatDate(client.last_updated_date));

  y += 15;

  // Note
  doc.fillColor("#63736a")
    .font("Helvetica")
    .fontSize(9)
    .text(
      "This report is generated using client portfolio data retrieved from the connected Databricks SQL warehouse.",
      left,
      y,
      {
        width: contentWidth,
        lineGap: 3
      }
    );

  y += 40;

  doc.fillColor("#63736a")
    .fontSize(8)
    .text(
      "Note: Values marked 'Not available' were not supplied by the source data. This report is for informational purposes.",
      left,
      y,
      {
        width: contentWidth,
        lineGap: 3
      }
    );

  // Footer
  const footerY = doc.page.height - 40;

  doc.fillColor("#08784d")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("Anytime Invest", left, footerY);

  doc.fillColor("#63736a")
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Client Portfolio Report",
      right - 150,
      footerY,
      {
        width: 150,
        align: "right"
      }
    );

  doc.end();
}

module.exports = { generateClientReport };
