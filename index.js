const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({
	disableEveryone: true
});
const config = require('./botconfig.json');
client.setMaxListeners(0);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Map();
client.categories = fs.readdirSync('./commands/');

['command', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});
//start
client.on("message", async (message) => {
  if (message.author.bot || message.channel.type === 'dm') return;
  let msg = message.content;

  let emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g)
  if (!emojis) return;
  emojis.forEach(m => {
    let emoji = client.emojis.cache.find(x => x.name === m)
    if (!emoji) return;
    let temp = emoji.toString()
    if (new RegExp(temp, "g").test(msg)) msg = msg.replace(new RegExp(temp, "g"), emoji.toString())
    else msg = msg.replace(new RegExp(":" + m + ":", "g"), emoji.toString());
  })

  if (msg === message.content) return;

  let webhook = await message.channel.fetchWebhooks();
  let number = randomNumber(1, 2);
  webhook = webhook.find(x => x.name === "${client.user.username}" + number);

  if (!webhook) {
    webhook = await message.channel.createWebhook(`${client.user.username}` + number, {
      avatar: client.user.displayAvatarURL({ dynamic: true })
    });
  }

  await webhook.edit({
    name: message.member.nickname ? message.member.nickname : message.author.username,
    avatar: message.author.displayAvatarURL({ dynamic: true })
  })

  message.delete().catch(err => { })
  webhook.send(msg).catch(err => { })

  await webhook.edit({
    name: `${client.user.username}` + number,
    avatar: client.user.displayAvatarURL({ dynamic: true })
  })


})
//end

client.login(process.env.TOKEN);

// function randomNumber
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 