
require("dotenv").config();

const express = require("express");
const path = require("path");
const { getClientById } = require("./services/databricks");
const { generateClientReport } = require("./reports/clientReport");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Anytime Invest"
  });
});

app.get("/api/client/:id", async (req, res) => {
  const id = req.params.id;

  if (!/^\d+$/.test(id) || Number(id) < 1) {
    return res.status(400).json({
      error: "Please enter a valid client ID."
    });
  }

  try {
    const client = await getClientById(Number(id));

    if (!client) {
      return res.status(404).json({
        error: "Client not found."
      });
    }

    res.json(client);
  } catch (error) {
    console.error("Databricks client lookup failed:", error.message);

    res.status(500).json({
      error: "Unable to retrieve client data. Check server configuration."
    });
  }
});


app.get("/client-report/:id", async (req, res) => {
  const id = req.params.id;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      error: "Please enter a valid client ID."
    });
  }

  try {
    const client = await getClientById(Number(id));

    if (!client) {
      return res.status(404).json({
        error: "Client not found."
      });
    }

    generateClientReport(client, res);
  } catch (error) {
    console.error("PDF report generation failed:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Unable to generate the client report."
      });
    } else {
      res.destroy(error);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Anytime Invest running at http://localhost:${PORT}`);
});
