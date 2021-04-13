const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
	name: 'embed',
	hidden: false,
	description: '',
	owner: true,
	usage: '',
	category: '',
	permissions: false,
	clientpermissions: false,
	aliases: [''],
	timeout: false,
	run: async (
		client,
		message,
		args,
		colour,
		commandname,
		embed,
		nickname,
		prefix,
		arrowemoji,
		erroremoji,
		sucessemoji,
		wrongemoji
	) => {
		if (args[0].toLowerCase() === 'title') {
			let title = args.slice(1).join(' ');
			if (!title) {
				return message.channel
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Title Required:\n<a:ARROW:${arrowemoji}>┊Usage: \` ${prefix}Embed title <your title>\`\n<a:ARROW:${arrowemoji}>┊Title Limit: 256 characters.`
							)
							.setFooter(
								`${commandname}  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setColor(`${colour}`)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (title.length >= 257) {
				return message.channel
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())

							.setFooter(
								`${commandname}  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Max Limit of Title: \`256\``
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (title.length <= 256) {
				db.delete(`title_${message.guild.id}`);
				db.set(`title_${message.guild.id}`, title);
				await message.channel
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())

							.setFooter(
								`${commandname}  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setColor(`${colour}`)
							.setDescription(
								`<a:SUCESS:${sucessemoji}>┊Title sucessfully set.\n<a:ARROW:${arrowemoji}>┊ **${title}**`
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
		}
		if (args[0].toLowerCase() === 'colour') {
			const Colour = args[1];
			if (!Colour) {
				return message.channel
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Colour Required:\n<a:ARROW:${arrowemoji}>┊Usage: \`${prefix}Embed colour <your colour>\``
							)
							.setFooter(
								`${commandname}  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setColor(`${colour}`)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (Colour != Colour.toUpperCase()) {
				return message.channel
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Colour must be Uppercase.\n<a:ARROW:${arrowemoji}>┊For Example: \`${prefix}Embed colour BLUE\``
							)
							.setFooter(
								`${commandname}  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setColor(`${colour}`)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (Colour) {
				db.delete(`color_${message.guild.id}`);
				db.set(`color_${message.guild.id}`, Colour);
				await message.channel
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setDescription(
								`<a:SUCESS:${sucessemoji}>┊Colour sucessfully set.\n<a:ARROW:${arrowemoji}>┊ **${Colour}**`
							)
							.setFooter(
								`${commandname}  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setColor(`${db.get(`color_${message.guild.id}`)}`)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
		}
		if (args[0].toLowerCase() === 'sent') {
			if (db.get(`color_${message.guild.id}`) != null) {
				embed.setColor(db.get(`color_${message.guild.id}`));
			}
			if (db.get(`title_${message.guild.id}`) != null) {
				embed.setTitle(db.get(`title_${message.guild.id}`));
			}
			await message.channel.send(embed);
		}
	}
};
