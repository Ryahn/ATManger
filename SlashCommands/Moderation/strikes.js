const { discord, MessageEmbed } = require("discord.js"),
  { strikes, staffjail, whitelist } = require("../../database/guildData"),
  { avatar } = require("../../functions/util/Util"),
  mime = require("mime-types"),
  { OWNER_ID } = require("../../config.json"),
  logger = require("../../functions/Logger/Logger"),
  path = require("path"),
  scriptName = path.basename(__filename);

module.exports = {
  name: "strikes",
  description: "Get strikes of a staff member",
  options: [
    {
      name: "user",
      description: "username",
      type: "USER",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
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

    const sUser = interaction.options.getUser("user");

    let data = {
      userID: sUser.id,
    };

    const checkForUser = await strikes.exists(data);
    if (!checkForUser) {
      return interaction.reply({
        content: `User ${sUser.username}#${sUser.discriminator} does not have any strikes!`,
        ephemeral: false,
      });
    }
    strikes
      .find({ userID: sUser.id })
      .sort({ createdAt: 1 })
      .exec((err, data) => {
        const strikeEmbed = new MessageEmbed()
          .setTitle(`Strikes for ${sUser.username}#${sUser.discriminator}`)
          .setAuthor({
            name: `${sUser.username}#${sUser.discriminator}`,
            iconURL: avatar(sUser.avatar, sUser.id),
          })
          .setDescription(
            `Strikes for ${sUser.username}#${sUser.discriminator}`
          );

        data.forEach((strike) => {
          let staff = interaction.guild.members.cache.get(strike.staffID).user;

          strikeEmbed.addField(
            `ID: ${strike._id} | By: ${staff.username}#${staff.discriminator}`,
            `${strike.reason} | [Evidence](${strike.evidence})`,
            true
          );
        });

        strikeEmbed
          .setTimestamp()
          .setFooter({ text: "AT Manger Bot. By AinzOoalGown#3496" });

        return interaction.reply({
          embeds: [strikeEmbed],
        });
      });
  },
};
