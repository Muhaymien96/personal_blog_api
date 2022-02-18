const mysql = require('mysql')

const con = mysql.createConnection({
    host: "localhost",
    user: "muhammad_s",
    password: "As#231296",
    database: "personal_blog"
  });

  module.exports = con;