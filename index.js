const jsonwebtoken = require('jsonwebtoken')

function jwt (id, pem) {
  console.log({id, pem})

  const payload = {
    iat: Math.floor(new Date() / 1000),       // Issued at time
    exp: Math.floor(new Date() / 1000) + 60,  // JWT expiration time
    iss: id                                   // Integration's GitHub id
  }

  // Sign with RSA SHA256
  return jsonwebtoken.sign(payload, pem, {algorithm: 'RS256'})
}

module.exports = ({id, pem}) => {
  return octokit => {
    octokit.jwt = jwt.bind(null, id, pem)

    // Save the original octokit authenticate method
    const authenticate = octokit.authenticate

    // Authenticate this instance as the GitHub App
    // FIXME: this will only work for requests within the next 60 sec
    authenticate({ type: 'app', token: octokit.jwt() })

    octokit.authenticate = async (options) => {
      if (options.type === 'installation') {
        octokit.authenticate({ type: 'app', token: octokit.jwt() })

        const { data: { token } } = await octokit.apps.createInstallationToken({
          installation_id: options.id
        })

        return authenticate({ type: 'token', token })
      } else {
        return authenticate(options)
      }
    }
  }
}
