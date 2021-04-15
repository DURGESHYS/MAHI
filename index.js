const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const fs = require('fs');
const client = new Discord.Client({
	disableEveryone: true
});
const config = require('./botconfig.json');
const erroremo = config.ERROREMOJI;
const Color = config.DEFAULT_COLOUR;
client.setMaxListeners(0);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Map();
client.categories = fs.readdirSync('./commands/');

['command', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});
//start
client.on('message', async message => {
	if (message.author.bot || message.channel.type === 'dm') return;
	let erroremoji = db.get(`erroremoji`);
	if (erroremoji === null) {
		erroremoji = erroremo;
	}
	let colour = db.get(`colour`);

	if (colour === null) {
		colour = Color;
	}
	let member = message.guild.member(message.author);
	let nickname = member ? member.displayName : message.author.username;
	let msg = message.content;
	let embed = new MessageEmbed();

	let emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g);
	if (!emojis) return;
	emojis.forEach(m => {
		let emoji = client.emojis.cache.find(x => x.name === m);
		if (!emoji) return;
		let temp = emoji.toString();
		if (new RegExp(temp, 'g').test(msg))
			msg = msg.replace(new RegExp(temp, 'g'), emoji.toString());
		else msg = msg.replace(new RegExp(':' + m + ':', 'g'), emoji.toString());
	});

	if (msg === message.content) return;
	let everyonerole = message.guild.roles.cache.find(
		r => r.name === '@everyone'
	);
	if (!everyonerole.permissions.has('USE_EXTERNAL_EMOJIS' || 'ADMINISTRATOR')) {
		return message.author
			.send(
				embed
					.setColor(`${colour}`)
					.setDescription(
						`<a:ERROR:${erroremoji}>┊Please Give Everyone to \`Use External Emojis\` Permission.`
					)
					.setAuthor(nickname, message.author.displayAvatarURL())
					.setFooter(
						`┊EVERYONE┊PERMISSION┊  ${client.user.username}`,
						client.user.displayAvatarURL()
					)
			)
			.then(m => {
				m.delete({ timeout: 60000 }).catch(() => undefined);
			});
	}
	if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
		return message.author
			.send(
				embed
					.setColor(`${colour}`)
					.setDescription(
						`<a:ERROR:${erroremoji}>┊Please Give Me to \`Administor\` Permission`
					)
					.setAuthor(nickname, message.author.displayAvatarURL())
					.setFooter(
						`┊BOT┊NITRO┊PERMISSION┊  ${client.user.username}`,
						client.user.displayAvatarURL()
					)
			)
			.then(m => {
				m.delete({ timeout: 60000 }).catch(() => undefined);
			});
	}

	let webhook = await message.channel.fetchWebhooks();
	let number = randomNumber(1, 2);
	webhook = webhook.find(x => x.name === `${client.user.username}` + number);

	if (!webhook) {
		webhook = await message.channel.createWebhook(
			`${client.user.username}` + number,
			{
				avatar: client.user.displayAvatarURL({ dynamic: true })
			}
		);
	}

	await webhook.edit({
		name: message.member.nickname
			? message.member.nickname
			: message.author.username,
		avatar: message.author.displayAvatarURL({ dynamic: true })
	});

	message.delete().catch(err => {});
	webhook.send(msg).catch(err => {});

	await webhook.edit({
		name: `${client.user.username}` + number,
		avatar: client.user.displayAvatarURL({ dynamic: true })
	});
});
//end

client.login(process.env.TOKEN);

// function randomNumber
function randomNumber(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
