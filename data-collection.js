const fs = require('fs')
const readline = require('readline')
const db = require('./db')
let lineNumber = 0
let headers = []
let objEntry = {}

// Initialize the database if this is the first run.
db.initDB()

// Collect data from remote servers
const fileStream = fs.createReadStream('./DhcpSrvLog-Thu.log')   //Static file for testing

// Read most recent DHCP log file
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

// Ingest CSV contents. Om nom.
// Ignore initial lines that just have documentation included (33 lines)
rl.on('line', (entry) => {
    lineNumber++
    // Read each entry into an array "data" that can be correlated with the "headers" array
    if (lineNumber > 34){
    // if (lineNumber == 72){  //TESTING
        let data = entry.split(',')
        i = 0
        headers.forEach(header => {
            objEntry[header] = data[i]
            i++
        })
        // Submit to database if the entry contains a MAC Address
        if (objEntry.MACAddress !== ""){
            console.log(lineNumber + ": Adding entry " + objEntry.MACAddress + " to DB.")
            db.storeData(objEntry,() =>{})
        }
    } else if (lineNumber == 34){
        // Read the CSV header, remove all whitespaces
        entry = entry.replace(/\s+/g, '')
        headers = entry.split(',')
    }
});
