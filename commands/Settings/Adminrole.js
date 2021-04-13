const db = require('quick.db');
module.exports = {
	name: 'adminrole',
	description: 'Use This Command To Set Server Adminrole!',
	usage: `Adminrole <@Your Adminrole>`,
	category: 'Settings',
	permissions: ['ADMINISTRATOR'],
	aliases: ['setadminrole'],
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
		const adminrole = message.mentions.roles.first();
		if (!args[0]) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊Please Give Me The Adminrole That You Want To Set!`
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
		if (!adminrole) {
			return message.author
				.send(
					embed
						.setColor(`${colour}`)
						.setDescription(
							`<a:ERROR:${erroremoji}>┊Please Give Me Valid Adminrole That You Want To Set!`
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
							`<a:ERROR:${erroremoji}>┊You Cannot Set Adminrole More Than 1 Argument!`
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
		db.delete(`adminrole_${message.guild.id}`);
		db.set(`adminrole_${message.guild.id}`, adminrole.id);
		await message.author
			.send(
				embed
					.setColor(`${colour}`)
					.setDescription(
						`<a:SUCCESSFULL:${sucessemoji}>┊Sucessfully Set To New Adminrole.\n<a:ARROW:${arrowemoji}>┊Now Your Adminrole Is \**${adminrole.id}\**`
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
