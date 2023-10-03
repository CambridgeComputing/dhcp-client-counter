// Import variables
const SQLServer     = process.env.SQL_SERVER
const SQLUser	    = process.env.SQL_USER
const SQLPass	    = process.env.SQL_PASSWORD
const SQLDB		    = process.env.SQL_DATABASE

// Define connection pool for later use
const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host: SQLServer, 
        user: SQLUser, 
        password: SQLPass,
        connectionLimit: 50,
        database: SQLDB
});

// General query function
function sqlQuery(query, cb){
    pool.query(query, (err,rows, fields) => {
        console.log("after query")
        console.log(rows)
        if(err){
            console.log("Error while executing query: " + err)
        }else{
            cb(rows)
        }
    })
}

// Store data function - IGNORE duplicate MAC addresses
function storeData(objDevice, cb){
    query = "INSERT IGNORE INTO devices(MACAddress,Date,Time,IPAddress,HostName) VALUES('" + objDevice.MACAddress + "',STR_TO_DATE('" + objDevice.Date + "','%m/%d/%Y'),'" + objDevice.Time + "','" + objDevice.IPAddress + "','" + objDevice.HostName + "');"
    sqlQuery(query, function () {
        console.log("Record added.")
        cb()
    })
}

// Create DB and instantiate tables if not existing
function initDB(cb){
    console.log("Init DB Called.")
    query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'dhcpclients';"
    sqlQuery(query, function (res) {
        console.log("DB YES!")
        console.log(res)
        cb()
    })
}

// Retrieve data function
function getData(cb){

}

module.exports = {
    storeData,
    getData,
    initDB
}