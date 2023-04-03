const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSL,
  },
  pool: { min: 0, max: 7 },
  acquireConnectionTimeout: 10000,
});

module.exports = knex;
