require("dotenv").config();
const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env.BOT_TOKEN);

// for guild commands
rest
  .put(Routes.applicationGuildCommands(process.env.OAUTH2_CLIENT_ID, process.env.TEST_SERVER), { body: [] })
  .then(() => console.log("Successfully deleted all guild commands."))
  .catch(console.error);

// for global commands
rest
  .put(Routes.applicationCommands(process.env.OAUTH2_CLIENT_ID), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);
