const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
const { hl2b } = require("../../src/api.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder()
    .setName("hl2b")
    .setDescription("Ping pong command but only for dev")
    .addStringOption((option) => option.setName("name").setDescription("The Name of the Game").setRequired(true)),
  execute: execute,
};

async function execute(interaction) {
  await interaction.deferReply();
  var pages = 20;
  var book = [];

  input = interaction.options.getString("name");
  await hl2b
    .get("?name=" + input)
    .then((response) => {
      for (let index = 0; index < pages && index < response.length; index++) {
        const page = response[index];
        var print = new EmbedBuilder();

        print.setTitle(page.name);
        print.setDescription("Platforms: " + page.platforms);
        print.setThumbnail(page.imageUrl).addFields({
          name: "----------",
          value:
            "<:PlayStation_bronze_trophy:1195693685984211075> **Main:**  " +
            page.gameplayMain +
            "h\n<:PlayStation_Silver_Trophy:1195693645517570130> **Main + Extra:**  " +
            page.gameplayMainExtra +
            "h\n<:PlayStation_Gold_Trophy:1195693593894080625> **Completionist:**  " +
            page.gameplayCompletionist +
            "h",
          inline: false,
        });
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
    })
    .catch((exception) => {
      console.log(exception);
      interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
    });
}
