const Event = require('../util/Event');

class GuildDelete extends Event {
  constructor(...args) {
    super(...args);
  }

  run(guild) {
    console.log(`Left guild: ${guild.name}`);
  }
}

module.exports = GuildDelete;