const {discord, MessageEmbed} = require("discord.js"),
 {staffjail, whitelist} = require('../../database/guildData'),
 {OWNER_ID} = require('../../config.json'),
 logger = require("../../functions/Logger/Logger"),
 {avatar} = require('../../functions/util/Util'),
path = require("path"),
scriptName = path.basename(__filename);

module.exports = {
    name: "jail",
    description: "Put a staff member in jail",
    options: [
        {
            name: "user",
            description: "username",
            type: 'USER',
            required: true
        },
        {
            name: "reason",
            description: "Reason for jail",
            type: "STRING",
            require: true
        }

    ],
    run: async (client, interaction, args) => {
        if(!args[0] || !args[1]) {
            await interaction.reply({
                content: "All options are require!",
                ephemeral: true,
              });
              return;
        }
        if (args == client.user.id) {
            await interaction.reply({ content: "User must not be a bot", ephemeral: true });
            return;
        }

        if (interaction.user.bot) {
            await interaction.reply({ content: "User must not be a bot", ephemeral: true });
            return;
        }

        if (interaction.user.id === interaction.options.get('user').value) {
            await interaction.reply({ content: "You can't jail yourself nup....", ephemeral: true });
            return;
        }

        const wUser = await whitelist.exists({ userID: interaction.user.id });
        if (!wUser && interaction.user.id != OWNER_ID) {
            logger.info(
                "[USER]",
                `${interaction.user.username}#${interaction.user.discriminator} ran ${scriptName} but was not permitted`
              );
            await interaction.reply({ content: "You are not permitted to use this command!", ephemeral: true });
            return;
        }
        logger.info(
            "[USER]",
            `${interaction.user.username}#${interaction.user.discriminator} ran ${scriptName}`
          );

        const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        const roles = member.roles.cache.map(r => r.id);
        const sUser = interaction.options.getUser("user");
        const staff = interaction.user;
        
        let data = {
            userID: interaction.options.getUser("user").id,
            reason: interaction.options.get("reason").value,
            oldRoles: roles,
            guildID: interaction.guildId,
            staffID: interaction.user.id,
        };
        const jData = await staffjail.exists({ userID: data.userID });

        if (!jData) {
            let newJail = new staffjail(data);
            await newJail.save();
            member.roles.remove(roles);
            const role = interaction.guild.roles.cache.find(role => role.name === "Staff Mute");
            member.roles.add(role);

            const jailEmbed = new MessageEmbed()
            .setTitle(`User ${sUser.username}#${sUser.discriminator} jailed!`)
            .setAuthor({
                name: `${sUser.username}#${sUser.discriminator}`,
                iconURL: avatar(sUser.avatar, sUser.id),
            })
            .setDescription(
                `User ${sUser.username}#${sUser.discriminator} may not past go and collect $200.`
            )
            .setImage('https://atmanger.nyc3.digitaloceanspaces.com/img/jail.png')
            .addField(`By: ${staff.username}#${staff.discriminator}`, `Reason: ${data.reason}`)
            .setTimestamp()
            .setFooter({ text: "AT Manger Bot. By AinzOoalGown#3496" });

            return interaction.reply({
                embeds: [jailEmbed]
            });
        }
        await interaction.reply({
            content: `User already jailed!`,
            ephemeral: true
        });
    },
};
