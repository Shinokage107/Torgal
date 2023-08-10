const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ffxivCollect } = require("../../api/api.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder().setName("ffxiv").setDescription("Shows completion stats of your FFXIV character."),

  async execute(interaction) {
    await interaction.deferReply();
    await ffxivCollect
      .get("users/" + interaction.user.id.toString())
      .then((response) => {
        var characterData;
        characterData = response;

        var mountPercentage = ((characterData.mounts.count / characterData.mounts.total) * 100).toFixed(2);
        var minionPercentage = ((characterData.minions.count / characterData.minions.total) * 100).toFixed(2);
        var achievementPercentage = ((characterData.achievements.count / characterData.achievements.total) * 100).toFixed(2);
        var verified = characterData.verified ? " <:tickyes:1139024765621903452>" : " <:tickno:1139024530808000582>";

        const showCaseEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(characterData.name + "@" + characterData.server)
          .setDescription("Verified: " + verified)
          .setThumbnail(characterData.avatar)
          .addFields({
            name: "Mounts",
            value: "<:cavalry:839189024652001370> " + mountPercentage + " %",
            inline: true,
          })
          .addFields({
            name: "Minions",
            value: "<:hellion:839189024584368189> " + minionPercentage + " %",
            inline: true,
          })
          .addFields({
            name: "Achievements",
            value: "<:sorcerer:839189024585154580> " + achievementPercentage + " %",
            inline: true,
          })
          .setFooter({
            text: characterData.last_parsed,
          });

        interaction.followUp({ embeds: [showCaseEmbed] });
      })
      .catch((exception) => {
        if (exception.response.data.status == 404) interaction.followUp(exception.response.data.error);
        else interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
      });
  },
};
