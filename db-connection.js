const knex = require('knex') ({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    // TODO: Make it configurable
    filename: './db.sqlite3',
  }
})
module.exports = {
  knex: knex
}