const Event = require('../util/Event');
const Discord = require('discord.js');

class GuildMemberRemove extends Event {
  constructor(...args) {
    super(...args);
  }

  run(member) {
    console.log(`Member ${member.displayName} left ${member.guild.name}`)
    if (member.guild.id === '311483608697274379') {
      const channel = member.guild.roles.get('385495604995817472');

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${member.user.username}`, member.user.avatarURL())
        .setDescription(`Say goodbye to ${member.user.username}, everyone! We will all miss you :(`)
        .setColor(member.guild.member(member.client.user.id).roles.highest.color || 0x00AE86)
        .setTimestamp()
        .setFooter('User has left: ');
      channel.send(embed);
    }
  }
}

module.exports = GuildMemberRemove;