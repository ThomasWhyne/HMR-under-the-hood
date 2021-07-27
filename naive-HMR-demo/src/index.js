import log from './log';

function mountTimer() {
  let count = 0;
  const h = document.createElement('h2');
  document.body.appendChild(h);
  function updateContent() {
    h.innerHTML = `page alive for ${count++} seconds`;
  }
  updateContent();
  return setInterval(updateContent, 1000);
}

mountTimer();
log();
if (true) {
  module.hot.accept('./src/log.js', () => {
    __webpack_require__('./src/log.js').default();
  });
}
