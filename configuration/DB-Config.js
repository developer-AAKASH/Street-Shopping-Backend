const mysql = require("mysql");

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "street-shopping",
    multipleStatements: true
});

dbConnection.connect(( error )=>{
    if( error ){
        console.log(error);
    } else{
        console.log("Connected succesfuly !!");
    }
});

module.exports = dbConnection;