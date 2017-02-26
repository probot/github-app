const jwt = require('jsonwebtoken');
const GitHubApi = require('github');

module.exports = function ({id, cert, debug = false}) {
  function asIntegration() {
    const github = new GitHubApi({debug});
    github.authenticate({type: 'integration', token: generateJwt(id, cert)});
    // return a promise to keep API consistent
    return Promise.resolve(github);
  }

  // Authenticate as the given installation
  function asInstallation(installationId) {
    return createToken(installationId).then(token => {
      const github = new GitHubApi({debug});
      github.authenticate({type: 'token', token: token.token});
      return github;
    });
  }

  // https://developer.github.com/early-access/integrations/authentication/#as-an-installation
  function createToken(installationId) {
    return asIntegration().then(github => {
      return github.integrations.createInstallationToken({
        installation_id: installationId
      });
    });
  }

  // Internal - no need to exose this right now
  function generateJwt(id, cert) {
    const payload = {
      iat: Math.floor(new Date() / 1000),       // issued at time
      exp: Math.floor(new Date() / 1000) + 60,  // JWT expiration time
      iss: id                                   // Integration's GitHub id
    };

    // sign with RSA SHA256
    return jwt.sign(payload, cert, {algorithm: 'RS256'});
  }

  return {asIntegration, asInstallation, createToken};
};
