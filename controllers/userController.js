const firebase = require('firebase-admin')
const userController = {}

const db = firebase.database()

// Fetch all tasks from a user
userController.userTasks = (req, res) => {
  const ref = db.ref('users/').orderByChild('email').equalTo(req.user.sub)
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      const user = Object.values(snapshot.val())
      const tasks = []

      const organizationString = user[0].organizations
      const tmpString = organizationString.substr(1).slice(0, -1)
      const organizationArray = tmpString.split(', ')

      for (let i = 0; i < organizationArray.length; i++) {
        db.ref('organizations/' + organizationArray[i]).child('tasks').once('value', function (ss) {
          ss.forEach(child => {
            tasks.push(child.val())
          })
          if (i === organizationArray.length - 1) {
            res.send(tasks)
          }
        })
      }
      console.log('All tasks for ' + req.user.sub + ' was retreived.')
    } else {
      res.send() // TODO: send back a proper message
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
}

/// Fetch all organisations from a user
userController.userOrgs = (req, res) => {
  const ref = db.ref('users/').orderByChild('email').equalTo(req.user.sub)
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      const user = Object.values(snapshot.val())
      const organizationString = user[0].organizations
      const tmpString = organizationString.substr(1).slice(0, -1)
      const organizationArray = tmpString.split(', ')
      res.send(organizationArray)

      console.log('All organisations for ' + req.user.sub + ' was retreived.')
    } else {
      res.send() // TODO: send back a proper message
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
}

// Fetch all users with a specific access for org
userController.orgUsers = (req, res) => {
  const ref = db.ref('users/').orderByChild('organizations')
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      const users = Object.values(snapshot.val())
      const userWithAccess = []
      users.forEach(element => {
        if (element.organizations) {
          element.organizations = element.organizations.substr(1).slice(0, -1).split(', ')
          if (element.organizations.includes(req.params.no)) {
            userWithAccess.push(element)
          }
        }
      })
      res.send(userWithAccess)
      console.log('All users for ' + req.params.no + ' was retreived.')
    } else {
      res.send() // TODO: send back a proper message
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
}

module.exports = userController
