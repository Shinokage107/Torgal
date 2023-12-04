const { SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { ffxivCollect } = require("../../src/api.js");
const db = require("../../src/db.js");
const { Pagination } = require("@acegoal07/discordjs-pagination");
const themes = require("../../src/themes.json");

module.exports = {
  type: "dev",
  data: new SlashCommandBuilder().setName("test").setDescription("Test command"),
  execute: execute,
};

async function execute(interaction) {
  await interaction.deferReply();

  randomTheme = themes[Math.floor(Math.random() * 1000)];

  interaction.followUp(randomTheme);
}
