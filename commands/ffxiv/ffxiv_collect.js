const { SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { ffxivCollect } = require("../../src/api.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder()
    .setName("ffxiv_collect")
    .setDescription("A command to search FFXIV Collect items")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Gives a full list of all items fo a set category")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("The item Category")
            .setRequired(true)
            .addChoices(
              { name: "Mounts", value: "mounts" },
              { name: "Achievements", value: "achievements" },
              { name: "Titles", value: "titles" },
              { name: "Minions", value: "minions" },
              { name: "Orchestrions", value: "orchestrions" },
              { name: "Frames", value: "frames" },
              { name: "Spells", value: "spells" },
              { name: "Emotes", value: "emotes" },
              { name: "Bardings", value: "bardings" },
              { name: "Hairstyles", value: "hairstyles" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("fillter")
        .setDescription("Gives a list of filtered items from a set category")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("The item Category")
            .setRequired(true)
            .addChoices(
              { name: "Mounts", value: "mounts" },
              { name: "Achievements", value: "achievements" },
              { name: "Titles", value: "titles" },
              { name: "Minions", value: "minions" },
              { name: "Orchestrions", value: "orchestrions" },
              { name: "Frames", value: "frames" },
              { name: "Spells", value: "spells" },
              { name: "Emotes", value: "emotes" },
              { name: "Bardings", value: "bardings" },
              { name: "Hairstyles", value: "hairstyles" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("fillter")
            .setDescription("Set a Fillter")
            .setRequired(true)
            .addChoices(
              { name: "Patch equal", value: "patch_eq=" },
              { name: "Patch less or equal", value: "patch_lteq=" },
              { name: "Patch greater or equal", value: "patch_gteq=" },
              { name: "Name search", value: "name_en_cont=" },
              { name: "Description search", value: "description_en_cont=" }
            )
        )
        .addStringOption((option) => option.setName("condition").setDescription("Condition of your Fillter").setRequired(true))
    ),
  execute: execute,
};

async function execute(interaction) {
  var book = [];

  await interaction.deferReply();
  await ffxivCollect
    .get(
      interaction.options.getString("category") +
        "?" +
        interaction.options.getString("fillter") +
        interaction.options.getString("condition")
    )
    .then((response) => {
      var results = response.results;
      // console.log(results);

      for (let index = 0; index < results.length; index++) {
        var page = results[index];

        var print = new EmbedBuilder();

        var description = "";

        if (page.description != null) description += page.description + "\n";
        if (page.achievement != null) {
          var objectiveString = "**Achievement**: \n";
          objectiveString += page.achievement.name + "\n";
          objectiveString += page.achievement.description + "\n";

          description += objectiveString;
        }

        if (page.tradeable != null && page.tradeable) description += "<:gil:1139298538296180826> | ";
        if (page.owned != null) description += "Owned by: " + page.owned;

        print.setTitle(page.name + " ( " + page.patch + " ) #" + page.id);
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

      if (book.length > 0) {
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
      } else {
        interaction.followUp("Sry i was not able to find anything :c");
      }
    })
    .catch((exception) => {
      if (exception.response.data.status == 404) interaction.followUp(exception.response.data.error);
      else interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
    });
}
