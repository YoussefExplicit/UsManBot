const Event = require('../util/Event');

class GuildCreate extends Event {
  constructor(...args) {
    super(...args);
  }

  run(guild) {
    console.log(`Joined guild: ${guild.name}`);
  }
}

module.exports = GuildCreate;