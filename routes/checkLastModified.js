const router = require('express').Router();

const basepath = '/api/v1/';

function relativeRoute(relativePath) {
  return path.resolve(basepath, relativePath).replace(/\\/g, '/');
}

function redirect(res, route, delay = 0) {
  console.log(`Redirecting to '${route}'...`);
  setTimeout(() => res.redirect(route), delay);
}

function redirectRelative(res, relativePath, delay = 0) {
  redirect(res, relativeRoute(relativePath));
}

router.get('/checklastmodified', (req, res) => {
  redirectRelative(res, '/');
});

module.exports = { basepath, route: router };