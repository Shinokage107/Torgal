const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  type: "dev",
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping pong command but only for dev"),

  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
