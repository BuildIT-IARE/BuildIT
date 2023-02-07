var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost", //your hostname
    user: "root",      //your username
    password: "buildit123",  //your password 
    database: "buildit" //your database name
})
con.connect((error) => {
    if (!error) {
        console.log("connected with sql server");
    }
    else {
        console.log("Error in Making SQL Connection...", error)
    }
})

module.exports = con;