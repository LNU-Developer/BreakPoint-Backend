const jwt = require('jsonwebtoken')
const fs = require('fs')
const fetch = require('node-fetch')
const pkceChallenge = require('pkce-challenge')
const authController = {}

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

  fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    body: `client_id=${process.env.GOOGLE_CLIENT_ID}&code=${code}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.redirectUri}&grant_type=authorization_code&code_verifier=${pkce.code_verifier}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(res => res.json())
    .then(json => {
      const RSA_PRIVATE_KEY = fs.readFileSync('././credentials/jwtRS256.key', 'utf8')
      const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 120,
        subject: 'test'
      })
      res.json({
        idToken: jwtBearerToken,
        expiresIn: 120
      })
    })
}

module.exports = authController
