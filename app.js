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

// Fetch all tasks from an orginization
app.get('/api/v1/organisation/:no/tasks/all', function (req, res) {
  const payload = req.params.name
  console.log(payload)
  res.send({ name: payload })
})

// Fetch all tasks from a user
app.get('/api/v1/user/:no/tasks/all/', function (req, res) {
  const payload = req.params.name
  console.log(payload)
  res.send({ name: payload })
})

// fetch a specific task
app.get('/api/v1/organization/:no/tasks/:id/', function (req, res) {

})

// Add new task
app.post('/api/v1/organization/:no/tasks/new/', function (req, res) {

})

// Edit task
app.post('/api/v1/organization/:no/tasks/:id/', function (req, res) {

})

// delete edit task
app.delete('/api/v1/organization/:no/tasks/:id/', function (req, res) {

})

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
