const App = require('@octokit/app')
const Octokit = require('@octokit/rest')

module.exports = function ({id, cert, debug = false}) {
  const app = new App({ id, privateKey: cert, debug })

  function asApp () {
    return Promise.resolve(app)
  }

  // https://developer.github.com/early-access/integrations/authentication/#as-an-installation
  function createToken (installationId) {
    return app.getInstallationAccessToken({
      installation_id: installationId
    })
  }

  // Authenticate as the given installation
  function asInstallation (installationId) {
    return createToken(installationId).then(installationAccessToken => {
      const octokit = new Octokit({
        auth: 'token ' + installationAccessToken
      })

      // expose installationa access token as it can be useful
      if (!octokit.auth) {
        octokit.auth = {}
      }
      octokit.auth.token = installationAccessToken

      return octokit
    })
  }

  return {asApp, asInstallation, createToken}
}
