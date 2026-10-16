
const { DBSQLClient } = require("@databricks/sql");

async function getClientById(clientId) {
  const { DATABRICKS_HOST, DATABRICKS_HTTP_PATH, DATABRICKS_TOKEN } =
    process.env;

  if (!DATABRICKS_HOST || !DATABRICKS_HTTP_PATH || !DATABRICKS_TOKEN) {
    throw new Error("Databricks environment variables are missing.");
  }

  const client = new DBSQLClient();
  let session;
  let operation;

  try {
    await client.connect({
      host: DATABRICKS_HOST,
      path: DATABRICKS_HTTP_PATH,
      token: DATABRICKS_TOKEN
    });

    session = await client.openSession();

    operation = await session.executeStatement(
      `SELECT client_id, client_name, advisor_name,
              total_investment, current_value, gain_loss,
              gain_percent, active_scheme_count, total_units,
              last_updated_date
       FROM workspace.default.client_portfolio_mart
       WHERE client_id = ?`,
      {
        runAsync: true,
        maxRows: 1,
        ordinalParameters: [Number(clientId)]
      }
    );

    const rows = await operation.fetchAll();
    return rows[0] || null;
  } finally {
    if (operation) {
      try { await operation.close(); } catch {}
    }
    if (session) {
      try { await session.close(); } catch {}
    }
    try { await client.close(); } catch {}
  }
}

module.exports = { getClientById };
