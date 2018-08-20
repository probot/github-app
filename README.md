# GitHub App authentication for @octokit/rest

> an @octokit/rest plugin for authenticating as a [GitHub App](https://developer.github.com/apps/) or installation

## Installation

```
npm install --save @octokit/github-app
```

## Usage

```js
const octokit = require('@octokit/rest')()
const githubApp = require('@octokit/github-app')
const fs = require('fs')

octokit.plugin(githubApp({
  id: 1234,
  pem: fs.readFileSync('private-key.pem', 'UTF-8')
}))
```

All requests are now authenticated [as the app](https://developer.github.com/apps/building-integrations/setting-up-and-registering-github-apps/about-authentication-options-for-github-apps/#authenticating-as-a-github-app).

```js
octokit.apps.getInstallations({}).then(res => {
  console.log('Installations:', res)  
})
```

To authenticate [as a specific installation](https://developer.github.com/apps/building-integrations/setting-up-and-registering-github-apps/about-authentication-options-for-github-apps/#authenticating-as-an-installation), which can be used to call any of the [APIs supported by GitHub Apps](https://developer.github.com/apps/building-integrations/setting-up-and-registering-github-apps/about-authentication-options-for-github-apps/#authenticating-as-an-installation), call `authenticate` with `type: 'installation'`:

```js
octokit.authenticate({
  type: 'installation',
  id: 12345
}).then(() => {
  octokit.issues.createComment({
    owner: 'foo',
    repo: 'bar',
    number: 999,
    body: 'hello world!'
  })
})
```

> **Important!** This plugin changes the API of `octokit.authenticate` to return a `Promise`. You _must_ wait for the Promise to resolve with `await` or by calling `.then()`.
