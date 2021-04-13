const db = require('quick.db');
module.exports = {
	name: 'prefix',
	description: 'Use This Command To Change Bot Prefix!',
	usage: `Prefix <New Prefix>`,
	category: 'Admin',
	admin: true,
	aliases: ['setprefix'],
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
		if (!args[0]) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊Please Give Me The Prefix That You Want To Set!`
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
							`<a:ERROR:${erroremoji}>┊You Cannot Set Prefix More Than 1 Argument!`
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
		if (args[0].length > 2) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊You Cannot Set Prefix More Than 2 Characters!`
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
		if (args[0] === db.get(`prefix_${message.guild.id}`)) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊You Cannot Set Current Prefix As New Prefix!`
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
		db.delete(`prefix_${message.guild.id}`);
		db.set(`prefix_${message.guild.id}`, args[0]);
		await message.author
			.send(
				embed
					.setColor(`${colour}`)
					.setDescription(
						`<a:SUCCESSFULL:${sucessemoji}>┊Sucessfully Set To New Prefix.\n<a:ARROW:${arrowemoji}>┊Now Your Prefix Is \**${
							args[0]
						}\**`
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
