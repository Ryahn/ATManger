const discord = require("discord.js"),
 {strikes,whitelist} = require("../../database/guildData"),
 {OWNER_ID} = require('../../config.json'),
 logger = require('../../functions/Logger/Logger'),
path = require("path"),
scriptName = path.basename(__filename);

module.exports = {
  name: "unstrike",
  description: "Remove a strike from a staff member",
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

    if (args[0] == client.user.id) {
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

    if (interaction.user.id === interaction.options.getUser("user").id) {
      await interaction.reply({
        content: "You can't give yourself a stike nup....",
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

    const sUser = interaction.options.getUser('user');
    

    let data = {
      userID: sUser.id,
    };

    const checkForUser = await strikes.exists(data);
    if (checkForUser) {
        strikes.find({userID: sUser.id}).sort({createdAt: -1}).limit(1).exec( (err, data) => {
            strikes.deleteOne({_id: data._id});
            return interaction.reply({
                content: `User ${sUser.username}#${sUser.discriminator} had 1 strike removed!`,
                ephemeral: false,
            });
        });
    }
    return interaction.reply({
        content: `User ${sUser.username}#${sUser.discriminator} does not have any strikes!`,
        ephemeral: false,
      });
  },
};
