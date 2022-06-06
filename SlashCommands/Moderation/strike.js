const discord = require("discord.js"),
 {strikes,staffjail,whitelist} = require("../../database/guildData"),
 {upload, delay, validImg} = require('../../functions/util/Util'),
 mime = require('mime-types'),
 {OWNER_ID, MAX_STRIKES} = require('../../config.json'),
 logger = require('../../functions/Logger/Logger'),
 path = require("path"),
scriptName = path.basename(__filename);

module.exports = {
  name: "strike",
  description: "Give a strike against a staff member",
  options: [
    {
      name: "user",
      description: "username",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Reason for strike",
      type: "STRING",
      require: true,
    },
    {
        name: "evidence",
        description: "Valid png, jpg, gif, mp4, mkv, webp, webm URL",
        type: "STRING",
        require: true,
      },
  ],
  run: async (client, interaction, args) => {

    if(!args[0] || !args[1] || !args[2]) {
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
    const URL = interaction.options.get('evidence').value;
    

    if(!validImg(URL)) {
        interaction.reply({
            content: `File type: ${mime.lookup(URL)} not allowed. Only png, gif, jpg, webp, webm, mkv, mp4 and mov!`,
            ephemeral: true,
          });
          return;
    }

    const evidenceURL = upload(URL);
    const member = interaction.guild.members.cache.get(sUser.id);
    const roles = member.roles.cache.map(r => r.id);

    let data = {
      userID: sUser.id,
      reason: interaction.options.get("reason").value,
      guildID: interaction.guildId,
      staffID: interaction.user.id,
      evidence: evidenceURL
    };

    let jData = {
      userID: sUser.id,
      reason: `Jailed due to ${MAX_STRIKES} strikes`,
      guildID: interaction.guildId,
      staffID: interaction.user.id,
      oldRoles: roles,
    };

    let newStrike = new strikes(data);
    await newStrike.save();
    const checkJail = await staffjail.exists({ userID: data.userID });
    await strikes.find({userID: data.userID}).exec( (err, res) => {
      if (res.length >= MAX_STRIKES && !checkJail) {
        let newJail = new staffjail(jData);
        newJail.save();
        member.roles.remove(roles);
        const role = interaction.guild.roles.cache.find(role => role.name === "Staff Mute");
        delay(500).then(() => member.roles.add(role));
        return interaction.reply({
        content: `User ${sUser.username}#${sUser.discriminator} jailed due to (${res.length}/${MAX_STRIKES}) strikes!`,
          ephemeral: false
        });
      }
      return interaction.reply({
        content: `User ${sUser.username}#${sUser.discriminator} has been given a strike! (${res.length}/${MAX_STRIKES})`,
        ephemeral: false
      });
    });
  },
};
