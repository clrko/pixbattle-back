const mysql = require('mysql2')
const { dbHost, dbUser, dbPassword, dbDatabase } = require('../../config')

const connection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase
})

module.exports = connection
