const fs = require('fs')
const path = require('path')
const readline = require('readline')
const db = require('./db')

let headers = []
let objEntry = {}

function readLogs() {
// TODO: make a docker mount to bring in the network share...
    const directoryPath = './dhcplogs'

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory: " + err)
            return
        }
        files.forEach(file => {
            if (path.parse(file).name.startsWith('DhcpSrvLog')) {   // Excludes IPv6 logs
                console.log("Reading file: " + file)
                const fileStream = fs.createReadStream(directoryPath + "/" + file)
                const rl = readline.createInterface({ input: fileStream })
                let lineNumber = 0

                rl.on('line', (entry) => {
                    lineNumber++
                    // Read the headers into an array that will be used to set the object's property names
                    if (lineNumber == 34){
                        // Read the CSV header, remove all whitespaces
                        entry = entry.replace(/\s+/g, '')
                        headers = entry.split(',')
                    } else if (lineNumber > 34){
                    // } else if (lineNumber == 72){  //TESTING
                        let data = entry.split(',')
                        i = 0
                        headers.forEach(header => {
                            objEntry[header] = data[i]
                            i++
                        })
                        // Submit to database if the entry contains a MAC Address
                        if (objEntry.MACAddress !== ""){
                            // console.log(lineNumber + ": Found entry " + objEntry.MACAddress)
                            db.storeData(objEntry)
                            // db.deleteAllRecords()
                        }
                    }
                })
            }
        })
    })
}

module.exports = {
	readLogs
}