const discord = require("discord.js"),
 whitelist = require("../../database/guildData/whitelist"),
 { OWNER_ID } = require("../../config.json"),
 logger = require("../../functions/Logger/Logger"),
path = require("path"),
scriptName = path.basename(__filename);

module.exports = {
  name: "whitelist",
  description: "Whitelist a staff member to just jail",
  options: [
    {
      name: "user",
      description: "username",
      type: "USER",
      required: true,
    },
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

    const checkUser = await whitelist.exists({ userID: interaction.user.id });
    if (!checkUser && interaction.user.id != OWNER_ID) {
      logger.info(
        "[USER]",
        `${interaction.user.username}#${interaction.user.discriminator} ran jail but was not permitted`
      );
      interaction.reply({
        content: "You are not permitted to run this command!",
        ephemeral: true,
      });
      return;
    }
    logger.info(
      "[USER]",
      `${interaction.user.username}#${interaction.user.discriminator} ran ${scriptName}`
    );

    let data = {
      userID: interaction.options.getUser("user").id,
    };

    const newUser = interaction.options.getUser("user");

    const whitelsitUser = await whitelist.exists(data);
    if (!whitelsitUser) {
      let newWhitelist = new whitelist(data);
      newWhitelist.save();
      return interaction.reply({
        content: `User ${newUser.username}#${newUser.discriminator} has been whitelisted!`,
        ephemeral: true,
      });
    }
    interaction.reply({
      content: `User already whitelisted!`,
      ephemeral: true,
    });
  },
};
