var mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "../Server/util/config.env" });

var con = mysql.createConnection({
  host: "localhost", //your hostname
  user: "root", //your username
  password: process.env.MySQL_PASS, //your password
  database: process.env.MySQL_DB, //your database name
  multipleStatements: true
});
con.connect((error) => {
  if (!error) {
    console.log("connected with sql server");
  } else {
    console.log("Error in Making SQL Connection...", error);
  }
});

module.exports = con;
