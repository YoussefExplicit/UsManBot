const Event = require('../util/Event');
const Discord = require('discord.js');

class GuildMemberAdd extends Event {
  constructor(...args) {
    super(...args);
  }

  run(member) {
    console.log(`Member ${member.displayName} joined ${member.guild.name}`)
    if (member.guild.id === '311483608697274379') {
      const role = member.guild.roles.get('358670733951369217');
      member.roles.add(role);
      const channel = member.guild.channels.get('385495604995817472');

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${member.user.username}`, member.user.avatarURL())
        .setDescription(`Say hello to ${member.user.username}, everyone! We all need a warm welcome sometimes :D`)
        .setColor(member.guild.member(member.client.user.id).roles.highest.color || 0x00AE86)
        .setTimestamp()
        .setFooter('User has joined: ');
      channel.send(embed);
    }
  }
}

module.exports = GuildMemberAdd;