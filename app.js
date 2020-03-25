const express = require('express')
const firebase = require('firebase')
const path = require('path')
const cors = require('cors')

require('dotenv').config({ path: path.join(__dirname) + '/.env' })

const app = express()
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
}
firebase.initializeApp(config)

app.use(cors({
  origin: 'http://localhost:4200'
}))

app.get('/', function (req, res) {
  res.send('HTTP GET Request')
  // Insert key,value pair to database
  firebase.database().ref('/TestMessages').set({ TestMessage: 'GET Request' })
})

app.get('/organisation/:name/', function (req, res) {
  const payload = req.params.name
  console.log(payload)
  res.send({ name: payload })
})

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
