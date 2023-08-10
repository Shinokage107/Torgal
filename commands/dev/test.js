const { SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { ffxivCollect } = require("../../api/api.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
module.exports = {
  type: "dev",
  data: new SlashCommandBuilder().setName("test").setDescription("Test command"),
  execute: execute,
};

async function execute(interaction) {
  var book = [];

  await interaction.deferReply();
  await ffxivCollect.get("mounts?patch_gt=6.0").then((response) => {
    console.log(response);
    var results = response.results;

    for (let index = 0; index < results.length; index++) {
      var page = results[index];

      var print = new EmbedBuilder();

      var description = page.description + "\n";
      if (page.tradeable != null && page.tradeable) description += "<:gil:1139298538296180826> | ";
      if (page.owned != null) description += "Owned by: " + page.owned;

      print.setTitle(page.name + " ( " + page.patch + " )");
      print.setDescription(description);
      print.setThumbnail(page.icon);
      print.setImage(page.image);

      if (page.sources != null) {
        var sourceString = "";
        page.sources.forEach((source) => {
          sourceString += source.type + " | " + source.text + "\n";
        });
        print.addFields({
          name: "Source",
          value: sourceString,
          inline: false,
        });
      }

      book.push(print);
    }

    new Pagination()
      .setPortal(interaction)
      .setPageList(book)
      .enableAutoButton()
      // .setProgressBar()
      .enableAuthorIndependent()
      .disableDisabledButtons()
      .setTimeout(30000)
      // .enablePrivateReply()
      .enableAutoDelete()
      .paginate();
  });
}
