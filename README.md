# GitHub Integration

NodeJS module for building [GitHub Integrations](https://developer.github.com/early-access/integrations/).

## Installation

```
npm install --save github-integration
```

## Usage

```js
const createIntegration = require('github-integration');

const integration = createIntegration({
  // Your integration id
  id: 987,
  // The private key for your integration, which can be downloaded from the
  // integration's settings: https://github.com/settings/integrations
  cert: require('fs').readFileSync('private-key.pem')
});
```

### `asInstallation`

Authenticate [as an installation](https://developer.github.com/early-access/integrations/authentication/#as-an-installation), returning a [github API client](https://github.com/mikedeboer/node-github), which can be used to call any of the [APIs supported by GitHub Integrations](https://developer.github.com/early-access/integrations/available-endpoints/):

```js
var installationId = 99999;

integration.asInstallation(installationId).then(github => {
  github.issues.createComment({
    owner: 'foo',
    repo: 'bar',
    number: 999,
    body: 'hello world!'
  });
});
```

### `asIntegration`

Authenticate [as an integration](https://developer.github.com/early-access/integrations/authentication/#as-an-integration), also returning an instance of the GitHub API client.

```js
integration.asIntegration().then(github => {
  console.log("Installations:")
  github.integrations.getInstallations({}).then(console.log);
});
```
