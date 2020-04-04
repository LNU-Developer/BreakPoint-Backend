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
app.get('/api/v1/organization/:no/tasks/all/', function (req, res) {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('tasks')
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      res.send(Object.values(snapshot.val()))
      console.log('All tasks from ' + org + ' was retreived.')
    } else {
      res.send() // TODO: send back a proper message
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
})

// Fetch all users from an organization
app.get('/api/v1/organization/:no/users/all/', function (req, res) {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('users')
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      res.send(Object.values(snapshot.val()))
      console.log('All users from ' + org + ' was retreived.')
    } else {
      res.send() // TODO: send back a proper message
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
})

// TODO:Not fixed yet
// Assign a user to an organization
app.post('/api/v1/organization/:no/users/adduser/', function (req, res) {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('users')
  const payload = req.body
  ref.push(payload.payload)
  res.send() // TODO: send back a proper message
  console.log('A new user was assigned on ' + org)
})

// TODO: Not fixed yet
// Fetch all tasks from a user
app.get('/api/v1/user/:no/tasks/all/', function (req, res) {
  const payload = req.params.name
  console.log(payload)
  res.send({ name: payload })
})

// fetch a specific task
app.get('/api/v1/organization/:no/tasks/:id/', function (req, res) {
  const org = req.params.no
  const id = req.params.id
  const ref = db.ref('organizations/' + org).child('tasks')
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      const data = Object.values(snapshot.val())
      data.forEach(element => {
        if (element.id === id) {
          res.send(element)
          console.log('Task with ID ' + id + ' from ' + org + ' was retreived.')
        }
      })
    } else {
      res.send() // TODO: send back a proper message
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
})

// Add new task
app.post('/api/v1/organization/:no/tasks/new/', function (req, res) {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('tasks')
  const payload = req.body
  ref.push(payload.payload)
    .then((snapshot) => {
      ref.child(snapshot.key).update({ id: snapshot.key })
      res.send()
      // TODO: send back a proper message
      console.log('A new task was created on ' + org)
    })
})

// Edit task
app.put('/api/v1/organization/:no/tasks/:id/', function (req, res) {
  const org = req.params.no
  const id = req.params.id
  const payload = req.body
  const ref = db.ref('organizations/' + org).child('tasks').child(id)
  ref.update(payload.payload, function (error) {
    if (error) {
      console.log('The read failed: ' + error.code)
    } else {
      // TODO: send back a proper message
      res.send()
      console.log('Task with ID ' + id + ' from ' + org + ' was updated.')
    }
  })
})

// delete task
app.delete('/api/v1/organization/:no/tasks/:id/delete/', function (req, res) {
  const org = req.params.no
  const id = req.params.id
  db.ref('organizations/' + org).child('tasks').child(id).remove()
    .then(() => {
      // TODO: send back a proper message
      res.send()
      console.log('Task with ID ' + id + ' from ' + org + ' was deleted.')
    })
})

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
