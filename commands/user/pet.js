const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  type: "user",
  data: new SlashCommandBuilder().setName("pet").setDescription("Pet torgal!"),

  async execute(interaction) {
    await interaction.deferReply();

    var number = getRandomInt(links.length);

    await interaction.followUp(links[number]);
  },
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const links = [
  "https://images-ext-2.discordapp.net/external/SbMMg5khyMeaKv2xK57qtV8BOXnZnMgeJCynQqpaqTs/https/media.tenor.com/244r7kU5Y_YAAAAC/torgal-clive-rosfield.gif",
  "https://media.tenor.com/4HQ6vlnN32MAAAAC/torgal-torgal-puppy.gif",
  "https://media.tenor.com/v_i2K_i_EVYAAAAC/torgal.gif",
  "https://64.media.tumblr.com/1a3dbb9815823e99f15594fba75c5e78/f0436a6f64389d9a-1e/s1280x1920/4f6cc810c157f5feac945ea9f4813d091e036d50.gif",
  "https://64.media.tumblr.com/569d2cd450cffe73f13de5987a329678/86454588dc55e6c4-07/s540x810/0f929df6e7c2511b6f4d9276e98b110071cd1074.gif",
];
