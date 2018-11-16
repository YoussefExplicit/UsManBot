const { MessageEmbed } = require('discord.js');

const Command = require('../util/Command.js');
const caseNumber = require('../util/CaseNumber.js');
const parseUser = require('../util/ParseUser.js');


class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'This command will ban the user mentioned',
      usage: 'ban <mention> [reason]',
      cooldown: 5,
      category: 'Moderation',
      perms: ['BAN_MEMBERS']
    });
  }

  async run(message, args) { 
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) {
      const noMentionEmbed = new MessageEmbed()
        .setAuthor('Error')
        .setDescription('You must mention someone to ban.')
        .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
      return message.channel.send(noMentionEmbed);
    }
    parseUser(message, member.user);
    const modlog = message.guild.channels.find(entry => entry.name === 'mod_log');
    const caseNum = await caseNumber(this.client, modlog);
    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ?reason ${caseNum} <reason>.`;
    const embed = new MessageEmbed()
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86)
      .setTimestamp()
      .setDescription(`**Action:** Ban\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    if (member.roles.highest.position >= message.member.roles.highest.position) return;
    const questionEmbed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setDescription(`**Reason:** ${reason}`)
      .setFooter('Reply yes to ban, or no to cancel.')
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
    await message.channel.send(questionEmbed);

    const filter = m => ['y', 'yes', 'n', 'no'].includes(m.content.toLowerCase());
    await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ['time']
    }).then(async collected => {
      if (collected.first().content === 'y' || collected.first().content === 'yes') {
        const correctAnswerEmbed = new MessageEmbed()
          .setAuthor('Banned!')
          .setDescription(`Successfully banned ${member.user.tag}`)
          .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
        await message.channel.send(correctAnswerEmbed);
        await message.guild.members.ban(member.user, 7);
        await modlog.send(embed);
      } 
      if (collected.first().content === 'n' || collected.first().content === 'no') {
        const wrongAnswerEmbed = new MessageEmbed()
          .setAuthor('Cancelled')
          .setDescription('Ban was cancelled.')
          .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
        await message.channel.send(wrongAnswerEmbed);
      }
    }).catch(async () => {
      const timeError = new MessageEmbed()
        .setAuthor('Error')
        .setDescription('You didn\'t answer the question in time.')
        .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
      await message.channel.send(timeError);
    });
    modlog.send(embed);
  }
}

module.exports = Ban;