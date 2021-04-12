module.exports = client => {
	const Discord = require('discord.js');
	let botStatus = [
		`${client.guilds.cache.size} servers!`,
		`Over ${client.users.cache.size} users!`,
		`Over ${client.channels.cache.size} channels!`
	];
	setInterval(function() {
		let member;

		client.guilds.cache.forEach(async guild => {
			await delay(15);

			member = await client.guilds.cache
				.get(guild.id)
				.members.cache.get(client.user.id);

			//if not connected

			if (!member.voice.channel) return;

			//if alone

			if (member.voice.channel.members.size === 1) {
				return member.voice.channel.leave();
			}
		});
		let status = botStatus[Math.floor(Math.random() * botStatus.length)];
		client.user.setActivity(status, {
			type: 'STREAMING',
			url: 'https://www.twitch.tv/monstercat'
		});
	}, 5000);

	//------------------------CLIENT STATUS FUNCTION END------------------------

	//------------------------ALIVE FUNCTION---------------------------
	const express = require('express');
	const app = express();
	const config = require('./../../botconfig.json');
	const port = config.port;
	app.get('/', (req, res) =>
		res.send(`${client.user.username} Bot is Online Now!`)
	);
	app.listen(port, () =>
		console.log(`${client.user.username} Bot is Hosting Now This PORT: ${port}`)
	);

	//------------ALIVE END---------------------
};

function delay(delayInms) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(2);
		}, delayInms);
	});
}