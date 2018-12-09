const Event = require('../util/Event');

class GuildMemberAdd extends Event {
  constructor(...args) {
    super(...args);
  }

  run(member) {
    console.log(`Member ${member.displayName} joined ${member.guild.name}`)
    if (member.guild.id === '311483608697274379') {
      const role = member.guild.roles.get('358670733951369217');
      member.roles.add(role);
    }
  }
}

module.exports = GuildMemberAdd;