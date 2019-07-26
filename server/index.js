const express = require('express');
const consola = require('consola');
const mongoose = require('mongoose');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const dbPath = require('../blog.config')
    .mongoUrl;

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// 连接MongoDB
mongoose.connect(dbPath, {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', err => {
    console.error(err);
    process.exit(1);
});

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
