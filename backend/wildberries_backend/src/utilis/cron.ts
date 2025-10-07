import { CronJob } from "cron";
import https from "https";

// Function to ping the server
const job = new CronJob("*/14 * * * *", () => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://wildberries-gtwe.onrender.com/"
      : "http://localhost:4000/";

  https
    .get(url, (res) => console.log(`Pinged ${url} - Status Code: ${res.statusCode}`))
    .on("error", (e) => console.error(`Error pinging ${url}: ${e.message}`));
});

export default job;


// CRON JOB EXPLANATION
// The cron job is set to run every 14 minutes using the cron expression "*/14 * * * *".
// It checks the NODE_ENV environment variable to determine whether the application is running in production or development mode.
// Based on the environment, it sets the URL to either the production server or the local server.