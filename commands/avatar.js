const Command = require('../util/Command.js');
const { MessageEmbed } = require('discord.js');

class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      description: 'This command will get the avatar of a user',
      usage: 'avatar [mention]',
      aliases: ['icon', 'pfp', 'enlarge'],
      cooldown: 5,
      category: 'System'

    });
  }
  
  async run(message) { 
    const person = message.mentions.members.first() !== undefined ? message.mentions.members.first() : message.member;
    const embed = new MessageEmbed()
      .setImage(person.user.avatarURL({size: 2048}))
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
    message.channel.send(embed);
  }
}
module.exports = Avatar;