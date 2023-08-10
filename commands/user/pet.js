const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder().setName("pet").setDescription("Pet torgal!"),

  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp(
      "https://images-ext-2.discordapp.net/external/SbMMg5khyMeaKv2xK57qtV8BOXnZnMgeJCynQqpaqTs/https/media.tenor.com/244r7kU5Y_YAAAAC/torgal-clive-rosfield.gif"
    );
  },
};
