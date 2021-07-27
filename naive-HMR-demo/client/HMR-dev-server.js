if (true) {
  let lastHash;
  function upToDate() {
    return lastHash.indexOf(__webpack_hash__) >= 0;
  }
  function check() {
    console.log('[HMR-dev-server check]', 'start check');
    module.hot
      .check(true)
      .then(function (updateModules) {
        console.log('[HMR-dev-server check]', 'hot update success');
      })
      .catch((err) => {
        console.log('[HMR-dev-server check]', 'hot update fail');
        window.location.reload();
      });
  }
  const hotEmitter = require('./emitter');
  hotEmitter.on('webpackHotUpdate', function (currentHash) {
    console.log(
      '[HMR-dev-server received hash]',
      'currentHash:',
      currentHash,
      'lastHash:',
      lastHash,
      '__webpack_hash__:',
      __webpack_hash__
    );
    lastHash = currentHash;
    if (!upToDate()) check();
  });
} else {
  throw new Error('[HMR-dev-server.js]', 'HMR is disabled');
}
