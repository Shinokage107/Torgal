const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const openCriticBaseUrl = "https://opencritic.com";
const openCiriticSearchUrl = "https://opencritic.com/search";

async function scrapeOpenCriticSearchResults(searchQuery) {
  try {
    const browser = await puppeteer.launch({ headless: "false" });
    const page = await browser.newPage();

    await page.goto(openCiriticSearchUrl);
    await page.type("input[name=searchStr]", searchQuery);
    await page.keyboard.press("Enter");
    await page.waitForSelector(".results-container div a");

    const searchResults = await page.evaluate((baseUrl) => {
      const results = [];
      document.querySelectorAll(".results-container div a").forEach((result) => {
        const href = result.getAttribute("href");
        const url = new URL(href, baseUrl).toString();
        results.push({ url });
      });
      return results;
    }, openCriticBaseUrl);

    await browser.close();

    return searchResults;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function scrapeOpenCriticGameData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const openCriticData = JSON.parse($("script[type=application/ld+json]:first").text());
    const openCriticMan = "https:" + $("[display=man] img").attr("src");

    return { openCriticData, openCriticMan };
  } catch (error) {
    console.error("Error fetching OpenCritic data:", error.message);
    throw error;
  }
}

async function getGameDataByName(name, max = 3, delay = 1000) {
  try {
    const searchResults = await scrapeOpenCriticSearchResults(name);
    const limitedResults = searchResults.slice(0, max);

    if (limitedResults.length > 0) {
      const gameDataPromises = limitedResults.map(async (result) => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return scrapeOpenCriticGameData(result.url);
      });

      const gameDataArray = await Promise.all(gameDataPromises);

      return gameDataArray;
    } else {
      console.log("No search results found.");
      return [];
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

/* scrapeOpenCriticGameData("https://opencritic.com/game/15979/asgards-wrath-2").then((response) => {
  console.log(response);
}); */

module.exports.getGameDataByName = getGameDataByName;
