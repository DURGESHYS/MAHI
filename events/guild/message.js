const Discord = require('discord.js');

const Timeout = new Set();

const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const config = require('../../botconfig.json');
const ms = require('ms');
const client = Discord.Client;
const default_prefix = config.DEFAULT_PREFIX;
const owner = process.env.BOTOWNER;
const Color = config.DEFAULT_COLOUR;
const erroremo = config.ERROREMOJI;
const sucessemo = config.SUCESSEMOJI;
const arrowemo = config.ARROWEMOJI;
const wrongemo = config.WRONGEMOJI;

module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === 'dm') return;
	let prefix = db.get(`prefix_${message.guild.id}`);
	if (prefix === null) {
		prefix = default_prefix;
	}
	let colour = db.get(`colour_${message.guild.id}`);

	if (colour === null) {
		colour = Color;
	}

	let erroremoji = db.get(`erroremoji_${message.guild.id}`);
	if (erroremoji === null) {
		erroremoji = erroremo;
	}
	let wrongemoji = db.get(`wrongemoji_${message.guild.id}`);
	if (wrongemoji === null) {
		wrongemoji = wrongemo;
	}
	let sucessemoji = db.get(`sucessemoji_${message.guild.id}`);
	if (sucessemoji === null) {
		sucessemoji = sucessemo;
	}
	let arrowemoji = db.get(`arrowemoji_${message.guild.id}`);
	if (arrowemoji === null) {
		arrowemoji = arrowemo;
	}
	let member = message.guild.member(message.author);
	let nickname = member ? member.displayName : message.author.username;
	const embed = new MessageEmbed();
	if (message.content === `<@${bot.user.id}>`) {
		if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {
			message.delete().catch(() => undefined);
		}
		return message.author
			.send(
				embed
					.setColor(`${colour}`)
					.setDescription(`<a:ARROW:${arrowemoji}>┊Bot Prefix Is \`${prefix}\``)
					.setAuthor(nickname, message.author.displayAvatarURL())
					.setFooter(
						`┊BOT┊PREFIX┊  ${bot.user.username}`,
						bot.user.displayAvatarURL()
					)
			)
			.then(m => {
				m.delete({ timeout: 60000 }).catch(() => undefined);
			});
	}
	const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const prefixRegex = new RegExp(
		`^(<@!?${bot.user.id}>|${escapeRegex(prefix)})\\s*`
	);

	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const server = message.guild;
	const args = message.content
		.slice(matchedPrefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	const command =
		bot.commands.get(cmd) ||
		bot.commands.find(a => a.aliases && a.aliases.includes(cmd));
	//    If cooldowns map doesn't have a command.name key then create one.
	if (command) {
		if (command.mod) {
			let modrole = db.get(`modrole_${member.guild.id}`);
			let adminrole = db.get(`adminrole_${member.guild.id}`);
			if (modrole && adminrole === null) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Please Add Admin && Mod Role First.`
							)
							.setFooter(
								`┊ADMIN && MOD┊ROLE┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (modrole === null) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Please Add Mod Role First.`
							)
							.setFooter(
								`┊MOD┊ROLE┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (adminrole === null) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Please Add Admin Role First.`
							)
							.setFooter(
								`┊ADMIN┊ROLE┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (
				!message.member.roles.cache.has(`${modrole}`) ||
				!message.member.roles.cache.has(`${adminrole}`) ||
				!message.member.hasPermission('ADMINISTRATOR') ||
				!message.author.id === owner
			) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Required Mod Role For This Command.`
							)
							.setFooter(
								`┊REQUIRE┊ROLE┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
		}
		if (command.admin) {
			let adminrole = db.get(`adminrole_${member.guild.id}`);
			if (adminrole === null) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Please Add Admin Role First.`
							)
							.setFooter(
								`┊ADMIN┊ROLE┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (
				!message.member.roles.cache.has(`${adminrole}`) ||
				!message.member.hasPermission('ADMINISTRATOR') ||
				!message.author.id === owner
			) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Required Admin Role For This Command.`
							)
							.setFooter(
								`┊REQUIRE┊ROLE┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
		}
		if (command.owner) {
			if (message.author.id != owner) {
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊Only Bot Owner Use This Command`
							)
							.setFooter(
								`┊BOT┊OWNER┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
		}
		if (command.permissions) {
			const validPermissions = [
				'CREATE_INSTANT_INVITE',
				'KICK_MEMBERS',
				'BAN_MEMBERS',
				'ADMINISTRATOR',
				'MANAGE_CHANNELS',
				'MANAGE_GUILD',
				'ADD_REACTIONS',
				'VIEW_AUDIT_LOG',
				'PRIORITY_SPEAKER',
				'STREAM',
				'VIEW_CHANNEL',
				'SEND_MESSAGES',
				'SEND_TTS_MESSAGES',
				'MANAGE_MESSAGES',
				'EMBED_LINKS',
				'ATTACH_FILES',
				'READ_MESSAGE_HISTORY',
				'MENTION_EVERYONE',
				'USE_EXTERNAL_EMOJIS',
				'VIEW_GUILD_INSIGHTS',
				'CONNECT',
				'SPEAK',
				'MUTE_MEMBERS',
				'DEAFEN_MEMBERS',
				'MOVE_MEMBERS',
				'USE_VAD',
				'CHANGE_NICKNAME',
				'MANAGE_NICKNAMES',
				'MANAGE_ROLES',
				'MANAGE_WEBHOOKS',
				'MANAGE_EMOJIS'
			];
			//--------------------BOT MEMBER PERMISSION START---------------------

			if (command.permissions.length) {
				let invalidPerms = [];
				for (const perm of command.permissions) {
					if (!validPermissions.includes(perm)) {
						return console.log(`Invalid Permissions ${perm}`);
					}
					if (!message.member.hasPermission(perm)) {
						invalidPerms.push(perm);
					}
				}
				if (invalidPerms.length) {
					if (
						message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
					) {
						message.delete().catch(() => undefined);
					}
					let CommandName =
						command.name.charAt(0).toUpperCase() + command.name.slice(1);
					return message.author
						.send(
							embed
								.setAuthor(nickname, message.author.displayAvatarURL())
								.setColor(`${colour}`)
								.setDescription(
									`<a:ERROR:${erroremoji}>┊Require Permissions for ${CommandName} Command:\n<a:ARROW:${arrowemoji}>┊\`${invalidPerms.join(
										', '
									)}\``
								)
								.setFooter(
									`┊MEMBER┊PERMISSIONS┊  ${bot.user.username}`,
									bot.user.displayAvatarURL()
								)
						)
						.then(m => {
							m.delete({ timeout: 60000 }).catch(() => undefined);
						});
				}
			}
		}
		if (command.botpermissions) {
			const validBotPermissions = [
				'CREATE_INSTANT_INVITE',
				'KICK_MEMBERS',
				'BAN_MEMBERS',
				'ADMINISTRATOR',
				'MANAGE_CHANNELS',
				'MANAGE_GUILD',
				'ADD_REACTIONS',
				'VIEW_AUDIT_LOG',
				'PRIORITY_SPEAKER',
				'STREAM',
				'VIEW_CHANNEL',
				'SEND_MESSAGES',
				'SEND_TTS_MESSAGES',
				'MANAGE_MESSAGES',
				'EMBED_LINKS',
				'ATTACH_FILES',
				'READ_MESSAGE_HISTORY',
				'MENTION_EVERYONE',
				'USE_EXTERNAL_EMOJIS',
				'VIEW_GUILD_INSIGHTS',
				'CONNECT',
				'SPEAK',
				'MUTE_MEMBERS',
				'DEAFEN_MEMBERS',
				'MOVE_MEMBERS',
				'USE_VAD',
				'CHANGE_NICKNAME',
				'MANAGE_NICKNAMES',
				'MANAGE_ROLES',
				'MANAGE_WEBHOOKS',
				'MANAGE_EMOJIS'
			];
			if (command.botpermissions.length) {
				let invalidBotPerms = [];
				for (const perm of command.botpermissions) {
					if (!validBotPermissions.includes(perm)) {
						return console.log(`Invalid Permissions ${perm}`);
					}
					if (!message.guild.me.hasPermission(perm)) {
						invalidBotPerms.push(perm);
					}
				}
				if (invalidBotPerms.length) {
					if (
						message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
					) {
						message.delete().catch(() => undefined);
					}
					let CommandName =
						command.name.charAt(0).toUpperCase() + command.name.slice(1);
					return message.author
						.send(
							embed
								.setAuthor(nickname, message.author.displayAvatarURL())
								.setColor(`${colour}`)
								.setDescription(
									`<a:ERROR:${erroremoji}>┊Require Bot Permissions for ${CommandName} Command:\n<a:ARROW:${arrowemoji}>┊\`${invalidBotPerms.join(
										', '
									)}\``
								)
								.setFooter(
									`┊BOT┊PERMISSIONS┊  ${bot.user.username}`,
									bot.user.displayAvatarURL()
								)
						)
						.then(m => {
							m.delete({ timeout: 60000 }).catch(() => undefined);
						});
				}
			}
		}
		if (command.timeout) {
			if (Timeout.has(`${message.author.id}${command.name}`)) {
				if (
					message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
				) {
					message.delete().catch(() => undefined);
				}
				let CommandName =
					command.name.charAt(0).toUpperCase() + command.name.slice(1);
				return message.author
					.send(
						embed
							.setAuthor(nickname, message.author.displayAvatarURL())
							.setColor(`${colour}`)
							.setDescription(
								`<a:ERROR:${erroremoji}>┊You can only use \`${CommandName}\` command every \`${ms(
									command.timeout
								)}!\``
							)
							.setFooter(
								`┊COMMAND┊COOLDOWN┊  ${bot.user.username}`,
								bot.user.displayAvatarURL()
							)
					)
					.then(m => {
						m.delete({ timeout: 120000 }).catch(() => undefined);
					});
			} else {
				if (
					message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
				) {
					message.delete().catch(() => undefined);
				}
				let commandname = command.name.toUpperCase();
				command.run(
					bot,
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
				);
				Timeout.add(`${message.author.id}${command.name}`);
				setTimeout(() => {
					Timeout.delete(`${message.author.id}${command.name}`);
				}, command.timeout);
			}
		} else {
			if (
				message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
			) {
				message.delete().catch(() => undefined);
			}
			let commandname = command.name.toUpperCase();
			command.run(
				bot,
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
			);
		}
	}
};
