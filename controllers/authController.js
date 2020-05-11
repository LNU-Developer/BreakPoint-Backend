const jwt = require('jsonwebtoken')
const fs = require('fs')
const fetch = require('node-fetch')
const pkceChallenge = require('pkce-challenge')
const authController = {}

const firebase = require('firebase-admin')

const db = firebase.database()

let pkce
let state

authController.requestCode = (req, res) => {
  pkce = pkceChallenge()
  state = pkceChallenge()
  const scope = 'openid email profile'
  const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&state=${state.code_challenge}&response_type=code&redirect_uri=${process.env.redirectUri}&client_id=${process.env.GOOGLE_CLIENT_ID}&code_challenge=${pkce.code_challenge}&code_challenge_method=S256`

  res.redirect(url)
}

authController.exchangeCode = (req, res) => {
  const code = decodeURIComponent(req.body.payload.code)

  // Fetch Auth token/ID token
  fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    body: `client_id=${process.env.GOOGLE_CLIENT_ID}&code=${code}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.redirectUri}&grant_type=authorization_code&code_verifier=${pkce.code_verifier}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(res => res.json())
    .then(json => {
      // Fetch ID
      fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${json.id_token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(result => result.json())
        .then(id => {
          // Add or fetch from user to database
          const payload =
          {
            name: id.name,
            email: id.email
          }
          const ref = db.ref('users')
          ref.once('value', function (snapshot) {
            if (snapshot.exists()) {
              const data = Object.values(snapshot.val())
              let duplicate = false
              for (let i = 0; i < data.length; i++) {
                if (data[i].email === id.email) {
                  console.log('User ' + id.email + ' logged in')
                  duplicate = true
                } else if (i === data.length - 1 && duplicate === false) {
                  ref.push(payload)
                    .then((snapshot) => {
                      ref.child(snapshot.key).update({ id: snapshot.key })
                      console.log('A new user ' + (id.email) + ' was created')
                    })
                }
              }
            } else {
              ref.push(payload)
                .then((snapshot) => {
                  ref.child(snapshot.key).update({ id: snapshot.key })
                  console.log('A new user ' + (id.email) + ' was created')
                })
            }
          }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code)
          })

          // Signing own JWT Token
          console.log(id.organizations)
          const RSA_PRIVATE_KEY = fs.readFileSync('././credentials/jwtRS256.key', 'utf8')

          const ref2 = db.ref('users/').orderByChild('email').equalTo(id.email)
          ref2.once('value', function (snapshot) {
            if (snapshot.exists()) {
              const user = Object.values(snapshot.val())
              const organizationString = user[0].organizations
              const tmpString = organizationString.substr(1).slice(0, -1)
              const organizationArray = tmpString.split(', ')
              const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 43200,
                subject: id.email,
                audience: organizationArray
              })
              res.status(200).json({
                idToken: jwtBearerToken,
                expiresIn: 43200
              })
            }
          }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code)
          })
        })
    })
}

module.exports = authController
