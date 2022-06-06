const discord = require("discord.js"),
  moment = require("moment"),
  { staffjail, whitelist } = require("../../database/guildData"),
  { OWNER_ID } = require("../../config.json"),
  logger = require("../../functions/Logger/Logger"),
  path = require("path"),
  scriptName = path.basename(__filename);

module.exports = {
  name: "unjail",
  description: "Remove staff member from jail",
  options: [
    {
      name: "user",
      description: "username",
      type: "USER",
      required: true,
    }
  ],
  run: async (client, interaction, args) => {
    if(!args[0]) {
      await interaction.reply({
          content: "All options are require!",
          ephemeral: true,
        });
        return;
  }
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

    if (interaction.user.id === interaction.options.get("user").value) {
      await interaction.reply({
        content: "You can't unjail yourself nup....",
        ephemeral: true,
      });
      return;
    }

    const wUser = await whitelist.exists({ userID: interaction.user.id });
    if (!wUser && interaction.user.id != OWNER_ID) {
      logger.info(
        "[USER]",
        `${interaction.user.username}#${interaction.user.discriminator} ran jail but was not permitted`
      );
      await interaction.reply({
        content: "You are not permitted to use this command!",
        ephemeral: true,
      });
      return;
    }
    logger.info(
      "[USER]",
      `${interaction.user.username}#${interaction.user.discriminator} ran ${scriptName}`
    );

    const member = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );
    const roles = member.roles.cache.map((r) => r.id);
    const newUser = interaction.options.getUser("user");

    const jData = await staffjail.exists({ userID: newUser.id });
    const userData = await staffjail.findOne({ userID: newUser.id });

    if (jData) {
      await member.roles.remove(roles);
      member.roles.add(userData.oldRoles);
      await staffjail.deleteOne({ userID: newUser.id });
      return interaction.reply({
        content: `User ${newUser.username}#${newUser.discriminator} has been unjailed!`,
        ephemeral: false,
      });
    }
    await interaction.reply({
      content: `User not in jail!`,
      ephemeral: true,
    });
  },
};
