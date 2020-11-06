const {Pool} = require('pg')
const config = require('../../config/config')

exports.pool = new Pool(
    {
        database: config.config.PG_DATABASE,
        user: config.config.PG_USER,
        password: config.config.PG_PASSWORD,
        host: config.config.PG_HOST,
        port: config.config.PG_PORT
    }
)



