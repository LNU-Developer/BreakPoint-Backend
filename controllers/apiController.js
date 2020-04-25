const firebase = require('firebase-admin')
const apiController = {}

const db = firebase.database()

// Fetch all tasks from an orginization
apiController.orgTasks = (req, res) => {
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
}

// TODO:Not fixed yet
// Assign a user to an organization
apiController.assignUser = (req, res) => {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('users')
  const payload = req.body
  ref.push(payload.payload)
  res.send() // TODO: send back a proper message
  console.log('A new user was assigned on ' + org)
}

// fetch a specific task
apiController.orgTask = (req, res) => {
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
}

// Add new task
apiController.orgNewTask = (req, res) => {
  const org = req.params.no
  const ref = db.ref('organizations/' + org).child('tasks')
  const payload = req.body.payload || req.body
  ref.push(payload)
    .then((snapshot) => {
      ref.child(snapshot.key).update({ id: snapshot.key })
      res.send()
      // TODO: send back a proper message
      console.log('A new task was created on ' + org)
    })
}

// Edit task
apiController.orgEditTask = (req, res) => {
  const org = req.params.no
  const id = req.params.id
  const payload = req.body.payload || req.body
  const ref = db.ref('organizations/' + org).child('tasks').child(id)
  ref.update(payload, function (error) {
    if (error) {
      console.log('The read failed: ' + error.code)
    } else {
      // TODO: send back a proper message
      res.send()
      console.log('Task with ID ' + id + ' from ' + org + ' was updated.')
    }
  })
}

// delete task
apiController.orgDeleteTask = (req, res) => {
  const org = req.params.no
  const id = req.params.id
  db.ref('organizations/' + org).child('tasks').child(id).remove()
    .then(() => {
      // TODO: send back a proper message
      res.send()
      console.log('Task with ID ' + id + ' from ' + org + ' was deleted.')
    })
}

module.exports = apiController
