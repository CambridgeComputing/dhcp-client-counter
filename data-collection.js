const fs = require('fs')
const readline = require('readline')
const db = require('./db')
const smb2 = require('smb2');

let lineNumber = 0
let headers = []
let objEntry = {}

const dhcpServer		= process.env.DHCP_SERVER
const dhcpLogsDir  		= process.env.DHCP_LOGS_DIR
const dhcpUser          = process.env.DHCP_USER
const dhcpPassword      = process.env.DHCP_PASSWORD
const shareName         = "C$\\" + dhcpLogsDir

async function downloadFile(destinationPath) {
    const client = new smb2({ 
        share: `\\\\${dhcpServer}\\\\${shareName}`,
        domain: 'NTSERVER', // Usually WORKGROUP or your pc name
        username: dhcpUser, 
        password: dhcpPassword
    })
    
    const filePath = filePathOnServer.replace(/\\/g, "/") // Replace windows path separator with UNIX one
    const remoteFile = client.util.fullRemotePath(filePath)

    try {
        await client.connect();
        
        let data = [];

        // Read the file from server in chunks
        const readStream = await client.readFile(remoteFile, {start: 0});

        readStream.on('data', chunk => {
            data.push(chunk);
        });

        readStream.on('end', async () => {
            // Concatenate the chunks into a Buffer and write it to disk
            await fs.promises.writeFile(destinationPath, Buffer.concat(data));
            
            console.log(`File downloaded successfully at ${destinationPath}`);
        });
        
        readStream.on('error', error => {
            throw new Error("Error while downloading file: " + error.message);
        });
    } catch (error) {
        console.error("Error while connecting to server: ", error);
    } finally {
        client.destroy(); // Close the connection
    }
}

// Fetch and parse DHCP server logs from a remote Windows server.
exports.readLogs = function(){







    // TODO: Fetch from SMB share
    const fileStream = fs.createReadStream('./DhcpSrvLog-Thu.log')   //Static file for testing

    // Read most recent DHCP log file
    const rl = readline.createInterface({
        input: fileStream
    })

    // Ingest CSV contents. Om nom.
    // Ignore initial lines that are just documentation (first 33 lines)
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
                console.log(lineNumber + ": Adding entry " + objEntry.MACAddress + " to DB.")
                db.storeData(objEntry)
            }
        }
    })
}