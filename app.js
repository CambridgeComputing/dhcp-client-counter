// Main app.
require('dotenv').config()
const dataCollection = require('./data-collection')

function main(cb) {
    dataCollection.readWindowsLogs()
}

console.log("Starting main loop.")
// setInterval(() => {
//     main(()=>{
//         console.log("Loop complete")
//     })
// }, (28800000))

// Run every hour
// const mainLoop = setInterval(main, 5000)
const mainLoop = setInterval(main, 60 * 60 * 1000)
main()