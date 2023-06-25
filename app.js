require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

// Import routes
const userRoutes = require("./routes/user")
const sheetRoutes = require("./routes/sheet")

const credentials = {
	user: process.env.USER,
	pw: process.env.PASSWORD,
	db: process.env.DATABASE,
	key: process.env.KEY_DEPLOYMT,
}
// const access = `mongodb+srv://${credentials.user}:${credentials.pw}@${credentials.db}.${credentials.key}.mongodb.net/?retryWrites=true&w=majority`
const access = "mongodb+srv://tsb2:Azerty010203@db-fsc-1.aycfyd0.mongodb.net/?retryWrites=true&w=majority"
const app = express()
app.use(express.json())
mongoose
	.connect(access, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(e => {
		if (!e) {
			console.log("Internal Error Servor !!!")
		} else {
			console.log("Connected to MongoDB !!!")
		}
	})
	.catch(error => {
		console.log("Connexion to MongoDB failed !!!")
		console.log(error)
	})
//CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
	)
	res.setHeader("Acess-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
	next()
})
// Using user routes
app.use("/api/users", userRoutes)
// Using book routes
app.use("/api/books", sheetRoutes)
module.exports = app
