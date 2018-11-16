const Command = require('../util/Command.js');
const { MessageEmbed } = require('discord.js');

class Prune extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      description: 'Bulk deletes messages in a channel.',
      usage: 'prune [mention] <number>',
      aliases: ['purge, delete'],
      cooldown: 0,
      category: 'Moderation',
      perms: ['MANAGE_MESSAGES']
    });
  }

  async run(message) {
    const user = message.mentions.users.first();
    const messagecount = parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2]);
  
    const errorEmbed = new MessageEmbed()
      .setAuthor('Error')
      .setDescription('You need to add a number from 2-100.')
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
  
    const errorEmbed3 = new MessageEmbed()
      .setAuthor('Error')
      .setDescription('You need to add a number from 2-100 and mention a user (not needed).')
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
  
    const errorEmbed2 = new MessageEmbed()
      .setAuthor('Error')
      .setDescription('I can only delete less than 100 messages and more than 2 messages.')
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
  
    if (!user && !messagecount) return message.channel.send(errorEmbed3);
    if (!messagecount) return message.channel.send(errorEmbed);
    if (messagecount > 100 || messagecount < 2) return message.channel.send(errorEmbed2);
    if (isNaN(messagecount)) return message.channel.send(errorEmbed);
    message.channel.messages.fetch({
      limit: messagecount
    }).then((messages) => {
      if (user) {
        const filterBy = user ? user.id : this.client.user.id;
        messages = messages.filter(m => m.author.id === filterBy).array().slice(0, messagecount);
      }
      message.channel.bulkDelete(messages);
    });
  
    const embed = new MessageEmbed()
      .setAuthor('Prune information')
      .setDescription(`Attempted to delete ${messagecount} messages`)
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
    message.channel.send(embed).then(r => {
      setTimeout(() => {
        r.delete();
      }, 10000);
    });
  }
}

module.exports = Prune;