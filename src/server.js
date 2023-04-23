require('dotenv').config();
const express = require('express');
const server = express();
const axios = require('axios');
const moment = require('moment');
const routes = require('./routes')
const path = require('path');

const PORT = process.env.PORT || 3000;

// determines middleware priorities and starts server
async function run() {
  // setup middlewares
  console.log('Setting up middlewares...');
  await useRoutes();

  // start server
  console.log('Starting listen server...');
  await listen();
}

// Define a route for the 'index.html' home page
async function homePage(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
  }

  // Make a GET request to the URL
  let response;
  try {
    response = await axios.get(url);
  } catch (error) {
    return res.status(400).json({ message: `Request failed! (${error})`});
  }

  // Check if the response contains a Last-Modified header
  if (response.headers['last-modified']) {
    const lastModified = moment(response.headers['last-modified']);
    const oneYearAgo = moment().subtract(1, 'years');

    // Check if the Last-Modified header is over a year old
    if (lastModified.isBefore(oneYearAgo)) {
      res.status(200).json({ message: 'The Last-Modified header is over a year old.' });
    } else {
      res.status(200).json({ message: 'The Last-Modified header is within the last year.' });
    }
  } else {
    res.status(400).json({ message: 'The URL does not contain a Last-Modified header.' });
  }
}

// routes
async function useRoutes() {
  console.log('> routes');
  return await routes.use(server, err => {
    console.error(err);
    process.exit(-1);
  });
}

// starts the http listen server
async function listen()
{
  server.get('/', homePage);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

run();