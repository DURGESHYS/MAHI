const Discord = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
	name: 'help',
	description: 'Use This Command To Get Command info!',
	usage: `Help <Command Name>`,
	category: 'Info',
	permissions: false,
	aliases: ['h'],
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
		//        const roleColor =
		//      message.guild.me.displayHexColor === "#000000"
		//        ? "#ffffff"
		//        : message.guild.me.displayHexColor;

		if (!args[0]) {
			let categories = [];
			//    categories emojies
			const emocat = {};
			//    hidden categories
			const hidcat = ["Owner"];
			readdirSync('./commands/').forEach(dir => {
				if (hidcat.includes(dir)) return;
				const ename = `${emocat[dir]} ${dir.toUpperCase()}`;
				const commands = readdirSync(`./commands/${dir}/`).filter(file =>
					file.endsWith('.js')
				);

				const cmds = commands
					.filter(command => {
						let file = require(`../../commands/${dir}/${command}`);
						return !file.hidden;
					})
					.map(command => {
						let file = require(`../../commands/${dir}/${command}`);

						if (!file.name) return 'No command name.';

						let name = file.name.replace('.js', '');

						return `\`${name}\``;
					});

				let data = new Object();
				data = {
					name: ename,
					value: cmds.length === 0 ? 'In progress.' : cmds.join(`, `)
				};

				categories.push(data);
			});
			return message.author
				.send(
					embed
						.setAuthor(nickname, message.author.displayAvatarURL())
						.setFooter(
							`┊BOT┊HELP┊  ${client.user.username}`,
							client.user.displayAvatarURL()
						)
						.addFields(categories)
						.setDescription(
							`<a:ARROW:${arrowemoji}>┊Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help prefix\`.`
						)
						.setColor(`${colour}`)
				)
				.then(m => {
					m.delete({ timeout: 60000 }).catch(() => undefined);
				});
		} else {
			const command =
				client.commands.get(args[0].toLowerCase()) ||
				client.commands.find(
					c => c.aliases && c.aliases.includes(args[0].toLowerCase())
				);

			if (!command) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setFooter(
								`┊BOT┊HELP┊  ${client.user.username}`,
								client.user.displayAvatarURL()
							)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Invalid command! Use \`${prefix}help\` for all of my commands!`
							)
							.setColor(`${colour}`)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			let CommandName =
				command.name.charAt(0).toUpperCase() + command.name.slice(1);
			return message.author
				.send(
					embed
						.setAuthor(nickname, message.author.displayAvatarURL())
						.setFooter(
							`┊BOT┊HELP┊  ${client.user.username}`,
							client.user.displayAvatarURL()
						)
						.addField(`<a:ARROW:${arrowemoji}>┊PREFIX:`, `\`${prefix}\``)
						.addField(
							`<a:ARROW:${arrowemoji}>┊COMMAND NAME:`,
							command.name ? `\`${CommandName}\`` : 'No name for this command.'
						)
						.addField(
							`<a:ARROW:${arrowemoji}>┊PERMISSIONS:`,

							command.permissions
								? `\`${command.permissions.join('`, `')}\``
								: 'No Permissions for this command.'
						)
						.addField(
							`<a:ARROW:${arrowemoji}>┊ALIASES:`,
							command.aliases
								? `\`${command.aliases.join('`, `')}\``
								: 'No aliases for this command.'
						)
						.addField(
							`<a:ARROW:${arrowemoji}>┊USAGE:`,
							command.usage
								? `\`${prefix} ${command.usage}\``
								: `\`${prefix}${command.name}\``
						)
						.addField(
							`<a:ARROW:${arrowemoji}>┊DESCRIPTION:`,
							command.description
								? command.description
								: 'No description for this command.'
						)
						.setColor(`${colour}`)
				)
				.then(m => {
					m.delete({ timeout: 60000 }).catch(() => undefined);
				});
		}
	}
};
