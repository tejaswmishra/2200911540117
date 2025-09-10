import express from "express";
import { createShortUrl, resolveShortUrl } from "../services/urlService.js";
import { Log } from "../../Logging_Middleware/logging-middleware.js";

const router = express.Router();

router.post("/short", async (req, res) => {
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

export default router;
