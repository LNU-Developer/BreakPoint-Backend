const firebase = require('firebase-admin')
const nodemailer = require('nodemailer')
const apiController = {}

const db = firebase.database()

// Email settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.emailUsername,
    pass: process.env.emailPassword
  }
})

/** Function to send email containing param is information.
 *
 * @param {object} payload - Object containing payload of information to be sent.
 * @param {string} org - Organization to be send.
 */
function sendEmail (payload, org) {
  const tempEmail = payload.assignee.split('(')
  const email = tempEmail[1].substr(0, tempEmail[1].length - 1)
  var mailOptions = {
    from: process.env.emailUsername,
    to: email,
    subject: 'Task assignee for ' + org,
    text:
    `
    You have been assigned a new task at ${org} containing the following information:
    Organization: ${org}
    Assignee: ${payload.assignee}
    Deadline ${payload.deadline}
    Title: ${payload.title}
    Description: ${payload.description}
    `
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

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
      sendEmail(payload, org)
      console.log('A new task was created on ' + org)
    })
}

// Edit task
apiController.orgEditTask = (req, res) => {
  const org = req.params.no
  const id = req.params.id
  const payload = req.body.payload || req.body
  const ref = db.ref('organizations/' + org).child('tasks').child(id)
  ref.once('value', function (snapshot) {
    const data = Object.values(snapshot.val())
    if (data.assignee !== payload.assignee) {
      sendEmail(payload, org)
    }
    ref.update(payload, function (error) {
      if (error) {
        console.log('The read failed: ' + error.code)
      } else {
        // TODO: send back a proper message
        res.send()
        console.log('Task with ID ' + id + ' from ' + org + ' was updated.')
      }
    })
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
