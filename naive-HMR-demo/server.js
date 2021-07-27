const path = require('path');
const webpack = require('webpack');
const express = require('express');
const diskFS = require('fs');
const MemoryFS = require('memory-fs');
const mime = require('mime');
const socketio = require('socket.io');
const http = require('http');
const config = require('./webpack.config');

const compiler = webpack(config);

class Server {
  /**
   * @param { webpack.Compiler } compiler
   */
  constructor(compiler) {
    this.compiler = compiler;
    this.lastHash = void 0;
    this.app = new express();
    this.app.use(this.createDevMiddleware());
    this.server = http.createServer(this.app);
    this.createSocket();
    compiler.hooks.done.tap('naive-dev-server', (stats) => {
      console.log('[compile done]', stats.hash);
      console.log('====================================================');
      this.lastHash = stats.hash;
      this.sockets.forEach((socket) => {
        socket.emit('hash', this.lastHash);
      });
      this.sockets.forEach((socket) => {
        socket.emit('ok', true);
      });
    });
    this.fs = compiler.outputFileSystem = new MemoryFS();
    const watch = compiler.watch({}, (err, stats) => {
      if (err) console.log(err);
      console.log('[assets]', this.fs.readdirSync(config.output.path));
    });
  }

  createSocket() {
    this.sockets = [];
    this.io = socketio(this.server);
    this.io.on('connection', (socket) => {
      this.sockets.push(socket);
      console.log('[sockeck connection]');
      socket.emit('hash');
      socket.emit('ok');
    });
  }

  createDevMiddleware() {
    const self = this;

    return function devMiddleware(req, res, next) {
      console.log('[req url]', req.url);
      if (req.url === '/favicon.ico') return res.sendStatus(404);
      if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        return res.end(
          diskFS.readFileSync(path.join(config.output.path, './index.html'))
        );
      }
      let filename = path.join(config.output.path, req.url.slice(1));
      let stats, errorThrown;
      try {
        stats = self.fs.statSync(filename);
        if (!stats.isFile()) filename = path.join(filename, './index.html');
        const content = self.fs.readFileSync(filename);
        const contentType = mime.getType(filename);
        res.setHeader('Content-Type', contentType);
        res.statusCode = res.statusCode || 200;
        return res.send(content);
      } catch (error) {
        errorThrown = true;
        res.sendStatus(404);
      }
    };
  }
  listen(port) {
    this.server.listen(port, () => {
      console.log(
        '[devServer]',
        `started on http://localhost:${port} successfully`
      );
    });
  }
}

const server = new Server(compiler);

server.listen(5555);
