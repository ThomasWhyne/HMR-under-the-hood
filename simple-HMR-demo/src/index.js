import log from './log';

function setTimer() {
  let count = 0;
  const h = document.createElement('h2');
  document.body.appendChild(h);
  function updateContent() {
    h.innerHTML = `page alive for ${count++} seconds`;
  }
  updateContent();
  return setInterval(updateContent, 1000);
}

setTimer();
log();
if (module.hot) {
  module.hot.accept('./log.js', () => {
    log();
  });
}
