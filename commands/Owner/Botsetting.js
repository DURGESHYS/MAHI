const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
	name: 'botsetting',
	description: 'Use This Command To Change Settings in Bot.',
	usage: 'botsetting [colour, sucessemoji, erroremoji, wrongemoji, arrowemoji]',
	category: 'Owner',
	owner: true,
	aliases: ['botsettings'],
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
	) => {}
};
