#!/usr/bin/env node
// Dependencies:
//   * npm install github github-integration github-webhook-handler
//
// Usage: INTEGRATION_ID=417 node example.js

const createWebhook = require('github-webhook-handler');
const createIntegration = require('github-integration');
const http = require('http');
const fs = require('fs');

const webhook = createWebhook({
  path: '/',
  secret: process.env.WEBHOOK_SECRET || 'development'
});

const integration = createIntegration({
  id: process.env.INTEGRATION_ID,
  cert: process.env.PRIVATE_KEY || fs.readFileSync('private-key.pem'),
});

const server = http.createServer((req, res) => {
  webhook(req, res, err => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.end('Something has gone terribly wrong.');
    } else {
      res.statusCode = 404;
      res.end('no such location');
    }
  });
});

// Comment on opened issues
webhook.on('issues', function(event) {
  if(event.payload.action == 'opened') {
    console.log("event", event);
    integration.asInstallation(event.payload.installation.id).then(github => {
      github.issues.createComment({
        owner: event.payload.repository.owner.login,
        repo: event.payload.repository.name,
        number: event.payload.issue.number,
        body: 'Welcome to the robot uprising.'
      });
    });
  }
});

console.log("Listing on http://localhost:3000");
server.listen(3000);
