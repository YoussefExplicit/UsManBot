const { MessageEmbed } = require('discord.js');

const Command = require('../util/Command.js');
const caseNumber = require('../util/CaseNumber.js');
const parseUser = require('../util/ParseUser.js');


class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      description: 'This command will unmute the user mentioned',
      usage: 'unmute <mention> [reason]',
      cooldown: 5,
      category: 'Moderation',
      perms: ['MUTE_MEMBERS']
    });
  }

  async run(message, args) { 
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) {
      const noMentionEmbed = new MessageEmbed()
        .setAuthor('Error')
        .setDescription('You must mention someone to unmute.')
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
      .setDescription(`**Action:** Unmute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    if (member.roles.highest.position >= message.member.roles.highest.position) return;
    
    let role = message.guild.roles.find(c => c.name === 'muted');
    await member.roles.remove(role);

    modlog.send(embed);
  }
}

module.exports = Unmute;