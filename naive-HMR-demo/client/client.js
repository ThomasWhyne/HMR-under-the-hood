const hotEmitter = require('./emitter');
let currentHash;
const messageHandler = {
  connection(...args) {
    console.log('[connection]', args);
  },
  hash(hash) {
    console.log('[hash]', hash);
    currentHash = hash;
  },
  // webpack HMR doesn't do it this way !!!
  ok(hot) {
    console.log('[ok]', hot);
    if (!currentHash) return;
    if (hot) {
      console.log('[client ok hash]', currentHash);
      hotEmitter.emit('webpackHotUpdate', currentHash);
    }
  },
  error(...args) {
    console.error('[error]', args);
    window.location.reload();
  },
};

const socket = io('ws://localhost:5555');

Object.keys(messageHandler).forEach((k) => {
  socket.on(k, messageHandler[k]);
});
