const express = require('express')
const firebase = require('firebase')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname) + '/.env' })

const app = express()
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded()) // Parse URL-encoded bodies

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

app.get('/', function (req, res) {
  res.send('HTTP GET Request')
  // Insert key,value pair to database
  firebase.database().ref('/TestMessages').set({ TestMessage: 'GET Request' })
})

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
