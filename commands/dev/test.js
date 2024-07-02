const { SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { ffxivCollect } = require("../../src/api.js");
const db = require("../../src/db.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
const themes = require("../../src/themes.json");
const { xoembed } = require("../../src/api");

const axios = require("axios");
const cheerio = require("cheerio");
const { debug } = require("util");

const oembedUrl = "https://publish.twitter.com/oembed?url=";

module.exports = {
  type: "dev",
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command")
    .addStringOption((option) => option.setName("tweet").setDescription("twitter url").setRequired(true)),
  execute: execute,
};

async function execute(interaction) {
  // tweetMessage = " ";

  /*await xoembed.get(interaction.options.getString("tweet")).then((response) => {
    tweetMessage = response.html;
  });*/

  //const oembed = await axios.get(oembedUrl + interaction.options.getString("tweet"));

  /*const imagePage = await axios.get(interaction.options.getString("tweet"));
  const $ = cheerio.load(imagePage.data);
  const imageURL = $("[alt=Image] img").attr("src");

  console.log(imageUrl);
*/

  tweetURL = interaction.options.getString("tweet");
  baseTweet = tweetURL.substr(tweetURL.indexOf("com") + 3);
  modifiedTweetUrl = "https://d.fxtwitter.com" + baseTweet;

  const globalRegex = new RegExp("(.*\\.+com\\/+[\\S]+\\/status\\/+[\\d]+?\\/photo\\/+[\\d])|(.*.+com\\/+[\\S]+\\/status\\/+[\\d]+)", "g");

  const validLink = await globalRegex.test(modifiedTweetUrl);
  console.log(validLink);

  if (!validLink) {
    await interaction.deferReply({ ephemeral: true });

    var response =
      "The link u provided does not seem to be a valid twitter link. -> <" +
      tweetURL +
      ">" +
      "\nValid links are for example:\nhttps://twitter.com/<username>/status/<number> **or**\nhttps://twitter.com/<username>/status/<number>/photo/<number>";

    await interaction.followUp(response);
  } else {
    await interaction.deferReply({ ephemeral: false });

    var response = "<@" + interaction.user + "> just submitted their Gpose!" + " [Tweet](" + modifiedTweetUrl + ")";

    await interaction.followUp(response);
  }
}
