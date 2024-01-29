const axios = require("axios");
const cheerio = require("cheerio");

const ecSearchUrl = "https://ffxiv.eorzeacollection.com/glamours/loved?";
const ecBaseUrl = "https://ffxiv.eorzeacollection.com";

async function getGlamsByFilter(filterString) {
  try {
    const searchString = ecSearchUrl + filterString;
    const response = await axios.get(searchString);
    const $ = cheerio.load(response.data);

    const girdItemArray = [];

    $(".c-glamour-grid-item").each((index, element) => {
      const link = ecBaseUrl + $(element).find(".c-glamour-grid-item-link").attr("href");
      const image = $(element).find(".c-glamour-grid-item-link").children("img").attr("src");
      const title = $(element).find(".c-glamour-grid-item-content-title").text();
      const author = $(element).find(".c-glamour-grid-item-content-author").text();
      const likes = $(element).find(".c-glamour-grid-item-icons-counter").text();
      const fit = [];
      $(element)
        .find(".c-set-fitting-icon")
        .each((i, iconElement) => {
          const title = $(iconElement).attr("title");
          if (title) {
            fit.push(title);
          }
        });

      girdItemArray.push({ link, image, title, author, likes, fit });
    });

    return girdItemArray;
  } catch (error) {
    console.error("Error fetching and parsing the page:", error.message);
    throw error;
  }
}

/* getGlamsByFilter("https://ffxiv.eorzeacollection.com/glamours/loved").then((response) => {
  console.log(response);
}); */

module.exports.getGlamsByFilter = getGlamsByFilter;
