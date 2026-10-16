
# Anytime Invest — Wealth Management Analytics Platform

A full-stack financial analytics and client reporting application that connects a web interface to a Databricks SQL Warehouse to retrieve client portfolio information and generate downloadable PDF reports.

## Features

- **Client Portfolio Lookup:** Retrieve client information using a client ID.
- **Databricks Integration:** Fetch portfolio records from a Databricks SQL Warehouse.
- **PDF Report Generation:** Generate and download client portfolio reports.
- **REST API:** Backend endpoints for health checks and client data retrieval.
- **Input Validation:** Handle invalid client IDs and clients that cannot be found.
- **Missing Data Handling:** Display unavailable values rather than inventing financial figures.
- **Responsive Interface:** A modern fintech-inspired web interface.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Data Warehouse:** Databricks SQL Warehouse
- **PDF Generation:** PDFKit
- **Configuration:** dotenv

## Architecture

```text
User
  |
  v
Web Interface (HTML, CSS, JavaScript)
  |
  v
Node.js + Express Backend
  |
  v
Databricks SQL Warehouse
  |
  v
Client Portfolio Data
  |
  v
PDF Report Generation
```

## Getting Started

### Prerequisites

- Node.js and npm
- Access to a Databricks workspace
- A Databricks SQL Warehouse and access to the required portfolio table

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/devanshsrivastava1818-ux/anytime-invest.git
   cd anytime-invest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

4. Add your own Databricks connection details to `.env`. Configure the required host, HTTP path, access token, and port using your local environment.

5. Start the application:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check application health |
| GET | `/api/client/:id` | Retrieve client portfolio data |
| GET | `/client-report/:id` | Generate and download a client PDF report |

## Security

- Keep `.env` and all access tokens private.
- Never commit credentials or secrets to GitHub.
- Use `.env.example` as a template for local configuration.
- Ensure your Databricks account has the required permissions.

## Project Status

The client lookup, Databricks data retrieval, and PDF report generation have been tested locally. Running the application requires valid Databricks credentials and access to the configured data source.

## Future Improvements

- Portfolio performance visualizations
- More detailed financial analytics
- Improved report customization
- Deployment for public access

---

Built as a wealth management analytics and reporting project.
