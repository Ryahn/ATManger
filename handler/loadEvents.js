const clientEvent = (event) => require(`../events/client/${event}`);
const guildEvent = (event) => require(`../events/guild/${event}`);
const Discord = require("discord.js");

function loadEvents(client) {
  const cooldowns = new Discord.Collection();

  // client events
  client.on("ready", () => clientEvent("ready")(client));
  client.on("messageCreate", (m) => clientEvent("mention")(m, client));

  // guild events
  client.on('interactionCreate', (m) => guildEvent("interactionCreate")(m, client));
  client.on("messageCreate", (m) => guildEvent("command")(m, cooldowns));
  client.on('messageDelete', (m) => guildEvent("messageDelete")(m))
  client.on("messageUpdate", (m, n) => guildEvent("messageUpdate")(m, n));
  client.on("channelCreate", (m) => guildEvent("channelCreate")(m));
  client.on("channelDelete", (m) => guildEvent("channelDelete")(m));
  client.on("roleCreate", (m) => guildEvent("roleCreate")(m));
  client.on("roleDelete", (m) => guildEvent("roleDelete")(m));
  client.on("channelUpdate", (m, n) => guildEvent("channelUpdate")(m, n));
  client.on("roleUpdate", (m, n) => guildEvent("roleUpdate")(m, n));
  client.on("guildMemberUpdate", (m, n) => guildEvent("guildMemberUpdate")(m, n));
  client.on("guildMemberAdd", (m) => guildEvent("guildMemberAdd")(m));
  client.on("guildMemberRemove", (m) => guildEvent("guildMemberRemove")(m));
  client.on("guildBanAdd", (m) => guildEvent("guildBanAdd")(m));
  client.on("guildBanRemove", (m) => guildEvent("guildBanRemove")(m));
  client.on("guildUpdate", (m, n) => guildEvent("guildUpdate")(m, n));
  client.on('threadUpdate', (m, n) => guildEvent('threadUpdate')(m, n, client));
  client.on('threadMembersUpdate', (m, n) => guildEvent('threadMembersUpdate')(m, n, client));
  client.on('threadCreate', (m) => guildEvent('threadCreate')(m, client));
  client.on('threadDelete', (m) => guildEvent('threadDelete')(m, client));


  // warnings and errors
  client.on("warn", (info) => console.log(info));
  client.on("error", console.error);
}

module.exports = {
  loadEvents,
};
