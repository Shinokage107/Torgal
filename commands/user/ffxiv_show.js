const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ffxivCollect } = require("../../api/api.js");
const path = require("path");
module.exports = {
  type: "dev",
  data: new SlashCommandBuilder()
    .setName("ffxiv")
    .setDescription("Shows completion stats of your FFXIV character.")
    .addUserOption((option) => option.setName("user").setDescription("@Discord User"))
    .addIntegerOption((option) =>
      option
        .setName("patch")
        .setDescription("Selected Patch")
        .addChoices(
          { name: "Endwalker", value: 6 },
          { name: "Shadowbringer", value: 5 },
          { name: "Stormblood", value: 4 },
          { name: "Heavensward", value: 3 },
          { name: "A Realm Reborn", value: 2 }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    var userId = interaction.options.getUser("user") != null ? interaction.options.getUser("user") : interaction.user.id;
    var mountPercentage;
    var minionPercentage;
    var achievementPercentage;
    var bluePercentage;
    var relicsPercentage;
    var orchestPersentage;

    await ffxivCollect
      .get("users/" + userId)
      .then(async (response) => {
        var characterData;
        characterData = response;
        const decimalCount = 2;

        if (interaction.options.getInteger("patch") != null) {
          patch = interaction.options.getInteger("patch");
          mountPercentage = await fillterPercentage(userId, "mounts", patch, decimalCount);
          achievementPercentage = await fillterPercentage(userId, "achievements", patch, decimalCount);
          minionPercentage = await fillterPercentage(userId, "minions", patch, decimalCount);
          bluePercentage = await fillterPercentage(userId, "spells", patch, decimalCount);
          relicsPercentage = await fillterPercentage(userId, "relics", patch, decimalCount);
        } else {
          mountPercentage = ((characterData.mounts.count / characterData.mounts.total) * 100).toFixed(decimalCount);
          minionPercentage = ((characterData.minions.count / characterData.minions.total) * 100).toFixed(decimalCount);
          achievementPercentage = ((characterData.achievements.count / characterData.achievements.total) * 100).toFixed(decimalCount);
          bluePercentage = ((characterData.spells.count / characterData.spells.total) * 100).toFixed(decimalCount);
          relicsPercentage = (
            ((characterData.relics.weapons.count + characterData.relics.tools.count + characterData.relics.armor.count) /
              (characterData.relics.weapons.total + characterData.relics.tools.total + characterData.relics.armor.total)) *
            100
          ).toFixed(decimalCount);
          orchestPersentage = ((characterData.orchestrions.count / characterData.orchestrions.total) * 100).toFixed(decimalCount);
        }

        var completionPercentage = (
          (parseFloat(mountPercentage) +
            parseFloat(minionPercentage) +
            parseFloat(achievementPercentage) +
            parseFloat(bluePercentage) +
            parseFloat(relicsPercentage)) /
          5
        ).toFixed(decimalCount);

        var verified = characterData.verified ? " <:tickyes:1139024765621903452>" : " <:tickno:1139024530808000582>";
        var footer = characterData.verified ? " " : " This Character is not Verified!";

        var completionType =
          interaction.options.getInteger("patch") != null
            ? "Patch Completion **" + interaction.options.getInteger("patch") + ".0** : "
            : "Overall Completion: ";

        const showCaseEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(characterData.name + "@" + characterData.server)
          .setURL("https://ffxivcollect.com/characters/" + characterData.id)
          .setDescription("<@" + userId + "> " + verified + "\n" + completionType + completionPercentage + " %")
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
          .addFields({
            name: "Blue",
            value: "<:coven:839189024518176779> " + bluePercentage + " %",
            inline: true,
          })
          .addFields({
            name: "Relics",
            value: "<:redeemed:839189024610320384> " + relicsPercentage + " %",
            inline: true,
          })
          // .addFields({
          //   name: "Orchestrions",
          //   value: "<:invoker:839189024529973259> " + orchestPersentage + " %",
          //   inline: true,
          // })
          .setFooter({
            text: characterData.last_parsed + footer,
          });

        interaction.followUp({ embeds: [showCaseEmbed] });
      })
      .catch((exception) => {
        console.log(exception);
        if (exception.response.data.status == 404) interaction.followUp(exception.response.data.error);
        else interaction.followUp("Something went wrong <:tickno:1139024530808000582>");
      });
  },
};

async function fillterPercentage(userId, filter, condition, decimalCount) {
  var owned;
  await ffxivCollect.get("users/" + userId + "/" + filter + "/owned").then((response) => {
    owned = response;
  });

  await ffxivCollect.get("users/" + userId + "/" + filter + "/missing").then((response) => {
    missing = response;
  });

  var ownedFiltered = 0;
  var missingFiltered = 0;

  if (filter != "relics") {
    ownedFiltered = owned.filter((element) => Math.floor(element.patch) == condition).length;
    missingFiltered = missing.filter((element) => Math.floor(element.patch) == condition).length;
  } else if (filter == "relics") {
    ownedFiltered = owned.filter((element) => Math.floor(element.type.expansion) == condition).length;
    missingFiltered = missing.filter((element) => Math.floor(element.type.expansion) == condition).length;
  }

  var output = ((ownedFiltered / (ownedFiltered + missingFiltered)) * 100).toFixed(decimalCount);

  return isNaN(output) ? 100.0 : output;
}

// async function getPercentages(userId, filter, condition, decimalCount) {
//   var userResult;
//   await ffxivCollect.get("users/" + userId + "?ids=true").then((response) => {
//     userResult = response;
//   });

//   ownedMounts = userResult.mounts.ids;
//   mountsMinMax = await getPatchIDIndex(filter, condition);

//   var filteredMounts = await filterIds(ownedMounts, mountsMinMax);

//   console.log(filteredMounts);
// }

// async function filterIds(array, minMax) {
//   var min = minMax[0] != null ? minMax[0] : 0;
//   var max = minMax[1] != null ? minMax[1] : array[array.length - 1];

//   console.log(min, max);

//   const lowestHigh = array.find((n) => n > max - 1);
//   console.log(lowestHigh);
//   const within = (val) => val >= min && val < lowestHigh;

//   return array.filter(within).length;
// }

// async function getPatchIDIndex(filter, index) {
//   var mounts = [0, 50, 114, 170, 237];
//   var minions = [0, 128, 237, 336, 420];
//   var spells = [0, 0, 0, 50, 105];
//   var relics = [0, 16067, 24723, 30751, 38715];
//   var achievements = [0, 1208, 1883, 2377, 2980];

//   switch (filter) {
//     case "mounts":
//       return [mounts[index - 2], mounts[index - 1]];
//       break;
//     case "minions":
//       return [minions[index - 2], minions[index - 1]];
//     case "spells":
//       return [spells[index - 2], spells[index - 1]];
//       break;
//     case "relics":
//       return [relics[index - 2], relics[index - 1]];
//       break;
//     case "achievemnts":
//       return [achievements[index - 2], achievements[index - 1]];
//       break;
//     default:
//       break;
//   }
// }
