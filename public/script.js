document.addEventListener("DOMContentLoaded", () => {
  const clientIdInput = document.getElementById("clientId");
  const searchButton = document.getElementById("searchButton");
  const statusMessage = document.getElementById("statusMessage");
  const clientResult = document.getElementById("clientResult");
  const downloadButton = document.getElementById("downloadButton");

  let currentClientId = null;

  function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "status-message";
    if (type) statusMessage.classList.add(type);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;

    element.textContent =
      value === null || value === undefined || value === ""
        ? "Not available"
        : value;
  }

  function formatCurrency(value) {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(Number(value));
  }

  function formatNumber(value) {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2
    }).format(Number(value));
  }

  function displayClient(client) {
    setText("resultName", client.client_name);
    setText("resultId", client.client_id);
    setText("resultAdvisor", client.advisor_name);
    setText("resultValue", formatCurrency(client.current_value));
    setText("resultInvestment", formatCurrency(client.total_investment));
    setText("resultGain", formatCurrency(client.gain_loss));

    setText(
      "resultPercent",
      client.gain_percent == null
        ? "Not available"
        : `${formatNumber(client.gain_percent)}%`
    );

    setText("resultSchemes", formatNumber(client.active_scheme_count));
    setText("resultUnits", formatNumber(client.total_units));
    setText("resultDate", client.last_updated_date);

    clientResult.hidden = false;
    downloadButton.disabled = false;
  }

  async function searchClient() {
    const clientId = clientIdInput.value.trim();

    if (!/^[1-9]\d*$/.test(clientId)) {
      showStatus("Please enter a valid positive client ID.", "error");
      clientResult.hidden = true;
      downloadButton.disabled = true;
      return;
    }

    searchButton.disabled = true;
    downloadButton.disabled = true;
    clientResult.hidden = true;
    currentClientId = null;
    showStatus("Fetching client data securely from Databricks...");

    try {
      const response = await fetch(
        `/api/client/${encodeURIComponent(clientId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve client data.");
      }

      displayClient(data);
      currentClientId = clientId;
      showStatus("Client portfolio loaded successfully.", "success");
    } catch (error) {
      showStatus(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      searchButton.disabled = false;
    }
  }

  async function downloadReport() {
    if (!currentClientId) {
      showStatus("Please search for a client first.", "error");
      return;
    }

    downloadButton.disabled = true;
    showStatus("Preparing your PDF report...");

    try {
      const response = await fetch(
        `/client-report/${encodeURIComponent(currentClientId)}`
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "PDF report could not be generated.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Anytime-Invest-Client-${currentClientId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      showStatus("Your PDF report has been downloaded.", "success");
    } catch (error) {
      showStatus(
        error.message || "Unable to download the PDF report.",
        "error"
      );
    } finally {
      downloadButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", searchClient);

  clientIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchClient();
  });

  downloadButton.addEventListener("click", downloadReport);

  downloadButton.disabled = true;
  clientResult.hidden = true;
});