import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
const BEARER_TOKEN = process.env.BEARER_TOKEN;


const stacks = ["backend", "frontend"];
const levels = ["debug", "info", "warn", "error", "fatal"];
const backendPackages = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];
const frontendPackages = ["api"];

export async function Log(stack, level, pkg, message) {
  try {
    if (!stacks.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}`);
    }
    if (!levels.includes(level)) {
      throw new Error(`Invalid level: ${level}`);
    }
    if (stack === "backend" && !backendPackages.includes(pkg)) {
      throw new Error(`Invalid backend package: ${pkg}`);
    }
    if (stack === "frontend" && !frontendPackages.includes(pkg)) {
      throw new Error(`Invalid frontend package: ${pkg}`);
    }

    const payload = { stack, level, package: pkg, message };

    const response = await axios.post(LOG_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`,
      },
    });

    console.log("Log sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Logging error:", error.message);
    return { error: error.message };
  }
}
