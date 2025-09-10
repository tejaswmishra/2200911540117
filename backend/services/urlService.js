import { v4 as uuidv4 } from "uuid";
import urlStore from "../db.js";

function generateShortCode(customCode) {
  if (customCode) return customCode;
  return uuidv4().slice(0, 6);
}

export function createShortUrl(originalUrl, validityMinutes = 30, customCode) {
  const shortCode = generateShortCode(customCode);

  if (urlStore.has(shortCode)) {
    throw new Error("Short code already exists. Please choose another.");
  }

  const expiry = Date.now() + validityMinutes * 60 * 1000;

  const entry = { originalUrl, expiry, shortCode, createdAt: Date.now() };
  urlStore.set(shortCode, entry);

  return entry;
}

export function resolveShortUrl(shortCode) {
  const entry = urlStore.get(shortCode);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    urlStore.delete(shortCode);
    return null;
  }

  return entry;
}
