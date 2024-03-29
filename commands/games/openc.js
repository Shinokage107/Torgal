const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
const { getGameDataByName, getGameDataFromFrontPage } = require("../../src/opencriticScraper.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder()
    .setName("openc")
    .setDescription("Open Critic Scores for Games. No input will give u recent releases")
    .addStringOption((option) => option.setName("name").setDescription("The Name of the Game")),
  execute: execute,
};

async function execute(interaction) {
  await interaction.deferReply();

  var input = interaction.options.getString("name") != null ? interaction.options.getString("name") : null;

  //if(input != null){
  if (false) {
    await getGameDataByName(input, 5, 500)
      .then((response) => {
        paginateResponse(interaction, response);
      })
      .catch((e) => {
        console.log(e);
        interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
      });
  } else {
    await getGameDataFromFrontPage(500)
      .then((response) => {
        paginateResponse(interaction, response);
      })
      .catch((e) => {
        console.log(e);
        interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
      });
  }
}

function isLink(str) {
  // Regular expression to check if the string is a valid URL
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  return urlRegex.test(str);
}

async function paginateResponse(interaction, response) {
  var pages = 20;
  var book = [];
  for (let index = 0; index < pages && index < response.length; index++) {
    const page = response[index];

    const man = page.openCriticMan;
    const data = page.openCriticData;
    const url = page.openCriticGameLink;

    var rating;
    try {
      rating = data.aggregateRating.ratingValue;
    } catch {
      rating = "TBD";
    }

    var print = new EmbedBuilder();

    print.setTitle(data.name);
    print.setDescription("**Platforms:** " + data.gamePlatform.join());
    if (isLink(man)) print.setThumbnail(man);
    print.addFields({
      name: "Open Critic Rating:",
      value: "" + rating + "",
      inline: true,
    });
    if (isLink(data.image)) print.setImage(data.image);
    print.setURL(url);

    book.push(print);
  }

  if (book.length > 0) {
    new Pagination()
      .setPortal(interaction)
      .setPageList(book)
      .enableAutoButton()
      .setProgressBar()
      .enableAuthorIndependent()
      .disableDisabledButtons()
      .setTimeout(30000)
      // .enablePrivateReply()
      .paginate();
  } else {
    interaction.followUp("Sry i was not able to find anything :c");
  }
}
