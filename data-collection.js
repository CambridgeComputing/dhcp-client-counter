const fs = require('fs')
const path = require('path')
const readline = require('readline')
const db = require('./db')

let headers = []
let objEntry = {}

function readWindowsLogs() {
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

function readFtgLogs (){
    const axios = require('axios');

    // Site variables TODO: make these env or in a config file
    const fgIp = '10.0.2.254';
    const apiToken = 'fwfHbzbmcfQrwH4Q7qgmzhyNbG1wQy';
    const apiVersion = 'v1';
    const logType = 'dhcp'; // or 'dhcpv6' for IPv6 DHCP logs
    const startTime = '2024-09-01 00:00:00'; // Start time for log retrieval (optional)
    const endTime = '2024-09-02 23:59:59'; // End time for log retrieval (optional)

    // Set API endpoint and headers
    const apiEndpoint = `https://${fgIp}/api/${apiVersion}/log/${logType}`;
    const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
    };

    // Set query parameters (optional)
    const queryParams = {};
    if (startTime) queryParams.start_time = startTime;
    if (endTime) queryParams.end_time = endTime;

    // Make API request
    axios.get(apiEndpoint, {
    headers,
    params: queryParams
    })
    .then(response => {
    const logs = response.data.results;
    console.log(logs);
    })
    .catch(error => {
    console.error(error);
    });

}

module.exports = {
	readWindowsLogs
}