const express = require('express');
const path = require('path');
const petname = require('node-petname');
const uuid = require('uuid/v4');

module.exports = function(app, messenger){
    
  // app.get('/api/drive', (req, res) => {
  //   res.send({
  //     express: 'Hello From Express'
  //   });
  // });
  
  app.get('/api/clients', (req, res) => {
    const clients = messenger.clients.getClientNames();
    res.send(clients);
  });

  app.get('/api/waiting', (req, res) => {
    const clients = messenger.clients.getWaitList();
    res.send(clients);
  });

  app.get('/api/connect', (req, res) => {
    const msg = {
      username: petname(2, '-'),
      uuid: uuid(),
      wsUrl: process.env.WS_URL,
      wsPort: process.env.WS_PORT
    };
    res.send(msg);
  });
  
  if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.resolve(__dirname, '../../client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
    });
  }
  else {
    app.use(express.static('public'));
    app.use('/static', express.static(__dirname + '/public'));
  }
  
}