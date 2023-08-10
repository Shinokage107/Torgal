const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
const { lodestonenews } = require("../../api/api.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder()
    .setName("lodestone")
    .setDescription("Command to fetch Lodestone News")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The news Category")
        .setRequired(true)
        .addChoices(
          { name: "Topics", value: "topics" },
          { name: "Maintenance", value: "maintenance" },
          { name: "Updates", value: "updates" },
          { name: "Notices", value: "notices" },
          { name: "Blog Posts", value: "developers" },
          { name: "Status", value: "status" },
          { name: "All", value: "feed" }
        )
    ),
  execute: execute,
};

async function execute(interaction) {
  var pages = 20;
  var book = [];

  await interaction.deferReply({ ephemeral: true });
  await lodestonenews
    .get("news/" + interaction.options.getString("category"))
    .then((response) => {
      for (let index = 0; index < pages && index < response.length; index++) {
        const page = response[index];

        var print = new EmbedBuilder();

        var colour =
          page.category != null
            ? lodestoneReferenceTable[page.category].colour
            : lodestoneReferenceTable[interaction.options.getString("category")].colour;
        var title =
          page.category != null
            ? "Lodestone News ( " + lodestoneReferenceTable[page.category].name + " )"
            : "Lodestone News ( " + lodestoneReferenceTable[interaction.options.getString("category")].name + " )";

        print.setColor(colour);
        print.setTitle(title);
        print.setURL(page.url);
        print.setDescription(page.title);
        if (page.image != null) print.setImage(page.image);
        print.setFooter({
          text: page.time,
        });

        book.push(print);
      }

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
    })
    .catch((exception) => {
      interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
    });
}

const lodestoneReferenceTable = {
  topics: {
    colour: "#3480eb",
    name: "Topic",
  },
  notices: {
    colour: "#ebe834",
    name: "Notice",
  },
  updates: {
    colour: "#34eb52",
    name: "Update",
  },
  maintenance: {
    colour: "#eb3434",
    name: "Maintenance",
  },
  status: {
    colour: "#eb8634",
    name: "Status",
  },
  developers: {
    colour: "#34ebe5",
    name: "Developer Post",
  },
};
