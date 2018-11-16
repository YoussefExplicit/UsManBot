const { MessageEmbed } = require('discord.js');

const Command = require('../util/Command.js');
const caseNumber = require('../util/caseNumber.js');
const parseUser = require('../util/parseUser.js');


class Kick extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'This command will get the ping of the client',
      usage: 'kick <mention> [reason]',
      cooldown: 5,
      category: 'Moderation',
      perms: ['KICK_MEMBERS']
    });
  }

  async run(message, args) { 
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) {
      const noMentionEmbed = new MessageEmbed()
        .setAuthor('Error')
        .setDescription('You must mention someone to kick.')
        .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86);
      message.channel.send(noMentionEmbed);
    }
    parseUser(message, member.user);
    const modlog = message.guild.channels.find(entry => entry.name === 'mod_log');
    const caseNum = await caseNumber(this.client, modlog);
    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ?reason ${caseNum} <reason>.`;
    const embed = new MessageEmbed()
      .setColor(message.guild.member(this.client.user.id).roles.highest.color || 0x00AE86)
      .setTimestamp()
      .setDescription(`**Action:** Kick\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    if (member.roles.highest.position >= message.member.roles.highest.position) return;
    await member.kick();
    modlog.send(embed);
  }
}

module.exports = Kick;