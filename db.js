const mongoose = require('mongoose')
const moment = require('moment')
const line = '-'.repeat(process.stdout.columns)

const dbServer		= process.env.MONGO_SERVER
const dbUser		= process.env.MONGO_USER
const dbPass		= process.env.MONGO_PASSWORD
const dbName		= process.env.MONGO_DATABASE
const dbCollection	= process.env.MONGO_DB_COLLECTION

// Configure connection
console.log("Connecting to MongoDB...")
mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbServer}/${dbName}?authSource=admin`)
	.then(() => console.log('Connected to MongoDB.'))
	.catch(err => console.error('Could not connect to MongoDB...', err))

// Define Schema
const recordSchema = new mongoose.Schema({
	Timestamp: Date,    // Date and Time, needs to be stitched togehter from the logs
	MACAddress: String, // MAC Address
	IPAddress: String,  // IP Address
	HostName: String	// Reported Hostname
}, {collection: dbCollection})

// Create Model from Schema
const Record = mongoose.model('Record', recordSchema);

// Create Timestamp from individual time/date fields
function createTimestamp(date,time){
	var strDateTime = date + " " + time								// Combine date and time strings
	var objDate = moment.utc(strDateTime, 'MM/DD/YY HH:mm:ss')		// Parse the combined string to a Moment object
	var strISODate = objDate.toISOString()                          // Convert the Moment object to an ISODate formatted string
	return strISODate
}

// Function to write data to DB
async function createRecord(record) {
	try {
		const document = await record.save()
		console.log(line)
		// console.log("Record Created: " + document);
		console.log("Record Created: " + document._id)
	} catch (err) {
		console.error(err);
	}
}
  

function storeData(objRecord){
	let record = new Record()
	record.Timestamp = createTimestamp(objRecord.Date,objRecord.Time)
	record.MACAddress = objRecord.MACAddress
	record.IPAddress = objRecord.IPAddress
	record.HostName = objRecord.HostName

	createRecord(record)
}

module.exports = {
	storeData
}
