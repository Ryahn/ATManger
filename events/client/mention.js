
module.exports = async (message, client) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES"))
    return;

  const { DEFAULT_PREFIX } = require("../../config.json")

  client.prefix = DEFAULT_PREFIX;

  // mentioned bot
  if (message.content ===`<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
    return message.channel.send(
      `My prefix in this server is \`${DEFAULT_PREFIX}\`\n\nTo get a list of commands, type \`${DEFAULT_PREFIX}help\``
    );
  }
};
