const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const db = require("../../src/db.js");
const themes = require("../../src/themes.json");

module.exports = {
  type: "user",
  data: new SlashCommandBuilder()
    .setName("theme")
    .setDescription("Configures Random Themes on Interval.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create_interval")
        .setDescription("Creates a new Interval")
        .addIntegerOption((option) =>
          option
            .setName("interval")
            .setDescription("The Interval in wich a random Topic is picked.")
            .setRequired(true)
            .addChoices({ name: "Monday/Weekly", value: 1 }, { name: "1st/Monthly", value: 2 })
        )
    )
    .addSubcommand((subcommand) => subcommand.setName("check").setDescription("Checks if this channel has an Interval and if so wich one."))
    .addSubcommand((subcommand) => subcommand.setName("cancel_interval").setDescription("Cancels this channels Interval"))
    .addSubcommand((subcommand) => subcommand.setName("roll").setDescription("Rolls a new Theme for this channel."))
    .setDMPermission(false),

  execute: execute,
  interval: interval,
};

async function execute(interaction) {
  await interaction.deferReply();

  if (interaction.options.getSubcommand() === "create_interval") {
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const interval = interaction.options.getInteger("interval");
      result = await db.createInterval(interaction.channel.id, interval);
      await interaction.followUp("**Successfully** created an Interval for you :3");
    } else {
      await interaction.followUp("U do not have the Permission");
    }
  }

  if (interaction.options.getSubcommand() === "check") {
    result = await db.getRowBy("themeOnInterval_tbl", "channel_id", interaction.channel.id);

    if (result != false) {
      threadLink = "No active thread! Use **'/theme roll'** to create a new thread and theme";
      let interval = "This channel does not have an active interval.";

      if (result.currentThread_id != 0) threadLink = `This is the latest thread -> <#${result.currentThread_id}>`;

      if (result.interval_id == 0) interval = "This channel does not have an active interval.";
      if (result.interaction_id == 1) interval = "This channel has an active interval every **Monday**";
      if (result.interaction_id == 2) interval = "This channel has an active interval every **1st in a Month**";

      await interaction.followUp(`${interval} \n${threadLink}`);
    } else {
      await interaction.followUp("I **was not** able to find any interval or an error occured.");
    }
  }

  if (interaction.options.getSubcommand() === "cancel_interval") {
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      result = await db.deleteInterval(interaction.channel.id);
      await interaction.followUp("I **deleted** any Intervel connected to this channel :3");
    } else {
      await interaction.followUp("U do not have the Permission");
    }
  }
  if (interaction.options.getSubcommand() === "roll") {
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await rollTheme(interaction.channel);

      await interaction.followUp(`The Theme for the following interval is: **"${randomTheme}"** \nCreated: **${date}**`);
    } else {
      await interaction.followUp("U do not have the Permission");
    }
  }
}

async function rollTheme(channel) {
  currentThread_id = await db.get("themeOnInterval_tbl", "currentThread_id", "channel_id", channel.id);

  if (currentThread_id != false) {
    currentThread_id = currentThread_id.currentThread_id;
    if (currentThread_id != 0) {
      const thread = await channel.threads.cache.find((x) => x.id === currentThread_id);
      await thread.setLocked(true);
    }
  }

  date = new Date().toDateString();

  randomTheme = themes[Math.floor(Math.random() * 1000)];

  const thread = await channel.threads.create({
    name: randomTheme,
    autoArchiveDuration: 4320,
  });

  await db.createThread(channel.id, thread.id);
}

async function interval(id, client) {
  result = await db.query(`SELECT * FROM themeOnInterval_tbl WHERE interval_id=${id}`);
  if (result.length > 0) {
    for (let index = 0; index < result.length; index++) {
      const element = result[index].channel_id;
      const channel = await client.channels.fetch(`${element}`);
      rollTheme(channel);
    }
  }
}
