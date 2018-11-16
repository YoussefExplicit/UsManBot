const Discord = require('discord.js');

const ParseUser = (message, user) => {
  const client = message.client;
  const errorEmbed = new Discord.MessageEmbed()
    .setColor(message.guild.member(client.user.id).roles.highest.color || 0x00AE86)
    .setTitle('Error')
    .setDescription('You cannot do that to yourself, why did you try?');

  const errorEmbed2 = new Discord.MessageEmbed()
    .setColor(message.guild.member(client.user.id).roles.highest.color || 0x00AE86)
    .setTitle('Error')
    .setDescription('The targeted member has a higher or equal role position than you.');
  const member = message.guild.member(user) || null;
  if (user.id === message.author.id) {
    return message.channel.send(errorEmbed);
  } else if (member) {
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(errorEmbed2);
  }
  return user;
};

module.exports = ParseUser;