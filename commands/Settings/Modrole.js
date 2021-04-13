const db = require('quick.db');
module.exports = {
	name: 'modrole',
	description: 'Use This Command To Set Server Modrole!',
	usage: `Modrole <@Your Moderole>`,
	category: 'Settings',
	permissions: ["ADMINISTRATOR"],
	aliases: ['setmodrole'],
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
		const modrole = message.mentions.roles.first();
		if (!args[0]) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊Please Give Me Modrole That You Want To Set!`
						)
						.setAuthor(nickname, message.author.displayAvatarURL())
						.setFooter(
							`┊${commandname}┊  ${client.user.username}`,
							client.user.displayAvatarURL()
						)
				)
				.then(m => {
					m.delete({ timeout: 60000 }).catch(() => undefined);
				});
		}
		if (!modrole) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊Please Give Me Valid Modrole That You Want To Set!`
						)
						.setAuthor(nickname, message.author.displayAvatarURL())
						.setFooter(
							`┊${commandname}┊  ${client.user.username}`,
							client.user.displayAvatarURL()
						)
				)
				.then(m => {
					m.delete({ timeout: 60000 }).catch(() => undefined);
				});
		}
		if (args[1]) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊You Cannot Set Modrole More Than 1 Argument!`
						)
						.setAuthor(nickname, message.author.displayAvatarURL())
						.setFooter(
							`┊${commandname}┊  ${client.user.username}`,
							client.user.displayAvatarURL()
						)
				)
				.then(m => {
					m.delete({ timeout: 60000 }).catch(() => undefined);
				});
		}
		db.delete(`modrole_${message.guild.id}`);
		db.set(`modrole_${message.guild.id}`, modrole.id);
		await message.author
			.send(
				embed
					.setColor(`${colour}`)
					.setDescription(
						`<a:SUCCESSFULL:${sucessemoji}>┊Sucessfully Set To New Modrole.\n<a:ARROW:${arrowemoji}>┊Now Your Modrole Is \**${modrole}\**`
					)
					.setAuthor(nickname, message.author.displayAvatarURL())
					.setFooter(
						`┊${commandname}┊  ${client.user.username}`,
						client.user.displayAvatarURL()
					)
			)
			.then(m => {
				m.delete({ timeout: 60000 }).catch(() => undefined);
			});
	}
};
