const discord = require("discord.js");
const whitelist = require("../../database/guildData/whitelist");
const { OWNER_ID } = require("../../config.json");
const logger = require("../../functions/Logger/Logger");

module.exports = {
  name: "unwhitelist",
  description: "Remove a staff member from whitelist",
  options: [
    {
      name: "user",
      description: "username",
      type: "USER",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    if (args == client.user.id) {
      await interaction.reply({
        content: "User must not be a bot",
        ephemeral: true,
      });
      return;
    }

    if (interaction.user.bot) {
      await interaction.reply({
        content: "User must not be a bot",
        ephemeral: true,
      });
      return;
    }

    logger.info(
        "[USER]",
        `${interaction.user.username}#${interaction.user.discriminator} ran unwhitelist`
      );

    const checkUser = await whitelist.exists({ userID: interaction.user.id });
    if (!checkUser && interaction.user.id != OWNER_ID) {
      interaction.reply({
        content: "You are not permitted to run this command!",
        ephemeral: true,
      });
      return;
    }

    let data = {
      userID: interaction.options.getUser("user").id,
    };

    const newUser = interaction.options.getUser("user");

    const whitelsitUser = await whitelist.exists(data);
    if (whitelsitUser) {
      await whitelist.deleteOne({userID: data.userID});
      return interaction.reply({
        content: `User ${newUser.username}#${newUser.discriminator} has been remove from whitelist!`,
        ephemeral: true,
      });
    }
    interaction.reply({
      content: `User not whitelisted!`,
      ephemeral: true,
    });
  },
};
