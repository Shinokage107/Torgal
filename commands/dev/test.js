const { SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { lodestonenews } = require("../../api/api.js");
module.exports = {
  type: "dev",
  data: new SlashCommandBuilder().setName("test").setDescription("Test command"),
  execute: execute,
};

async function execute(interaction) {
  var pages = 20;
  var book = [];

  await interaction.deferReply();
  await lodestonenews
    .get("news/topics")
    .then((response) => {})
    .catch((exception) => {
      interaction.reply("Something went wrong <:tickno:1139024530808000582>");
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
