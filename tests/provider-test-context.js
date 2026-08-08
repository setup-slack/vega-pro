const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const MOCK_URLS_ENDPOINT =
  "https://raw.githubusercontent.com/Harshal358/vega-pro/refs/heads/main/urls.json";
const nativeFetch = global.fetch;

global.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  if (url === MOCK_URLS_ENDPOINT) {
    const providerUrls = fs.readFileSync(
      path.join(rootDir, "urls.json"),
      "utf-8",
    );
    return new Response(providerUrls, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return nativeFetch(input, init);
};

const providerContext = {
  axios,
  cheerio,
  commonHeaders: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
  Aes: {},
};

module.exports = { providerContext };
