// Main app.
require('dotenv').config()
const sql = require('./sql')
const line = '-'.repeat(process.stdout.columns)

// Collect environment variables
if(typeof process.env.SQL_SERVER === 'undefined'){
    console.log("Error: No SQL server address defined! Make sure that SQL_SERVER environment veriable is set.")
    process.exit(1)
}
if(typeof process.env.SQL_USER === 'undefined'){
    console.log("Error: No SQL user defined! Make sure that SQL_USER environment veriable is set.")
    process.exit(1)
}
if(typeof process.env.SQL_PASSWORD === 'undefined'){
    console.log("Error: No SQL user password defined! Make sure that SQL_PASSWORD environment veriable is set.")
    process.exit(1)
}
if(typeof process.env.SQL_DATABASE === 'undefined'){
    console.log("Error: No SQL database name defined! Make sure that SQL_DATABASE environment veriable is set.")
    process.exit(1)
}

function main(cb) {

}

console.log("Starting main loop.")
setInterval(() => {
    main(()=>{
        console.log("Loop complete")
    })
}, (28800000))