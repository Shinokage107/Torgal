const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const openCriticBaseUrl = "https://opencritic.com";
const openCiriticSearchUrl = "https://opencritic.com/search";

async function scrapeOpenCriticSearchResults(searchQuery) {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
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
    const openCriticGameLink = url;

    return { openCriticData, openCriticMan, openCriticGameLink };
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

async function getGameDataFromFrontPage(delay = 1000) {
  try {
    const response = await axios.get(openCriticBaseUrl);
    const $ = cheerio.load(response.data);

    const popularGamesContainer = $("[title='Recently Released']");

    if (popularGamesContainer.length === 0) {
      console.error("Popular games container not found on the page.");
      return [];
    }

    const linksArray = [];

    popularGamesContainer.find("a.deco-none").each((index, element) => {
      const link = $(element).attr("href");
      linksArray.push(openCriticBaseUrl + link);
    });

    const detailedGameDataArray = await Promise.all(
      linksArray.map(async (link) => {
        const gameData = await scrapeOpenCriticGameData(link);
        return gameData;
      })
    );

    return detailedGameDataArray;
  } catch (error) {
    console.error("Error fetching and parsing the page:", error.message);
    throw error;
  }
}

/* getGameDataFromFrontPage().then((response) => {
  console.log(response);
}); */

module.exports.getGameDataFromFrontPage = getGameDataFromFrontPage;
module.exports.getGameDataByName = getGameDataByName;
