const express = require('express')
const firebase = require('firebase-admin')
const path = require('path')
const cors = require('cors')

require('dotenv').config({ path: path.join(__dirname) + '/.env' })

const app = express()
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

var serviceAccount = require('./credentials/firebaseCredentials.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://basepoint-ca3ca.firebaseio.com'
})

const db = firebase.database()

app.use(cors({
  origin: 'http://localhost:4200'
}))

// Fetch all tasks from an orginization
app.get('/api/v1/organisation/:no/tasks/all', function (req, res) {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('tasks')
  ref.on('value', function (snapshot) {
    res.send(snapshot.val())
    console.log('All tasks from ' + org + ' was retreived.')
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
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
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('tasks')
  const payload = req.body
  ref.push(payload.payload)

  console.log('A new task was created on ' + org)
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
