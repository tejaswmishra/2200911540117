import express from "express";
import { createShortUrl, resolveShortUrl } from "../services/urlService.js";
import { Log } from "../../Logging_Middleware/logging-middleware.js";

const router = express.Router();

router.post("/shorten", async (req, res) => {
  try {
    const { url, validity, customCode } = req.body;
    const result = createShortUrl(url, validity || 30, customCode);

    await Log("backend", "info", "service", `Shortened URL: ${result.shortCode}`);
    res.json({ shortUrl: `http://localhost:3000/${result.shortCode}`, expiry: result.expiry });
  } catch (err) {
    await Log("backend", "error", "handler", `Failed to shorten URL: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.get("/:code", async (req, res) => {
  const code = req.params.code;
  const entry = resolveShortUrl(code);

  if (!entry) {
    await Log("backend", "warn", "handler", `Invalid/expired code: ${code}`);
    return res.status(404).json({ error: "URL not found or expired" });
  }

  await Log("backend", "info", "handler", `Redirected: ${entry.originalUrl}`);
  res.redirect(entry.originalUrl);
});

export default router;
