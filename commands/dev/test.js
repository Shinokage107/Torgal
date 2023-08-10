const { SlashCommandBuilder } = require("discord.js");
const { ffxivCollect } = require("../../api/api.js");
module.exports = {
  type: "dev",

  data: new SlashCommandBuilder().setName("test").setDescription("Test command"),

  async execute(interaction) {
    var mounts;
    await ffxivCollect.get("users/" + interaction.user.id.toString() + "/mounts/owned").then((response) => {
      console.log(response); // same response as in Fetch API
      mounts = response;
    });

    var message = "";
    mounts.forEach((mount) => {
      message += mount.name;
      message += ", ";
    });

    await interaction.reply(message);
  },
};
