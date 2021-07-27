/******/
(function (modules) {
  // webpackBootstrap
  /******/
  function hotDisposeChunk(chunkId) {
    /******/
    delete installedChunks[chunkId];
    /******/
  }
  /******/
  var parentHotUpdateCallback = window['webpackHotUpdate'];
  /******/
  window['webpackHotUpdate'] = // eslint-disable-next-line no-unused-vars
    /******/
    function webpackHotUpdateCallback(chunkId, moreModules) {
      /******/
      hotAddUpdateChunk(chunkId, moreModules);
      /******/
      if (parentHotUpdateCallback)
        parentHotUpdateCallback(chunkId, moreModules);
      /******/
    };
  /******/
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  function hotDownloadUpdateChunk(chunkId) {
    /******/
    var script = document.createElement('script');
    /******/
    script.charset = 'utf-8';
    /******/
    script.src =
      __webpack_require__.p +
      '' +
      chunkId +
      '.' +
      hotCurrentHash +
      '.hot-update.js';
    /******/
    if (null) script.crossOrigin = null;
    /******/
    document.head.appendChild(script);
    /******/
  }
  /******/
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  function hotDownloadManifest(requestTimeout) {
    /******/
    requestTimeout = requestTimeout || 10000;
    /******/
    return new Promise(function (resolve, reject) {
      /******/
      if (typeof XMLHttpRequest === 'undefined') {
        /******/
        return reject(new Error('No browser support'));
        /******/
      }
      /******/
      try {
        /******/
        var request = new XMLHttpRequest();
        /******/
        var requestPath =
          __webpack_require__.p + '' + hotCurrentHash + '.hot-update.json';
        /******/
        request.open('GET', requestPath, true);
        /******/
        request.timeout = requestTimeout;
        /******/
        request.send(null);
        /******/
      } catch (err) {
        /******/
        return reject(err);
        /******/
      }
      /******/
      request.onreadystatechange = function () {
        /******/
        if (request.readyState !== 4) return;
        /******/
        if (request.status === 0) {
          /******/
          // timeout
          /******/
          reject(
            /******/
            new Error(
              'Manifest request to ' + requestPath + ' timed out.'
            ) /******/
          );
          /******/
        } else if (request.status === 404) {
          /******/
          // no update available
          /******/
          resolve();
          /******/
        } else if (request.status !== 200 && request.status !== 304) {
          /******/
          // other failure
          /******/
          reject(new Error('Manifest request to ' + requestPath + ' failed.'));
          /******/
        } else {
          /******/
          // success
          /******/
          try {
            /******/
            var update = JSON.parse(request.responseText);
            /******/
          } catch (e) {
            /******/
            reject(e);
            /******/
            return;
            /******/
          }
          /******/
          resolve(update);
          /******/
        }
        /******/
      };
      /******/
    });
    /******/
  }
  /******/
  /******/
  var hotApplyOnUpdate = true;
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  var hotCurrentHash = 'a424f3ae206e1f572d83';
  /******/
  var hotRequestTimeout = 10000;
  /******/
  var hotCurrentModuleData = {};
  /******/
  var hotCurrentChildModule;
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  var hotCurrentParents = [];
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  var hotCurrentParentsTemp = [];
  /******/
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  function hotCreateRequire(moduleId) {
    /******/
    var me = installedModules[moduleId];
    /******/
    if (!me) return __webpack_require__;
    /******/
    var fn = function (request) {
      /******/
      if (me.hot.active) {
        /******/
        if (installedModules[request]) {
          /******/
          if (installedModules[request].parents.indexOf(moduleId) === -1) {
            /******/
            installedModules[request].parents.push(moduleId);
            /******/
          }
          /******/
        } else {
          /******/
          hotCurrentParents = [moduleId];
          /******/
          hotCurrentChildModule = request;
          /******/
        }
        /******/
        if (me.children.indexOf(request) === -1) {
          /******/
          me.children.push(request);
          /******/
        }
        /******/
      } else {
        /******/
        console.warn(
          /******/
          '[HMR] unexpected require(' /******/ +
            request /******/ +
            ') from disposed module ' /******/ +
            moduleId /******/
        );
        /******/
        hotCurrentParents = [];
        /******/
      }
      /******/
      return __webpack_require__(request);
      /******/
    };
    /******/
    var ObjectFactory = function ObjectFactory(name) {
      /******/
      return {
        /******/
        configurable: true,
        /******/
        enumerable: true,
        /******/
        get: function () {
          /******/
          return __webpack_require__[name];
          /******/
        },
        /******/
        set: function (value) {
          /******/
          __webpack_require__[name] = value;
          /******/
        } /******/,
      };
      /******/
    };
    /******/
    for (var name in __webpack_require__) {
      /******/
      if (
        /******/
        Object.prototype.hasOwnProperty.call(
          __webpack_require__,
          name
        ) /******/ &&
        name !== 'e' /******/ &&
        name !== 't' /******/
      ) {
        /******/
        Object.defineProperty(fn, name, ObjectFactory(name));
        /******/
      }
      /******/
    }
    /******/
    fn.e = function (chunkId) {
      /******/
      if (hotStatus === 'ready') hotSetStatus('prepare');
      /******/
      hotChunksLoading++;
      /******/
      return __webpack_require__
        .e(chunkId)
        .then(finishChunkLoading, function (err) {
          /******/
          finishChunkLoading();
          /******/
          throw err;
          /******/
        });
      /******/
      /******/
      function finishChunkLoading() {
        /******/
        hotChunksLoading--;
        /******/
        if (hotStatus === 'prepare') {
          /******/
          if (!hotWaitingFilesMap[chunkId]) {
            /******/
            hotEnsureUpdateChunk(chunkId);
            /******/
          }
          /******/
          if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
            /******/
            hotUpdateDownloaded();
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
    fn.t = function (value, mode) {
      /******/
      if (mode & 1) value = fn(value);
      /******/
      return __webpack_require__.t(value, mode & ~1);
      /******/
    };
    /******/
    return fn;
    /******/
  }
  /******/
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  function hotCreateModule(moduleId) {
    /******/
    var hot = {
      /******/
      // private stuff
      /******/
      _acceptedDependencies: {},
      /******/
      _declinedDependencies: {},
      /******/
      _selfAccepted: false,
      /******/
      _selfDeclined: false,
      /******/
      _disposeHandlers: [],
      /******/
      _main: hotCurrentChildModule !== moduleId,
      /******/
      /******/
      // Module API
      /******/
      active: true,
      /******/
      accept: function (dep, callback) {
        /******/
        if (dep === undefined) hot._selfAccepted = true;
        /******/ else if (typeof dep === 'function') hot._selfAccepted = dep;
        /******/ else if (typeof dep === 'object')
          /******/
          for (var i = 0; i < dep.length; i++)
            /******/
            hot._acceptedDependencies[dep[i]] = callback || function () {};
        /******/ else
          hot._acceptedDependencies[dep] = callback || function () {};
        /******/
      },
      /******/
      decline: function (dep) {
        /******/
        if (dep === undefined) hot._selfDeclined = true;
        /******/ else if (typeof dep === 'object')
          /******/
          for (var i = 0; i < dep.length; i++)
            /******/
            hot._declinedDependencies[dep[i]] = true;
        /******/ else hot._declinedDependencies[dep] = true;
        /******/
      },
      /******/
      dispose: function (callback) {
        /******/
        hot._disposeHandlers.push(callback);
        /******/
      },
      /******/
      addDisposeHandler: function (callback) {
        /******/
        hot._disposeHandlers.push(callback);
        /******/
      },
      /******/
      removeDisposeHandler: function (callback) {
        /******/
        var idx = hot._disposeHandlers.indexOf(callback);
        /******/
        if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
        /******/
      },
      /******/
      /******/
      // Management API
      /******/
      check: hotCheck,
      /******/
      apply: hotApply,
      /******/
      status: function (l) {
        /******/
        if (!l) return hotStatus;
        /******/
        hotStatusHandlers.push(l);
        /******/
      },
      /******/
      addStatusHandler: function (l) {
        /******/
        hotStatusHandlers.push(l);
        /******/
      },
      /******/
      removeStatusHandler: function (l) {
        /******/
        var idx = hotStatusHandlers.indexOf(l);
        /******/
        if (idx >= 0) hotStatusHandlers.splice(idx, 1);
        /******/
      },
      /******/
      /******/
      //inherit from previous dispose call
      /******/
      data: hotCurrentModuleData[moduleId] /******/,
    };
    /******/
    hotCurrentChildModule = undefined;
    /******/
    return hot;
    /******/
  }
  /******/
  /******/
  var hotStatusHandlers = [];
  /******/
  var hotStatus = 'idle';
  /******/
  /******/
  function hotSetStatus(newStatus) {
    /******/
    hotStatus = newStatus;
    /******/
    for (var i = 0; i < hotStatusHandlers.length; i++)
      /******/
      hotStatusHandlers[i].call(null, newStatus);
    /******/
  }
  /******/
  /******/
  // while downloading
  /******/
  var hotWaitingFiles = 0;
  /******/
  var hotChunksLoading = 0;
  /******/
  var hotWaitingFilesMap = {};
  /******/
  var hotRequestedFilesMap = {};
  /******/
  var hotAvailableFilesMap = {};
  /******/
  var hotDeferred;
  /******/
  /******/
  // The update info
  /******/
  var hotUpdate, hotUpdateNewHash;
  /******/
  /******/
  function toModuleId(id) {
    /******/
    var isNumber = +id + '' === id;
    /******/
    return isNumber ? +id : id;
    /******/
  }
  /******/
  /******/
  function hotCheck(apply) {
    /******/
    if (hotStatus !== 'idle') {
      /******/
      throw new Error('check() is only allowed in idle status');
      /******/
    }
    /******/
    hotApplyOnUpdate = apply;
    /******/
    hotSetStatus('check');
    /******/
    return hotDownloadManifest(hotRequestTimeout).then(function (update) {
      /******/
      if (!update) {
        /******/
        hotSetStatus('idle');
        /******/
        return null;
        /******/
      }
      /******/
      hotRequestedFilesMap = {};
      /******/
      hotWaitingFilesMap = {};
      /******/
      hotAvailableFilesMap = update.c;
      /******/
      hotUpdateNewHash = update.h;
      /******/
      /******/
      hotSetStatus('prepare');
      /******/
      var promise = new Promise(function (resolve, reject) {
        /******/
        hotDeferred = {
          /******/
          resolve: resolve,
          /******/
          reject: reject /******/,
        };
        /******/
      });
      /******/
      hotUpdate = {};
      /******/
      var chunkId = 'main';
      /******/
      // eslint-disable-next-line no-lone-blocks
      /******/
      {
        /******/
        /*globals chunkId */
        /******/
        hotEnsureUpdateChunk(chunkId);
        /******/
      }
      /******/
      if (
        /******/
        hotStatus === 'prepare' /******/ &&
        hotChunksLoading === 0 /******/ &&
        hotWaitingFiles === 0 /******/
      ) {
        /******/
        hotUpdateDownloaded();
        /******/
      }
      /******/
      return promise;
      /******/
    });
    /******/
  }
  /******/
  /******/
  // eslint-disable-next-line no-unused-vars
  /******/
  function hotAddUpdateChunk(chunkId, moreModules) {
    /******/
    if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
      /******/
      return;
    /******/
    hotRequestedFilesMap[chunkId] = false;
    /******/
    for (var moduleId in moreModules) {
      /******/
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        /******/
        hotUpdate[moduleId] = moreModules[moduleId];
        /******/
      }
      /******/
    }
    /******/
    if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
      /******/
      hotUpdateDownloaded();
      /******/
    }
    /******/
  }
  /******/
  /******/
  function hotEnsureUpdateChunk(chunkId) {
    /******/
    if (!hotAvailableFilesMap[chunkId]) {
      /******/
      hotWaitingFilesMap[chunkId] = true;
      /******/
    } else {
      /******/
      hotRequestedFilesMap[chunkId] = true;
      /******/
      hotWaitingFiles++;
      /******/
      hotDownloadUpdateChunk(chunkId);
      /******/
    }
    /******/
  }
  /******/
  /******/
  function hotUpdateDownloaded() {
    /******/
    hotSetStatus('ready');
    /******/
    var deferred = hotDeferred;
    /******/
    hotDeferred = null;
    /******/
    if (!deferred) return;
    /******/
    if (hotApplyOnUpdate) {
      /******/
      // Wrap deferred object in Promise to mark it as a well-handled Promise to
      /******/
      // avoid triggering uncaught exception warning in Chrome.
      /******/
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
      /******/
      Promise.resolve() /******/
        .then(function () {
          /******/
          return hotApply(hotApplyOnUpdate);
          /******/
        }) /******/
        .then(
          /******/
          function (result) {
            /******/
            deferred.resolve(result);
            /******/
          } /******/,
          function (err) {
            /******/
            deferred.reject(err);
            /******/
          } /******/
        );
      /******/
    } else {
      /******/
      var outdatedModules = [];
      /******/
      for (var id in hotUpdate) {
        /******/
        if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
          /******/
          outdatedModules.push(toModuleId(id));
          /******/
        }
        /******/
      }
      /******/
      deferred.resolve(outdatedModules);
      /******/
    }
    /******/
  }
  /******/
  /******/
  function hotApply(options) {
    /******/
    if (hotStatus !== 'ready')
      /******/
      throw new Error('apply() is only allowed in ready status');
    /******/
    options = options || {};
    /******/
    /******/
    var cb;
    /******/
    var i;
    /******/
    var j;
    /******/
    var module;
    /******/
    var moduleId;
    /******/
    /******/
    function getAffectedStuff(updateModuleId) {
      /******/
      var outdatedModules = [updateModuleId];
      /******/
      var outdatedDependencies = {};
      /******/
      /******/
      var queue = outdatedModules.map(function (id) {
        /******/
        return {
          /******/
          chain: [id],
          /******/
          id: id /******/,
        };
        /******/
      });
      /******/
      while (queue.length > 0) {
        /******/
        var queueItem = queue.pop();
        /******/
        var moduleId = queueItem.id;
        /******/
        var chain = queueItem.chain;
        /******/
        module = installedModules[moduleId];
        /******/
        if (!module || module.hot._selfAccepted) continue;
        /******/
        if (module.hot._selfDeclined) {
          /******/
          return {
            /******/
            type: 'self-declined',
            /******/
            chain: chain,
            /******/
            moduleId: moduleId /******/,
          };
          /******/
        }
        /******/
        if (module.hot._main) {
          /******/
          return {
            /******/
            type: 'unaccepted',
            /******/
            chain: chain,
            /******/
            moduleId: moduleId /******/,
          };
          /******/
        }
        /******/
        for (var i = 0; i < module.parents.length; i++) {
          /******/
          var parentId = module.parents[i];
          /******/
          var parent = installedModules[parentId];
          /******/
          if (!parent) continue;
          /******/
          if (parent.hot._declinedDependencies[moduleId]) {
            /******/
            return {
              /******/
              type: 'declined',
              /******/
              chain: chain.concat([parentId]),
              /******/
              moduleId: moduleId,
              /******/
              parentId: parentId /******/,
            };
            /******/
          }
          /******/
          if (outdatedModules.indexOf(parentId) !== -1) continue;
          /******/
          if (parent.hot._acceptedDependencies[moduleId]) {
            /******/
            if (!outdatedDependencies[parentId])
              /******/
              outdatedDependencies[parentId] = [];
            /******/
            addAllToSet(outdatedDependencies[parentId], [moduleId]);
            /******/
            continue;
            /******/
          }
          /******/
          delete outdatedDependencies[parentId];
          /******/
          outdatedModules.push(parentId);
          /******/
          queue.push({
            /******/
            chain: chain.concat([parentId]),
            /******/
            id: parentId /******/,
          });
          /******/
        }
        /******/
      }
      /******/
      /******/
      return {
        /******/
        type: 'accepted',
        /******/
        moduleId: updateModuleId,
        /******/
        outdatedModules: outdatedModules,
        /******/
        outdatedDependencies: outdatedDependencies /******/,
      };
      /******/
    }
    /******/
    /******/
    function addAllToSet(a, b) {
      /******/
      for (var i = 0; i < b.length; i++) {
        /******/
        var item = b[i];
        /******/
        if (a.indexOf(item) === -1) a.push(item);
        /******/
      }
      /******/
    }
    /******/
    /******/
    // at begin all updates modules are outdated
    /******/
    // the "outdated" status can propagate to parents if they don't accept the children
    /******/
    var outdatedDependencies = {};
    /******/
    var outdatedModules = [];
    /******/
    var appliedUpdate = {};
    /******/
    /******/
    var warnUnexpectedRequire = function warnUnexpectedRequire() {
      /******/
      console.warn(
        /******/
        '[HMR] unexpected require(' +
          result.moduleId +
          ') to disposed module' /******/
      );
      /******/
    };
    /******/
    /******/
    for (var id in hotUpdate) {
      /******/
      if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
        /******/
        moduleId = toModuleId(id);
        /******/
        /** @type {TODO} */
        /******/
        var result;
        /******/
        if (hotUpdate[id]) {
          /******/
          result = getAffectedStuff(moduleId);
          /******/
        } else {
          /******/
          result = {
            /******/
            type: 'disposed',
            /******/
            moduleId: id /******/,
          };
          /******/
        }
        /******/
        /** @type {Error|false} */
        /******/
        var abortError = false;
        /******/
        var doApply = false;
        /******/
        var doDispose = false;
        /******/
        var chainInfo = '';
        /******/
        if (result.chain) {
          /******/
          chainInfo = '\nUpdate propagation: ' + result.chain.join(' -> ');
          /******/
        }
        /******/
        switch (result.type) {
          /******/
          case 'self-declined':
            /******/
            if (options.onDeclined) options.onDeclined(result);
            /******/
            if (!options.ignoreDeclined)
              /******/
              abortError = new Error(
                /******/ 'Aborted because of self decline: ' /******/ +
                  result.moduleId /******/ +
                  chainInfo /******/
              );
            /******/
            break;
          /******/
          case 'declined':
            /******/
            if (options.onDeclined) options.onDeclined(result);
            /******/
            if (!options.ignoreDeclined)
              /******/
              abortError = new Error(
                /******/ 'Aborted because of declined dependency: ' /******/ +
                  result.moduleId /******/ +
                  ' in ' /******/ +
                  result.parentId /******/ +
                  chainInfo /******/
              );
            /******/
            break;
          /******/
          case 'unaccepted':
            /******/
            if (options.onUnaccepted) options.onUnaccepted(result);
            /******/
            if (!options.ignoreUnaccepted)
              /******/
              abortError = new Error(
                /******/ 'Aborted because ' +
                  moduleId +
                  ' is not accepted' +
                  chainInfo /******/
              );
            /******/
            break;
          /******/
          case 'accepted':
            /******/
            if (options.onAccepted) options.onAccepted(result);
            /******/
            doApply = true;
            /******/
            break;
          /******/
          case 'disposed':
            /******/
            if (options.onDisposed) options.onDisposed(result);
            /******/
            doDispose = true;
            /******/
            break;
          /******/
          default:
            /******/
            throw new Error('Unexception type ' + result.type);
          /******/
        }
        /******/
        if (abortError) {
          /******/
          hotSetStatus('abort');
          /******/
          return Promise.reject(abortError);
          /******/
        }
        /******/
        if (doApply) {
          /******/
          appliedUpdate[moduleId] = hotUpdate[moduleId];
          /******/
          addAllToSet(outdatedModules, result.outdatedModules);
          /******/
          for (moduleId in result.outdatedDependencies) {
            /******/
            if (
              /******/
              Object.prototype.hasOwnProperty.call(
                /******/
                result.outdatedDependencies /******/,
                moduleId /******/
              ) /******/
            ) {
              /******/
              if (!outdatedDependencies[moduleId])
                /******/
                outdatedDependencies[moduleId] = [];
              /******/
              addAllToSet(
                /******/
                outdatedDependencies[moduleId] /******/,
                result.outdatedDependencies[moduleId] /******/
              );
              /******/
            }
            /******/
          }
          /******/
        }
        /******/
        if (doDispose) {
          /******/
          addAllToSet(outdatedModules, [result.moduleId]);
          /******/
          appliedUpdate[moduleId] = warnUnexpectedRequire;
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
    /******/
    // Store self accepted outdated modules to require them later by the module system
    /******/
    var outdatedSelfAcceptedModules = [];
    /******/
    for (i = 0; i < outdatedModules.length; i++) {
      /******/
      moduleId = outdatedModules[i];
      /******/
      if (
        /******/
        installedModules[moduleId] /******/ &&
        installedModules[moduleId].hot._selfAccepted /******/ &&
        // removed self-accepted modules should not be required
        /******/
        appliedUpdate[moduleId] !== warnUnexpectedRequire /******/
      ) {
        /******/
        outdatedSelfAcceptedModules.push({
          /******/
          module: moduleId,
          /******/
          errorHandler: installedModules[moduleId].hot._selfAccepted /******/,
        });
        /******/
      }
      /******/
    }
    /******/
    /******/
    // Now in "dispose" phase
    /******/
    hotSetStatus('dispose');
    /******/
    Object.keys(hotAvailableFilesMap).forEach(function (chunkId) {
      /******/
      if (hotAvailableFilesMap[chunkId] === false) {
        /******/
        hotDisposeChunk(chunkId);
        /******/
      }
      /******/
    });
    /******/
    /******/
    var idx;
    /******/
    var queue = outdatedModules.slice();
    /******/
    while (queue.length > 0) {
      /******/
      moduleId = queue.pop();
      /******/
      module = installedModules[moduleId];
      /******/
      if (!module) continue;
      /******/
      /******/
      var data = {};
      /******/
      /******/
      // Call dispose handlers
      /******/
      var disposeHandlers = module.hot._disposeHandlers;
      /******/
      for (j = 0; j < disposeHandlers.length; j++) {
        /******/
        cb = disposeHandlers[j];
        /******/
        cb(data);
        /******/
      }
      /******/
      hotCurrentModuleData[moduleId] = data;
      /******/
      /******/
      // disable module (this disables requires from this module)
      /******/
      module.hot.active = false;
      /******/
      /******/
      // remove module from cache
      /******/
      delete installedModules[moduleId];
      /******/
      /******/
      // when disposing there is no need to call dispose handler
      /******/
      delete outdatedDependencies[moduleId];
      /******/
      /******/
      // remove "parents" references from all children
      /******/
      for (j = 0; j < module.children.length; j++) {
        /******/
        var child = installedModules[module.children[j]];
        /******/
        if (!child) continue;
        /******/
        idx = child.parents.indexOf(moduleId);
        /******/
        if (idx >= 0) {
          /******/
          child.parents.splice(idx, 1);
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
    /******/
    // remove outdated dependency from module children
    /******/
    var dependency;
    /******/
    var moduleOutdatedDependencies;
    /******/
    for (moduleId in outdatedDependencies) {
      /******/
      if (
        /******/
        Object.prototype.hasOwnProperty.call(
          outdatedDependencies,
          moduleId
        ) /******/
      ) {
        /******/
        module = installedModules[moduleId];
        /******/
        if (module) {
          /******/
          moduleOutdatedDependencies = outdatedDependencies[moduleId];
          /******/
          for (j = 0; j < moduleOutdatedDependencies.length; j++) {
            /******/
            dependency = moduleOutdatedDependencies[j];
            /******/
            idx = module.children.indexOf(dependency);
            /******/
            if (idx >= 0) module.children.splice(idx, 1);
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
    /******/
    // Now in "apply" phase
    /******/
    hotSetStatus('apply');
    /******/
    /******/
    hotCurrentHash = hotUpdateNewHash;
    /******/
    /******/
    // insert new code
    /******/
    for (moduleId in appliedUpdate) {
      /******/
      if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
        /******/
        modules[moduleId] = appliedUpdate[moduleId];
        /******/
      }
      /******/
    }
    /******/
    /******/
    // call accept handlers
    /******/
    var error = null;
    /******/
    for (moduleId in outdatedDependencies) {
      /******/
      if (
        /******/
        Object.prototype.hasOwnProperty.call(
          outdatedDependencies,
          moduleId
        ) /******/
      ) {
        /******/
        module = installedModules[moduleId];
        /******/
        if (module) {
          /******/
          moduleOutdatedDependencies = outdatedDependencies[moduleId];
          /******/
          var callbacks = [];
          /******/
          for (i = 0; i < moduleOutdatedDependencies.length; i++) {
            /******/
            dependency = moduleOutdatedDependencies[i];
            /******/
            cb = module.hot._acceptedDependencies[dependency];
            /******/
            if (cb) {
              /******/
              if (callbacks.indexOf(cb) !== -1) continue;
              /******/
              callbacks.push(cb);
              /******/
            }
            /******/
          }
          /******/
          for (i = 0; i < callbacks.length; i++) {
            /******/
            cb = callbacks[i];
            /******/
            try {
              /******/
              cb(moduleOutdatedDependencies);
              /******/
            } catch (err) {
              /******/
              if (options.onErrored) {
                /******/
                options.onErrored({
                  /******/
                  type: 'accept-errored',
                  /******/
                  moduleId: moduleId,
                  /******/
                  dependencyId: moduleOutdatedDependencies[i],
                  /******/
                  error: err /******/,
                });
                /******/
              }
              /******/
              if (!options.ignoreErrored) {
                /******/
                if (!error) error = err;
                /******/
              }
              /******/
            }
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
    /******/
    // Load self accepted modules
    /******/
    for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
      /******/
      var item = outdatedSelfAcceptedModules[i];
      /******/
      moduleId = item.module;
      /******/
      hotCurrentParents = [moduleId];
      /******/
      try {
        /******/
        __webpack_require__(moduleId);
        /******/
      } catch (err) {
        /******/
        if (typeof item.errorHandler === 'function') {
          /******/
          try {
            /******/
            item.errorHandler(err);
            /******/
          } catch (err2) {
            /******/
            if (options.onErrored) {
              /******/
              options.onErrored({
                /******/
                type: 'self-accept-error-handler-errored',
                /******/
                moduleId: moduleId,
                /******/
                error: err2,
                /******/
                originalError: err /******/,
              });
              /******/
            }
            /******/
            if (!options.ignoreErrored) {
              /******/
              if (!error) error = err2;
              /******/
            }
            /******/
            if (!error) error = err;
            /******/
          }
          /******/
        } else {
          /******/
          if (options.onErrored) {
            /******/
            options.onErrored({
              /******/
              type: 'self-accept-errored',
              /******/
              moduleId: moduleId,
              /******/
              error: err /******/,
            });
            /******/
          }
          /******/
          if (!options.ignoreErrored) {
            /******/
            if (!error) error = err;
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
    /******/
    // handle errors in accept handlers and self accepted module load
    /******/
    if (error) {
      /******/
      hotSetStatus('fail');
      /******/
      return Promise.reject(error);
      /******/
    }
    /******/
    /******/
    hotSetStatus('idle');
    /******/
    return new Promise(function (resolve) {
      /******/
      resolve(outdatedModules);
      /******/
    });
    /******/
  }
  /******/
  /******/
  // The module cache
  /******/
  var installedModules = {};
  /******/
  /******/
  // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/
    // Check if module is in cache
    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/
    // Create a new module (and put it into the cache)
    /******/
    var module = (installedModules[moduleId] = {
      /******/
      i: moduleId,
      /******/
      l: false,
      /******/
      exports: {},
      /******/
      hot: hotCreateModule(moduleId),
      /******/
      parents:
        ((hotCurrentParentsTemp = hotCurrentParents),
        (hotCurrentParents = []),
        hotCurrentParentsTemp),
      /******/
      children: [] /******/,
    });
    /******/
    /******/
    // Execute the module function
    /******/
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      hotCreateRequire(moduleId)
    );
    /******/
    /******/
    // Flag the module as loaded
    /******/
    module.l = true;
    /******/
    /******/
    // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }
  /******/
  /******/
  /******/
  // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/
  // expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/
  // define getter function for harmony exports
  /******/
  __webpack_require__.d = function (exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
      /******/
    }
    /******/
  };
  /******/
  /******/
  // define __esModule on exports
  /******/
  __webpack_require__.r = function (exports) {
    /******/
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module',
      });
      /******/
    }
    /******/
    Object.defineProperty(exports, '__esModule', {
      value: true,
    });
    /******/
  };
  /******/
  /******/
  // create a fake namespace object
  /******/
  // mode & 1: value is a module id, require it
  /******/
  // mode & 2: merge all properties of value into the ns
  /******/
  // mode & 4: return value when already ns object
  /******/
  // mode & 8|1: behave like require
  /******/
  __webpack_require__.t = function (value, mode) {
    /******/
    if (mode & 1) value = __webpack_require__(value);
    /******/
    if (mode & 8) return value;
    /******/
    if (mode & 4 && typeof value === 'object' && value && value.__esModule)
      return value;
    /******/
    var ns = Object.create(null);
    /******/
    __webpack_require__.r(ns);
    /******/
    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value,
    });
    /******/
    if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    /******/
    return ns;
    /******/
  };
  /******/
  /******/
  // getDefaultExport function for compatibility with non-harmony modules
  /******/
  __webpack_require__.n = function (module) {
    /******/
    var getter =
      module && module.__esModule /******/
        ? function getDefault() {
            return module['default'];
          }
        : /******/
          function getModuleExports() {
            return module;
          };
    /******/
    __webpack_require__.d(getter, 'a', getter);
    /******/
    return getter;
    /******/
  };
  /******/
  /******/
  // Object.prototype.hasOwnProperty.call
  /******/
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/
  // __webpack_public_path__
  /******/
  __webpack_require__.p = '/build/';
  /******/
  /******/
  // __webpack_hash__
  /******/
  __webpack_require__.h = function () {
    return hotCurrentHash;
  };
  /******/
  /******/
  /******/
  // Load entry module and return exports
  /******/
  return hotCreateRequire(0)((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/
  {
    /***/
    /*!*****************************************!*\
  !*** ./node_modules/ansi-html/index.js ***!
  \*****************************************/
    './node_modules/ansi-html/index.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n\nmodule.exports = ansiHTML\n\n// Reference to https://github.com/sindresorhus/ansi-regex\nvar _regANSI = /(?:(?:\\u001b\\[)|\\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\\u001b[A-M]/\n\nvar _defColors = {\n  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]\n  black: '000',\n  red: 'ff0000',\n  green: '209805',\n  yellow: 'e8bf03',\n  blue: '0000ff',\n  magenta: 'ff00ff',\n  cyan: '00ffee',\n  lightgrey: 'f0f0f0',\n  darkgrey: '888'\n}\nvar _styles = {\n  30: 'black',\n  31: 'red',\n  32: 'green',\n  33: 'yellow',\n  34: 'blue',\n  35: 'magenta',\n  36: 'cyan',\n  37: 'lightgrey'\n}\nvar _openTags = {\n  '1': 'font-weight:bold', // bold\n  '2': 'opacity:0.5', // dim\n  '3': '<i>', // italic\n  '4': '<u>', // underscore\n  '8': 'display:none', // hidden\n  '9': '<del>' // delete\n}\nvar _closeTags = {\n  '23': '</i>', // reset italic\n  '24': '</u>', // reset underscore\n  '29': '</del>' // reset delete\n}\n\n;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {\n  _closeTags[n] = '</span>'\n})\n\n/**\n * Converts text with ANSI color codes to HTML markup.\n * @param {String} text\n * @returns {*}\n */\nfunction ansiHTML (text) {\n  // Returns the text if the string has no ANSI escape code.\n  if (!_regANSI.test(text)) {\n    return text\n  }\n\n  // Cache opened sequence.\n  var ansiCodes = []\n  // Replace with markup.\n  var ret = text.replace(/\\033\\[(\\d+)*m/g, function (match, seq) {\n    var ot = _openTags[seq]\n    if (ot) {\n      // If current sequence has been opened, close it.\n      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast\n        ansiCodes.pop()\n        return '</span>'\n      }\n      // Open tag.\n      ansiCodes.push(seq)\n      return ot[0] === '<' ? ot : '<span style=\"' + ot + ';\">'\n    }\n\n    var ct = _closeTags[seq]\n    if (ct) {\n      // Pop sequence\n      ansiCodes.pop()\n      return ct\n    }\n    return ''\n  })\n\n  // Make sure tags are closed.\n  var l = ansiCodes.length\n  ;(l > 0) && (ret += Array(l + 1).join('</span>'))\n\n  return ret\n}\n\n/**\n * Customize colors.\n * @param {Object} colors reference to _defColors\n */\nansiHTML.setColors = function (colors) {\n  if (typeof colors !== 'object') {\n    throw new Error('`colors` parameter must be an Object.')\n  }\n\n  var _finalColors = {}\n  for (var key in _defColors) {\n    var hex = colors.hasOwnProperty(key) ? colors[key] : null\n    if (!hex) {\n      _finalColors[key] = _defColors[key]\n      continue\n    }\n    if ('reset' === key) {\n      if (typeof hex === 'string') {\n        hex = [hex]\n      }\n      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {\n        return typeof h !== 'string'\n      })) {\n        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')\n      }\n      var defHexColor = _defColors[key]\n      if (!hex[0]) {\n        hex[0] = defHexColor[0]\n      }\n      if (hex.length === 1 || !hex[1]) {\n        hex = [hex[0]]\n        hex.push(defHexColor[1])\n      }\n\n      hex = hex.slice(0, 2)\n    } else if (typeof hex !== 'string') {\n      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')\n    }\n    _finalColors[key] = hex\n  }\n  _setTags(_finalColors)\n}\n\n/**\n * Reset colors.\n */\nansiHTML.reset = function () {\n  _setTags(_defColors)\n}\n\n/**\n * Expose tags, including open and close.\n * @type {Object}\n */\nansiHTML.tags = {}\n\nif (Object.defineProperty) {\n  Object.defineProperty(ansiHTML.tags, 'open', {\n    get: function () { return _openTags }\n  })\n  Object.defineProperty(ansiHTML.tags, 'close', {\n    get: function () { return _closeTags }\n  })\n} else {\n  ansiHTML.tags.open = _openTags\n  ansiHTML.tags.close = _closeTags\n}\n\nfunction _setTags (colors) {\n  // reset all\n  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]\n  // inverse\n  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]\n  // dark grey\n  _openTags['90'] = 'color:#' + colors.darkgrey\n\n  for (var code in _styles) {\n    var color = _styles[code]\n    var oriColor = colors[color] || '000'\n    _openTags[code] = 'color:#' + oriColor\n    code = parseInt(code)\n    _openTags[(code + 10).toString()] = 'background:#' + oriColor\n  }\n}\n\nansiHTML.reset()\n\n\n//# sourceURL=webpack:///./node_modules/ansi-html/index.js?"
        );

        /***/
      },

    /***/
    /*!******************************************!*\
  !*** ./node_modules/ansi-regex/index.js ***!
  \******************************************/
    './node_modules/ansi-regex/index.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\nmodule.exports = function () {\n\treturn /[\\u001b\\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;\n};\n\n\n//# sourceURL=webpack:///./node_modules/ansi-regex/index.js?'
        );

        /***/
      },

    /***/
    /*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
    './node_modules/events/events.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function errorListener(err) {\n      emitter.removeListener(name, resolver);\n      reject(err);\n    }\n\n    function resolver() {\n      if (typeof emitter.removeListener === 'function') {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n\n    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });\n    if (name !== 'error') {\n      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });\n    }\n  });\n}\n\nfunction addErrorHandlerIfEventEmitter(emitter, handler, flags) {\n  if (typeof emitter.on === 'function') {\n    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);\n  }\n}\n\nfunction eventTargetAgnosticAddListener(emitter, name, listener, flags) {\n  if (typeof emitter.on === 'function') {\n    if (flags.once) {\n      emitter.once(name, listener);\n    } else {\n      emitter.on(name, listener);\n    }\n  } else if (typeof emitter.addEventListener === 'function') {\n    // EventTarget does not have `error` event semantics like Node\n    // EventEmitters, we do not listen for `error` events here.\n    emitter.addEventListener(name, function wrapListener(arg) {\n      // IE does not have builtin `{ once: true }` support so we\n      // have to do it manually.\n      if (flags.once) {\n        emitter.removeEventListener(name, wrapListener);\n      }\n      listener(arg);\n    });\n  } else {\n    throw new TypeError('The \"emitter\" argument must be of type EventEmitter. Received type ' + typeof emitter);\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/events/events.js?"
        );

        /***/
      },

    /***/
    /*!**********************************************************!*\
  !*** ./node_modules/html-entities/lib/html4-entities.js ***!
  \**********************************************************/
    './node_modules/html-entities/lib/html4-entities.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ \"./node_modules/html-entities/lib/surrogate-pairs.js\");\nvar HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];\nvar HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];\nvar alphaIndex = {};\nvar numIndex = {};\n(function () {\n    var i = 0;\n    var length = HTML_ALPHA.length;\n    while (i < length) {\n        var a = HTML_ALPHA[i];\n        var c = HTML_CODES[i];\n        alphaIndex[a] = String.fromCharCode(c);\n        numIndex[c] = a;\n        i++;\n    }\n})();\nvar Html4Entities = /** @class */ (function () {\n    function Html4Entities() {\n    }\n    Html4Entities.prototype.decode = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        return str.replace(/&(#?[\\w\\d]+);?/g, function (s, entity) {\n            var chr;\n            if (entity.charAt(0) === \"#\") {\n                var code = entity.charAt(1).toLowerCase() === 'x' ?\n                    parseInt(entity.substr(2), 16) :\n                    parseInt(entity.substr(1));\n                if (!isNaN(code) || code >= -32768) {\n                    if (code <= 65535) {\n                        chr = String.fromCharCode(code);\n                    }\n                    else {\n                        chr = surrogate_pairs_1.fromCodePoint(code);\n                    }\n                }\n            }\n            else {\n                chr = alphaIndex[entity];\n            }\n            return chr || s;\n        });\n    };\n    Html4Entities.decode = function (str) {\n        return new Html4Entities().decode(str);\n    };\n    Html4Entities.prototype.encode = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var alpha = numIndex[str.charCodeAt(i)];\n            result += alpha ? \"&\" + alpha + \";\" : str.charAt(i);\n            i++;\n        }\n        return result;\n    };\n    Html4Entities.encode = function (str) {\n        return new Html4Entities().encode(str);\n    };\n    Html4Entities.prototype.encodeNonUTF = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var cc = str.charCodeAt(i);\n            var alpha = numIndex[cc];\n            if (alpha) {\n                result += \"&\" + alpha + \";\";\n            }\n            else if (cc < 32 || cc > 126) {\n                if (cc >= surrogate_pairs_1.highSurrogateFrom && cc <= surrogate_pairs_1.highSurrogateTo) {\n                    result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';\n                    i++;\n                }\n                else {\n                    result += '&#' + cc + ';';\n                }\n            }\n            else {\n                result += str.charAt(i);\n            }\n            i++;\n        }\n        return result;\n    };\n    Html4Entities.encodeNonUTF = function (str) {\n        return new Html4Entities().encodeNonUTF(str);\n    };\n    Html4Entities.prototype.encodeNonASCII = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var c = str.charCodeAt(i);\n            if (c <= 255) {\n                result += str[i++];\n                continue;\n            }\n            if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {\n                result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';\n                i++;\n            }\n            else {\n                result += '&#' + c + ';';\n            }\n            i++;\n        }\n        return result;\n    };\n    Html4Entities.encodeNonASCII = function (str) {\n        return new Html4Entities().encodeNonASCII(str);\n    };\n    return Html4Entities;\n}());\nexports.Html4Entities = Html4Entities;\n\n\n//# sourceURL=webpack:///./node_modules/html-entities/lib/html4-entities.js?"
        );

        /***/
      },

    /***/
    /*!**********************************************************!*\
  !*** ./node_modules/html-entities/lib/html5-entities.js ***!
  \**********************************************************/
    './node_modules/html-entities/lib/html5-entities.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ \"./node_modules/html-entities/lib/surrogate-pairs.js\");\nvar ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];\nvar DECODE_ONLY_ENTITIES = [['NewLine', [10]]];\nvar alphaIndex = {};\nvar charIndex = {};\ncreateIndexes(alphaIndex, charIndex);\nvar Html5Entities = /** @class */ (function () {\n    function Html5Entities() {\n    }\n    Html5Entities.prototype.decode = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        return str.replace(/&(#?[\\w\\d]+);?/g, function (s, entity) {\n            var chr;\n            if (entity.charAt(0) === \"#\") {\n                var code = entity.charAt(1) === 'x' ?\n                    parseInt(entity.substr(2).toLowerCase(), 16) :\n                    parseInt(entity.substr(1));\n                if (!isNaN(code) || code >= -32768) {\n                    if (code <= 65535) {\n                        chr = String.fromCharCode(code);\n                    }\n                    else {\n                        chr = surrogate_pairs_1.fromCodePoint(code);\n                    }\n                }\n            }\n            else {\n                chr = alphaIndex[entity];\n            }\n            return chr || s;\n        });\n    };\n    Html5Entities.decode = function (str) {\n        return new Html5Entities().decode(str);\n    };\n    Html5Entities.prototype.encode = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var charInfo = charIndex[str.charCodeAt(i)];\n            if (charInfo) {\n                var alpha = charInfo[str.charCodeAt(i + 1)];\n                if (alpha) {\n                    i++;\n                }\n                else {\n                    alpha = charInfo[''];\n                }\n                if (alpha) {\n                    result += \"&\" + alpha + \";\";\n                    i++;\n                    continue;\n                }\n            }\n            result += str.charAt(i);\n            i++;\n        }\n        return result;\n    };\n    Html5Entities.encode = function (str) {\n        return new Html5Entities().encode(str);\n    };\n    Html5Entities.prototype.encodeNonUTF = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var c = str.charCodeAt(i);\n            var charInfo = charIndex[c];\n            if (charInfo) {\n                var alpha = charInfo[str.charCodeAt(i + 1)];\n                if (alpha) {\n                    i++;\n                }\n                else {\n                    alpha = charInfo[''];\n                }\n                if (alpha) {\n                    result += \"&\" + alpha + \";\";\n                    i++;\n                    continue;\n                }\n            }\n            if (c < 32 || c > 126) {\n                if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {\n                    result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';\n                    i++;\n                }\n                else {\n                    result += '&#' + c + ';';\n                }\n            }\n            else {\n                result += str.charAt(i);\n            }\n            i++;\n        }\n        return result;\n    };\n    Html5Entities.encodeNonUTF = function (str) {\n        return new Html5Entities().encodeNonUTF(str);\n    };\n    Html5Entities.prototype.encodeNonASCII = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var c = str.charCodeAt(i);\n            if (c <= 255) {\n                result += str[i++];\n                continue;\n            }\n            if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {\n                result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';\n                i += 2;\n            }\n            else {\n                result += '&#' + c + ';';\n                i++;\n            }\n        }\n        return result;\n    };\n    Html5Entities.encodeNonASCII = function (str) {\n        return new Html5Entities().encodeNonASCII(str);\n    };\n    return Html5Entities;\n}());\nexports.Html5Entities = Html5Entities;\nfunction createIndexes(alphaIndex, charIndex) {\n    var i = ENTITIES.length;\n    while (i--) {\n        var _a = ENTITIES[i], alpha = _a[0], _b = _a[1], chr = _b[0], chr2 = _b[1];\n        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;\n        var charInfo = void 0;\n        if (addChar) {\n            charInfo = charIndex[chr] = charIndex[chr] || {};\n        }\n        if (chr2) {\n            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);\n            addChar && (charInfo[chr2] = alpha);\n        }\n        else {\n            alphaIndex[alpha] = String.fromCharCode(chr);\n            addChar && (charInfo[''] = alpha);\n        }\n    }\n    i = DECODE_ONLY_ENTITIES.length;\n    while (i--) {\n        var _c = DECODE_ONLY_ENTITIES[i], alpha = _c[0], _d = _c[1], chr = _d[0], chr2 = _d[1];\n        alphaIndex[alpha] = String.fromCharCode(chr) + (chr2 ? String.fromCharCode(chr2) : '');\n    }\n}\n\n\n//# sourceURL=webpack:///./node_modules/html-entities/lib/html5-entities.js?"
        );

        /***/
      },

    /***/
    /*!*************************************************!*\
  !*** ./node_modules/html-entities/lib/index.js ***!
  \*************************************************/
    './node_modules/html-entities/lib/index.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\nObject.defineProperty(exports, "__esModule", { value: true });\nvar xml_entities_1 = __webpack_require__(/*! ./xml-entities */ "./node_modules/html-entities/lib/xml-entities.js");\nexports.XmlEntities = xml_entities_1.XmlEntities;\nvar html4_entities_1 = __webpack_require__(/*! ./html4-entities */ "./node_modules/html-entities/lib/html4-entities.js");\nexports.Html4Entities = html4_entities_1.Html4Entities;\nvar html5_entities_1 = __webpack_require__(/*! ./html5-entities */ "./node_modules/html-entities/lib/html5-entities.js");\nexports.Html5Entities = html5_entities_1.Html5Entities;\nexports.AllHtmlEntities = html5_entities_1.Html5Entities;\n\n\n//# sourceURL=webpack:///./node_modules/html-entities/lib/index.js?'
        );

        /***/
      },

    /***/
    /*!***********************************************************!*\
  !*** ./node_modules/html-entities/lib/surrogate-pairs.js ***!
  \***********************************************************/
    './node_modules/html-entities/lib/surrogate-pairs.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\nObject.defineProperty(exports, "__esModule", { value: true });\nexports.fromCodePoint = String.fromCodePoint || function (astralCodePoint) {\n    return String.fromCharCode(Math.floor((astralCodePoint - 0x10000) / 0x400) + 0xD800, (astralCodePoint - 0x10000) % 0x400 + 0xDC00);\n};\nexports.getCodePoint = String.prototype.codePointAt ?\n    function (input, position) {\n        return input.codePointAt(position);\n    } :\n    function (input, position) {\n        return (input.charCodeAt(position) - 0xD800) * 0x400\n            + input.charCodeAt(position + 1) - 0xDC00 + 0x10000;\n    };\nexports.highSurrogateFrom = 0xD800;\nexports.highSurrogateTo = 0xDBFF;\n\n\n//# sourceURL=webpack:///./node_modules/html-entities/lib/surrogate-pairs.js?'
        );

        /***/
      },

    /***/
    /*!********************************************************!*\
  !*** ./node_modules/html-entities/lib/xml-entities.js ***!
  \********************************************************/
    './node_modules/html-entities/lib/xml-entities.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ \"./node_modules/html-entities/lib/surrogate-pairs.js\");\nvar ALPHA_INDEX = {\n    '&lt': '<',\n    '&gt': '>',\n    '&quot': '\"',\n    '&apos': '\\'',\n    '&amp': '&',\n    '&lt;': '<',\n    '&gt;': '>',\n    '&quot;': '\"',\n    '&apos;': '\\'',\n    '&amp;': '&'\n};\nvar CHAR_INDEX = {\n    60: 'lt',\n    62: 'gt',\n    34: 'quot',\n    39: 'apos',\n    38: 'amp'\n};\nvar CHAR_S_INDEX = {\n    '<': '&lt;',\n    '>': '&gt;',\n    '\"': '&quot;',\n    '\\'': '&apos;',\n    '&': '&amp;'\n};\nvar XmlEntities = /** @class */ (function () {\n    function XmlEntities() {\n    }\n    XmlEntities.prototype.encode = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        return str.replace(/[<>\"'&]/g, function (s) {\n            return CHAR_S_INDEX[s];\n        });\n    };\n    XmlEntities.encode = function (str) {\n        return new XmlEntities().encode(str);\n    };\n    XmlEntities.prototype.decode = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {\n            if (s.charAt(1) === '#') {\n                var code = s.charAt(2).toLowerCase() === 'x' ?\n                    parseInt(s.substr(3), 16) :\n                    parseInt(s.substr(2));\n                if (!isNaN(code) || code >= -32768) {\n                    if (code <= 65535) {\n                        return String.fromCharCode(code);\n                    }\n                    else {\n                        return surrogate_pairs_1.fromCodePoint(code);\n                    }\n                }\n                return '';\n            }\n            return ALPHA_INDEX[s] || s;\n        });\n    };\n    XmlEntities.decode = function (str) {\n        return new XmlEntities().decode(str);\n    };\n    XmlEntities.prototype.encodeNonUTF = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var c = str.charCodeAt(i);\n            var alpha = CHAR_INDEX[c];\n            if (alpha) {\n                result += \"&\" + alpha + \";\";\n                i++;\n                continue;\n            }\n            if (c < 32 || c > 126) {\n                if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {\n                    result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';\n                    i++;\n                }\n                else {\n                    result += '&#' + c + ';';\n                }\n            }\n            else {\n                result += str.charAt(i);\n            }\n            i++;\n        }\n        return result;\n    };\n    XmlEntities.encodeNonUTF = function (str) {\n        return new XmlEntities().encodeNonUTF(str);\n    };\n    XmlEntities.prototype.encodeNonASCII = function (str) {\n        if (!str || !str.length) {\n            return '';\n        }\n        var strLength = str.length;\n        var result = '';\n        var i = 0;\n        while (i < strLength) {\n            var c = str.charCodeAt(i);\n            if (c <= 255) {\n                result += str[i++];\n                continue;\n            }\n            if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {\n                result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';\n                i++;\n            }\n            else {\n                result += '&#' + c + ';';\n            }\n            i++;\n        }\n        return result;\n    };\n    XmlEntities.encodeNonASCII = function (str) {\n        return new XmlEntities().encodeNonASCII(str);\n    };\n    return XmlEntities;\n}());\nexports.XmlEntities = XmlEntities;\n\n\n//# sourceURL=webpack:///./node_modules/html-entities/lib/xml-entities.js?"
        );

        /***/
      },

    /***/
    /*!***********************************************!*\
  !*** ./node_modules/loglevel/lib/loglevel.js ***!
  \***********************************************/
    './node_modules/loglevel/lib/loglevel.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          'var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*\n* loglevel - https://github.com/pimterry/loglevel\n*\n* Copyright (c) 2013 Tim Perry\n* Licensed under the MIT license.\n*/\n(function (root, definition) {\n    "use strict";\n    if (true) {\n        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === \'function\' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    } else {}\n}(this, function () {\n    "use strict";\n\n    // Slightly dubious tricks to cut down minimized file size\n    var noop = function() {};\n    var undefinedType = "undefined";\n    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (\n        /Trident\\/|MSIE /.test(window.navigator.userAgent)\n    );\n\n    var logMethods = [\n        "trace",\n        "debug",\n        "info",\n        "warn",\n        "error"\n    ];\n\n    // Cross-browser bind equivalent that works at least back to IE6\n    function bindMethod(obj, methodName) {\n        var method = obj[methodName];\n        if (typeof method.bind === \'function\') {\n            return method.bind(obj);\n        } else {\n            try {\n                return Function.prototype.bind.call(method, obj);\n            } catch (e) {\n                // Missing bind shim or IE8 + Modernizr, fallback to wrapping\n                return function() {\n                    return Function.prototype.apply.apply(method, [obj, arguments]);\n                };\n            }\n        }\n    }\n\n    // Trace() doesn\'t print the message in IE, so for that case we need to wrap it\n    function traceForIE() {\n        if (console.log) {\n            if (console.log.apply) {\n                console.log.apply(console, arguments);\n            } else {\n                // In old IE, native console methods themselves don\'t have apply().\n                Function.prototype.apply.apply(console.log, [console, arguments]);\n            }\n        }\n        if (console.trace) console.trace();\n    }\n\n    // Build the best logging method possible for this env\n    // Wherever possible we want to bind, not wrap, to preserve stack traces\n    function realMethod(methodName) {\n        if (methodName === \'debug\') {\n            methodName = \'log\';\n        }\n\n        if (typeof console === undefinedType) {\n            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives\n        } else if (methodName === \'trace\' && isIE) {\n            return traceForIE;\n        } else if (console[methodName] !== undefined) {\n            return bindMethod(console, methodName);\n        } else if (console.log !== undefined) {\n            return bindMethod(console, \'log\');\n        } else {\n            return noop;\n        }\n    }\n\n    // These private functions always need `this` to be set properly\n\n    function replaceLoggingMethods(level, loggerName) {\n        /*jshint validthis:true */\n        for (var i = 0; i < logMethods.length; i++) {\n            var methodName = logMethods[i];\n            this[methodName] = (i < level) ?\n                noop :\n                this.methodFactory(methodName, level, loggerName);\n        }\n\n        // Define log.log as an alias for log.debug\n        this.log = this.debug;\n    }\n\n    // In old IE versions, the console isn\'t present until you first open it.\n    // We build realMethod() replacements here that regenerate logging methods\n    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {\n        return function () {\n            if (typeof console !== undefinedType) {\n                replaceLoggingMethods.call(this, level, loggerName);\n                this[methodName].apply(this, arguments);\n            }\n        };\n    }\n\n    // By default, we use closely bound real methods wherever possible, and\n    // otherwise we wait for a console to appear, and then try again.\n    function defaultMethodFactory(methodName, level, loggerName) {\n        /*jshint validthis:true */\n        return realMethod(methodName) ||\n               enableLoggingWhenConsoleArrives.apply(this, arguments);\n    }\n\n    function Logger(name, defaultLevel, factory) {\n      var self = this;\n      var currentLevel;\n\n      var storageKey = "loglevel";\n      if (typeof name === "string") {\n        storageKey += ":" + name;\n      } else if (typeof name === "symbol") {\n        storageKey = undefined;\n      }\n\n      function persistLevelIfPossible(levelNum) {\n          var levelName = (logMethods[levelNum] || \'silent\').toUpperCase();\n\n          if (typeof window === undefinedType || !storageKey) return;\n\n          // Use localStorage if available\n          try {\n              window.localStorage[storageKey] = levelName;\n              return;\n          } catch (ignore) {}\n\n          // Use session cookie as fallback\n          try {\n              window.document.cookie =\n                encodeURIComponent(storageKey) + "=" + levelName + ";";\n          } catch (ignore) {}\n      }\n\n      function getPersistedLevel() {\n          var storedLevel;\n\n          if (typeof window === undefinedType || !storageKey) return;\n\n          try {\n              storedLevel = window.localStorage[storageKey];\n          } catch (ignore) {}\n\n          // Fallback to cookies if local storage gives us nothing\n          if (typeof storedLevel === undefinedType) {\n              try {\n                  var cookie = window.document.cookie;\n                  var location = cookie.indexOf(\n                      encodeURIComponent(storageKey) + "=");\n                  if (location !== -1) {\n                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];\n                  }\n              } catch (ignore) {}\n          }\n\n          // If the stored level is not valid, treat it as if nothing was stored.\n          if (self.levels[storedLevel] === undefined) {\n              storedLevel = undefined;\n          }\n\n          return storedLevel;\n      }\n\n      /*\n       *\n       * Public logger API - see https://github.com/pimterry/loglevel for details\n       *\n       */\n\n      self.name = name;\n\n      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,\n          "ERROR": 4, "SILENT": 5};\n\n      self.methodFactory = factory || defaultMethodFactory;\n\n      self.getLevel = function () {\n          return currentLevel;\n      };\n\n      self.setLevel = function (level, persist) {\n          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {\n              level = self.levels[level.toUpperCase()];\n          }\n          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {\n              currentLevel = level;\n              if (persist !== false) {  // defaults to true\n                  persistLevelIfPossible(level);\n              }\n              replaceLoggingMethods.call(self, level, name);\n              if (typeof console === undefinedType && level < self.levels.SILENT) {\n                  return "No console available for logging";\n              }\n          } else {\n              throw "log.setLevel() called with invalid level: " + level;\n          }\n      };\n\n      self.setDefaultLevel = function (level) {\n          if (!getPersistedLevel()) {\n              self.setLevel(level, false);\n          }\n      };\n\n      self.enableAll = function(persist) {\n          self.setLevel(self.levels.TRACE, persist);\n      };\n\n      self.disableAll = function(persist) {\n          self.setLevel(self.levels.SILENT, persist);\n      };\n\n      // Initialize with the right level\n      var initialLevel = getPersistedLevel();\n      if (initialLevel == null) {\n          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;\n      }\n      self.setLevel(initialLevel, false);\n    }\n\n    /*\n     *\n     * Top-level API\n     *\n     */\n\n    var defaultLogger = new Logger();\n\n    var _loggersByName = {};\n    defaultLogger.getLogger = function getLogger(name) {\n        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {\n          throw new TypeError("You must supply a name when creating a logger.");\n        }\n\n        var logger = _loggersByName[name];\n        if (!logger) {\n          logger = _loggersByName[name] = new Logger(\n            name, defaultLogger.getLevel(), defaultLogger.methodFactory);\n        }\n        return logger;\n    };\n\n    // Grab the current global log variable in case of overwrite\n    var _log = (typeof window !== undefinedType) ? window.log : undefined;\n    defaultLogger.noConflict = function() {\n        if (typeof window !== undefinedType &&\n               window.log === defaultLogger) {\n            window.log = _log;\n        }\n\n        return defaultLogger;\n    };\n\n    defaultLogger.getLoggers = function getLoggers() {\n        return _loggersByName;\n    };\n\n    // ES6 default export, for compatibility\n    defaultLogger[\'default\'] = defaultLogger;\n\n    return defaultLogger;\n}));\n\n\n//# sourceURL=webpack:///./node_modules/loglevel/lib/loglevel.js?'
        );

        /***/
      },

    /***/
    /*!**************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/punycode/punycode.js ***!
  \**************************************************************************/
    './node_modules/node-libs-browser/node_modules/punycode/punycode.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          "/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */\n;(function(root) {\n\n\t/** Detect free variables */\n\tvar freeExports =  true && exports &&\n\t\t!exports.nodeType && exports;\n\tvar freeModule =  true && module &&\n\t\t!module.nodeType && module;\n\tvar freeGlobal = typeof global == 'object' && global;\n\tif (\n\t\tfreeGlobal.global === freeGlobal ||\n\t\tfreeGlobal.window === freeGlobal ||\n\t\tfreeGlobal.self === freeGlobal\n\t) {\n\t\troot = freeGlobal;\n\t}\n\n\t/**\n\t * The `punycode` object.\n\t * @name punycode\n\t * @type Object\n\t */\n\tvar punycode,\n\n\t/** Highest positive signed 32-bit float value */\n\tmaxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1\n\n\t/** Bootstring parameters */\n\tbase = 36,\n\ttMin = 1,\n\ttMax = 26,\n\tskew = 38,\n\tdamp = 700,\n\tinitialBias = 72,\n\tinitialN = 128, // 0x80\n\tdelimiter = '-', // '\\x2D'\n\n\t/** Regular expressions */\n\tregexPunycode = /^xn--/,\n\tregexNonASCII = /[^\\x20-\\x7E]/, // unprintable ASCII chars + non-ASCII chars\n\tregexSeparators = /[\\x2E\\u3002\\uFF0E\\uFF61]/g, // RFC 3490 separators\n\n\t/** Error messages */\n\terrors = {\n\t\t'overflow': 'Overflow: input needs wider integers to process',\n\t\t'not-basic': 'Illegal input >= 0x80 (not a basic code point)',\n\t\t'invalid-input': 'Invalid input'\n\t},\n\n\t/** Convenience shortcuts */\n\tbaseMinusTMin = base - tMin,\n\tfloor = Math.floor,\n\tstringFromCharCode = String.fromCharCode,\n\n\t/** Temporary variable */\n\tkey;\n\n\t/*--------------------------------------------------------------------------*/\n\n\t/**\n\t * A generic error utility function.\n\t * @private\n\t * @param {String} type The error type.\n\t * @returns {Error} Throws a `RangeError` with the applicable error message.\n\t */\n\tfunction error(type) {\n\t\tthrow new RangeError(errors[type]);\n\t}\n\n\t/**\n\t * A generic `Array#map` utility function.\n\t * @private\n\t * @param {Array} array The array to iterate over.\n\t * @param {Function} callback The function that gets called for every array\n\t * item.\n\t * @returns {Array} A new array of values returned by the callback function.\n\t */\n\tfunction map(array, fn) {\n\t\tvar length = array.length;\n\t\tvar result = [];\n\t\twhile (length--) {\n\t\t\tresult[length] = fn(array[length]);\n\t\t}\n\t\treturn result;\n\t}\n\n\t/**\n\t * A simple `Array#map`-like wrapper to work with domain name strings or email\n\t * addresses.\n\t * @private\n\t * @param {String} domain The domain name or email address.\n\t * @param {Function} callback The function that gets called for every\n\t * character.\n\t * @returns {Array} A new string of characters returned by the callback\n\t * function.\n\t */\n\tfunction mapDomain(string, fn) {\n\t\tvar parts = string.split('@');\n\t\tvar result = '';\n\t\tif (parts.length > 1) {\n\t\t\t// In email addresses, only the domain name should be punycoded. Leave\n\t\t\t// the local part (i.e. everything up to `@`) intact.\n\t\t\tresult = parts[0] + '@';\n\t\t\tstring = parts[1];\n\t\t}\n\t\t// Avoid `split(regex)` for IE8 compatibility. See #17.\n\t\tstring = string.replace(regexSeparators, '\\x2E');\n\t\tvar labels = string.split('.');\n\t\tvar encoded = map(labels, fn).join('.');\n\t\treturn result + encoded;\n\t}\n\n\t/**\n\t * Creates an array containing the numeric code points of each Unicode\n\t * character in the string. While JavaScript uses UCS-2 internally,\n\t * this function will convert a pair of surrogate halves (each of which\n\t * UCS-2 exposes as separate characters) into a single code point,\n\t * matching UTF-16.\n\t * @see `punycode.ucs2.encode`\n\t * @see <https://mathiasbynens.be/notes/javascript-encoding>\n\t * @memberOf punycode.ucs2\n\t * @name decode\n\t * @param {String} string The Unicode input string (UCS-2).\n\t * @returns {Array} The new array of code points.\n\t */\n\tfunction ucs2decode(string) {\n\t\tvar output = [],\n\t\t    counter = 0,\n\t\t    length = string.length,\n\t\t    value,\n\t\t    extra;\n\t\twhile (counter < length) {\n\t\t\tvalue = string.charCodeAt(counter++);\n\t\t\tif (value >= 0xD800 && value <= 0xDBFF && counter < length) {\n\t\t\t\t// high surrogate, and there is a next character\n\t\t\t\textra = string.charCodeAt(counter++);\n\t\t\t\tif ((extra & 0xFC00) == 0xDC00) { // low surrogate\n\t\t\t\t\toutput.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);\n\t\t\t\t} else {\n\t\t\t\t\t// unmatched surrogate; only append this code unit, in case the next\n\t\t\t\t\t// code unit is the high surrogate of a surrogate pair\n\t\t\t\t\toutput.push(value);\n\t\t\t\t\tcounter--;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\toutput.push(value);\n\t\t\t}\n\t\t}\n\t\treturn output;\n\t}\n\n\t/**\n\t * Creates a string based on an array of numeric code points.\n\t * @see `punycode.ucs2.decode`\n\t * @memberOf punycode.ucs2\n\t * @name encode\n\t * @param {Array} codePoints The array of numeric code points.\n\t * @returns {String} The new Unicode string (UCS-2).\n\t */\n\tfunction ucs2encode(array) {\n\t\treturn map(array, function(value) {\n\t\t\tvar output = '';\n\t\t\tif (value > 0xFFFF) {\n\t\t\t\tvalue -= 0x10000;\n\t\t\t\toutput += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);\n\t\t\t\tvalue = 0xDC00 | value & 0x3FF;\n\t\t\t}\n\t\t\toutput += stringFromCharCode(value);\n\t\t\treturn output;\n\t\t}).join('');\n\t}\n\n\t/**\n\t * Converts a basic code point into a digit/integer.\n\t * @see `digitToBasic()`\n\t * @private\n\t * @param {Number} codePoint The basic numeric code point value.\n\t * @returns {Number} The numeric value of a basic code point (for use in\n\t * representing integers) in the range `0` to `base - 1`, or `base` if\n\t * the code point does not represent a value.\n\t */\n\tfunction basicToDigit(codePoint) {\n\t\tif (codePoint - 48 < 10) {\n\t\t\treturn codePoint - 22;\n\t\t}\n\t\tif (codePoint - 65 < 26) {\n\t\t\treturn codePoint - 65;\n\t\t}\n\t\tif (codePoint - 97 < 26) {\n\t\t\treturn codePoint - 97;\n\t\t}\n\t\treturn base;\n\t}\n\n\t/**\n\t * Converts a digit/integer into a basic code point.\n\t * @see `basicToDigit()`\n\t * @private\n\t * @param {Number} digit The numeric value of a basic code point.\n\t * @returns {Number} The basic code point whose value (when used for\n\t * representing integers) is `digit`, which needs to be in the range\n\t * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is\n\t * used; else, the lowercase form is used. The behavior is undefined\n\t * if `flag` is non-zero and `digit` has no uppercase form.\n\t */\n\tfunction digitToBasic(digit, flag) {\n\t\t//  0..25 map to ASCII a..z or A..Z\n\t\t// 26..35 map to ASCII 0..9\n\t\treturn digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);\n\t}\n\n\t/**\n\t * Bias adaptation function as per section 3.4 of RFC 3492.\n\t * https://tools.ietf.org/html/rfc3492#section-3.4\n\t * @private\n\t */\n\tfunction adapt(delta, numPoints, firstTime) {\n\t\tvar k = 0;\n\t\tdelta = firstTime ? floor(delta / damp) : delta >> 1;\n\t\tdelta += floor(delta / numPoints);\n\t\tfor (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {\n\t\t\tdelta = floor(delta / baseMinusTMin);\n\t\t}\n\t\treturn floor(k + (baseMinusTMin + 1) * delta / (delta + skew));\n\t}\n\n\t/**\n\t * Converts a Punycode string of ASCII-only symbols to a string of Unicode\n\t * symbols.\n\t * @memberOf punycode\n\t * @param {String} input The Punycode string of ASCII-only symbols.\n\t * @returns {String} The resulting string of Unicode symbols.\n\t */\n\tfunction decode(input) {\n\t\t// Don't use UCS-2\n\t\tvar output = [],\n\t\t    inputLength = input.length,\n\t\t    out,\n\t\t    i = 0,\n\t\t    n = initialN,\n\t\t    bias = initialBias,\n\t\t    basic,\n\t\t    j,\n\t\t    index,\n\t\t    oldi,\n\t\t    w,\n\t\t    k,\n\t\t    digit,\n\t\t    t,\n\t\t    /** Cached calculation results */\n\t\t    baseMinusT;\n\n\t\t// Handle the basic code points: let `basic` be the number of input code\n\t\t// points before the last delimiter, or `0` if there is none, then copy\n\t\t// the first basic code points to the output.\n\n\t\tbasic = input.lastIndexOf(delimiter);\n\t\tif (basic < 0) {\n\t\t\tbasic = 0;\n\t\t}\n\n\t\tfor (j = 0; j < basic; ++j) {\n\t\t\t// if it's not a basic code point\n\t\t\tif (input.charCodeAt(j) >= 0x80) {\n\t\t\t\terror('not-basic');\n\t\t\t}\n\t\t\toutput.push(input.charCodeAt(j));\n\t\t}\n\n\t\t// Main decoding loop: start just after the last delimiter if any basic code\n\t\t// points were copied; start at the beginning otherwise.\n\n\t\tfor (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {\n\n\t\t\t// `index` is the index of the next character to be consumed.\n\t\t\t// Decode a generalized variable-length integer into `delta`,\n\t\t\t// which gets added to `i`. The overflow checking is easier\n\t\t\t// if we increase `i` as we go, then subtract off its starting\n\t\t\t// value at the end to obtain `delta`.\n\t\t\tfor (oldi = i, w = 1, k = base; /* no condition */; k += base) {\n\n\t\t\t\tif (index >= inputLength) {\n\t\t\t\t\terror('invalid-input');\n\t\t\t\t}\n\n\t\t\t\tdigit = basicToDigit(input.charCodeAt(index++));\n\n\t\t\t\tif (digit >= base || digit > floor((maxInt - i) / w)) {\n\t\t\t\t\terror('overflow');\n\t\t\t\t}\n\n\t\t\t\ti += digit * w;\n\t\t\t\tt = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);\n\n\t\t\t\tif (digit < t) {\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t\tbaseMinusT = base - t;\n\t\t\t\tif (w > floor(maxInt / baseMinusT)) {\n\t\t\t\t\terror('overflow');\n\t\t\t\t}\n\n\t\t\t\tw *= baseMinusT;\n\n\t\t\t}\n\n\t\t\tout = output.length + 1;\n\t\t\tbias = adapt(i - oldi, out, oldi == 0);\n\n\t\t\t// `i` was supposed to wrap around from `out` to `0`,\n\t\t\t// incrementing `n` each time, so we'll fix that now:\n\t\t\tif (floor(i / out) > maxInt - n) {\n\t\t\t\terror('overflow');\n\t\t\t}\n\n\t\t\tn += floor(i / out);\n\t\t\ti %= out;\n\n\t\t\t// Insert `n` at position `i` of the output\n\t\t\toutput.splice(i++, 0, n);\n\n\t\t}\n\n\t\treturn ucs2encode(output);\n\t}\n\n\t/**\n\t * Converts a string of Unicode symbols (e.g. a domain name label) to a\n\t * Punycode string of ASCII-only symbols.\n\t * @memberOf punycode\n\t * @param {String} input The string of Unicode symbols.\n\t * @returns {String} The resulting Punycode string of ASCII-only symbols.\n\t */\n\tfunction encode(input) {\n\t\tvar n,\n\t\t    delta,\n\t\t    handledCPCount,\n\t\t    basicLength,\n\t\t    bias,\n\t\t    j,\n\t\t    m,\n\t\t    q,\n\t\t    k,\n\t\t    t,\n\t\t    currentValue,\n\t\t    output = [],\n\t\t    /** `inputLength` will hold the number of code points in `input`. */\n\t\t    inputLength,\n\t\t    /** Cached calculation results */\n\t\t    handledCPCountPlusOne,\n\t\t    baseMinusT,\n\t\t    qMinusT;\n\n\t\t// Convert the input in UCS-2 to Unicode\n\t\tinput = ucs2decode(input);\n\n\t\t// Cache the length\n\t\tinputLength = input.length;\n\n\t\t// Initialize the state\n\t\tn = initialN;\n\t\tdelta = 0;\n\t\tbias = initialBias;\n\n\t\t// Handle the basic code points\n\t\tfor (j = 0; j < inputLength; ++j) {\n\t\t\tcurrentValue = input[j];\n\t\t\tif (currentValue < 0x80) {\n\t\t\t\toutput.push(stringFromCharCode(currentValue));\n\t\t\t}\n\t\t}\n\n\t\thandledCPCount = basicLength = output.length;\n\n\t\t// `handledCPCount` is the number of code points that have been handled;\n\t\t// `basicLength` is the number of basic code points.\n\n\t\t// Finish the basic string - if it is not empty - with a delimiter\n\t\tif (basicLength) {\n\t\t\toutput.push(delimiter);\n\t\t}\n\n\t\t// Main encoding loop:\n\t\twhile (handledCPCount < inputLength) {\n\n\t\t\t// All non-basic code points < n have been handled already. Find the next\n\t\t\t// larger one:\n\t\t\tfor (m = maxInt, j = 0; j < inputLength; ++j) {\n\t\t\t\tcurrentValue = input[j];\n\t\t\t\tif (currentValue >= n && currentValue < m) {\n\t\t\t\t\tm = currentValue;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,\n\t\t\t// but guard against overflow\n\t\t\thandledCPCountPlusOne = handledCPCount + 1;\n\t\t\tif (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {\n\t\t\t\terror('overflow');\n\t\t\t}\n\n\t\t\tdelta += (m - n) * handledCPCountPlusOne;\n\t\t\tn = m;\n\n\t\t\tfor (j = 0; j < inputLength; ++j) {\n\t\t\t\tcurrentValue = input[j];\n\n\t\t\t\tif (currentValue < n && ++delta > maxInt) {\n\t\t\t\t\terror('overflow');\n\t\t\t\t}\n\n\t\t\t\tif (currentValue == n) {\n\t\t\t\t\t// Represent delta as a generalized variable-length integer\n\t\t\t\t\tfor (q = delta, k = base; /* no condition */; k += base) {\n\t\t\t\t\t\tt = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);\n\t\t\t\t\t\tif (q < t) {\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tqMinusT = q - t;\n\t\t\t\t\t\tbaseMinusT = base - t;\n\t\t\t\t\t\toutput.push(\n\t\t\t\t\t\t\tstringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))\n\t\t\t\t\t\t);\n\t\t\t\t\t\tq = floor(qMinusT / baseMinusT);\n\t\t\t\t\t}\n\n\t\t\t\t\toutput.push(stringFromCharCode(digitToBasic(q, 0)));\n\t\t\t\t\tbias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);\n\t\t\t\t\tdelta = 0;\n\t\t\t\t\t++handledCPCount;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t++delta;\n\t\t\t++n;\n\n\t\t}\n\t\treturn output.join('');\n\t}\n\n\t/**\n\t * Converts a Punycode string representing a domain name or an email address\n\t * to Unicode. Only the Punycoded parts of the input will be converted, i.e.\n\t * it doesn't matter if you call it on a string that has already been\n\t * converted to Unicode.\n\t * @memberOf punycode\n\t * @param {String} input The Punycoded domain name or email address to\n\t * convert to Unicode.\n\t * @returns {String} The Unicode representation of the given Punycode\n\t * string.\n\t */\n\tfunction toUnicode(input) {\n\t\treturn mapDomain(input, function(string) {\n\t\t\treturn regexPunycode.test(string)\n\t\t\t\t? decode(string.slice(4).toLowerCase())\n\t\t\t\t: string;\n\t\t});\n\t}\n\n\t/**\n\t * Converts a Unicode string representing a domain name or an email address to\n\t * Punycode. Only the non-ASCII parts of the domain name will be converted,\n\t * i.e. it doesn't matter if you call it with a domain that's already in\n\t * ASCII.\n\t * @memberOf punycode\n\t * @param {String} input The domain name or email address to convert, as a\n\t * Unicode string.\n\t * @returns {String} The Punycode representation of the given domain name or\n\t * email address.\n\t */\n\tfunction toASCII(input) {\n\t\treturn mapDomain(input, function(string) {\n\t\t\treturn regexNonASCII.test(string)\n\t\t\t\t? 'xn--' + encode(string)\n\t\t\t\t: string;\n\t\t});\n\t}\n\n\t/*--------------------------------------------------------------------------*/\n\n\t/** Define the public API */\n\tpunycode = {\n\t\t/**\n\t\t * A string representing the current Punycode.js version number.\n\t\t * @memberOf punycode\n\t\t * @type String\n\t\t */\n\t\t'version': '1.4.1',\n\t\t/**\n\t\t * An object of methods to convert from JavaScript's internal character\n\t\t * representation (UCS-2) to Unicode code points, and back.\n\t\t * @see <https://mathiasbynens.be/notes/javascript-encoding>\n\t\t * @memberOf punycode\n\t\t * @type Object\n\t\t */\n\t\t'ucs2': {\n\t\t\t'decode': ucs2decode,\n\t\t\t'encode': ucs2encode\n\t\t},\n\t\t'decode': decode,\n\t\t'encode': encode,\n\t\t'toASCII': toASCII,\n\t\t'toUnicode': toUnicode\n\t};\n\n\t/** Expose `punycode` */\n\t// Some AMD build optimizers, like r.js, check for specific condition patterns\n\t// like the following:\n\tif (\n\t\ttrue\n\t) {\n\t\t!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {\n\t\t\treturn punycode;\n\t\t}).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t} else {}\n\n}(this));\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module), __webpack_require__(/*! ./../../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/node-libs-browser/node_modules/punycode/punycode.js?"
        );

        /***/
      },

    /***/
    /*!************************************************!*\
  !*** ./node_modules/querystring-es3/decode.js ***!
  \************************************************/
    './node_modules/querystring-es3/decode.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\n// If obj.hasOwnProperty has been overridden, then calling\n// obj.hasOwnProperty(prop) will break.\n// See: https://github.com/joyent/node/issues/1707\nfunction hasOwnProperty(obj, prop) {\n  return Object.prototype.hasOwnProperty.call(obj, prop);\n}\n\nmodule.exports = function(qs, sep, eq, options) {\n  sep = sep || '&';\n  eq = eq || '=';\n  var obj = {};\n\n  if (typeof qs !== 'string' || qs.length === 0) {\n    return obj;\n  }\n\n  var regexp = /\\+/g;\n  qs = qs.split(sep);\n\n  var maxKeys = 1000;\n  if (options && typeof options.maxKeys === 'number') {\n    maxKeys = options.maxKeys;\n  }\n\n  var len = qs.length;\n  // maxKeys <= 0 means that we should not limit keys count\n  if (maxKeys > 0 && len > maxKeys) {\n    len = maxKeys;\n  }\n\n  for (var i = 0; i < len; ++i) {\n    var x = qs[i].replace(regexp, '%20'),\n        idx = x.indexOf(eq),\n        kstr, vstr, k, v;\n\n    if (idx >= 0) {\n      kstr = x.substr(0, idx);\n      vstr = x.substr(idx + 1);\n    } else {\n      kstr = x;\n      vstr = '';\n    }\n\n    k = decodeURIComponent(kstr);\n    v = decodeURIComponent(vstr);\n\n    if (!hasOwnProperty(obj, k)) {\n      obj[k] = v;\n    } else if (isArray(obj[k])) {\n      obj[k].push(v);\n    } else {\n      obj[k] = [obj[k], v];\n    }\n  }\n\n  return obj;\n};\n\nvar isArray = Array.isArray || function (xs) {\n  return Object.prototype.toString.call(xs) === '[object Array]';\n};\n\n\n//# sourceURL=webpack:///./node_modules/querystring-es3/decode.js?"
        );

        /***/
      },

    /***/
    /*!************************************************!*\
  !*** ./node_modules/querystring-es3/encode.js ***!
  \************************************************/
    './node_modules/querystring-es3/encode.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar stringifyPrimitive = function(v) {\n  switch (typeof v) {\n    case 'string':\n      return v;\n\n    case 'boolean':\n      return v ? 'true' : 'false';\n\n    case 'number':\n      return isFinite(v) ? v : '';\n\n    default:\n      return '';\n  }\n};\n\nmodule.exports = function(obj, sep, eq, name) {\n  sep = sep || '&';\n  eq = eq || '=';\n  if (obj === null) {\n    obj = undefined;\n  }\n\n  if (typeof obj === 'object') {\n    return map(objectKeys(obj), function(k) {\n      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;\n      if (isArray(obj[k])) {\n        return map(obj[k], function(v) {\n          return ks + encodeURIComponent(stringifyPrimitive(v));\n        }).join(sep);\n      } else {\n        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));\n      }\n    }).join(sep);\n\n  }\n\n  if (!name) return '';\n  return encodeURIComponent(stringifyPrimitive(name)) + eq +\n         encodeURIComponent(stringifyPrimitive(obj));\n};\n\nvar isArray = Array.isArray || function (xs) {\n  return Object.prototype.toString.call(xs) === '[object Array]';\n};\n\nfunction map (xs, f) {\n  if (xs.map) return xs.map(f);\n  var res = [];\n  for (var i = 0; i < xs.length; i++) {\n    res.push(f(xs[i], i));\n  }\n  return res;\n}\n\nvar objectKeys = Object.keys || function (obj) {\n  var res = [];\n  for (var key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);\n  }\n  return res;\n};\n\n\n//# sourceURL=webpack:///./node_modules/querystring-es3/encode.js?"
        );

        /***/
      },

    /***/
    /*!***********************************************!*\
  !*** ./node_modules/querystring-es3/index.js ***!
  \***********************************************/
    './node_modules/querystring-es3/index.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\n\nexports.decode = exports.parse = __webpack_require__(/*! ./decode */ "./node_modules/querystring-es3/decode.js");\nexports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "./node_modules/querystring-es3/encode.js");\n\n\n//# sourceURL=webpack:///./node_modules/querystring-es3/index.js?'
        );

        /***/
      },

    /***/
    /*!***************************************************!*\
  !*** ./node_modules/sockjs-client/dist/sockjs.js ***!
  \***************************************************/
    './node_modules/sockjs-client/dist/sockjs.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          "/* WEBPACK VAR INJECTION */(function(global) {var require;var require;/* sockjs-client v1.5.1 | http://sockjs.org | MIT license */\n(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=\"function\"==typeof require&&require;if(!f&&c)return require(i,!0);if(u)return u(i,!0);var a=new Error(\"Cannot find module '\"+i+\"'\");throw a.code=\"MODULE_NOT_FOUND\",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=\"function\"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar transportList = require('./transport-list');\n\nmodule.exports = require('./main')(transportList);\n\n// TODO can't get rid of this until all servers do\nif ('_sockjs_onload' in global) {\n  setTimeout(global._sockjs_onload, 1);\n}\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"./main\":14,\"./transport-list\":16}],2:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , Event = require('./event')\n  ;\n\nfunction CloseEvent() {\n  Event.call(this);\n  this.initEvent('close', false, false);\n  this.wasClean = false;\n  this.code = 0;\n  this.reason = '';\n}\n\ninherits(CloseEvent, Event);\n\nmodule.exports = CloseEvent;\n\n},{\"./event\":4,\"inherits\":57}],3:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , EventTarget = require('./eventtarget')\n  ;\n\nfunction EventEmitter() {\n  EventTarget.call(this);\n}\n\ninherits(EventEmitter, EventTarget);\n\nEventEmitter.prototype.removeAllListeners = function(type) {\n  if (type) {\n    delete this._listeners[type];\n  } else {\n    this._listeners = {};\n  }\n};\n\nEventEmitter.prototype.once = function(type, listener) {\n  var self = this\n    , fired = false;\n\n  function g() {\n    self.removeListener(type, g);\n\n    if (!fired) {\n      fired = true;\n      listener.apply(this, arguments);\n    }\n  }\n\n  this.on(type, g);\n};\n\nEventEmitter.prototype.emit = function() {\n  var type = arguments[0];\n  var listeners = this._listeners[type];\n  if (!listeners) {\n    return;\n  }\n  // equivalent of Array.prototype.slice.call(arguments, 1);\n  var l = arguments.length;\n  var args = new Array(l - 1);\n  for (var ai = 1; ai < l; ai++) {\n    args[ai - 1] = arguments[ai];\n  }\n  for (var i = 0; i < listeners.length; i++) {\n    listeners[i].apply(this, args);\n  }\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;\nEventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;\n\nmodule.exports.EventEmitter = EventEmitter;\n\n},{\"./eventtarget\":5,\"inherits\":57}],4:[function(require,module,exports){\n'use strict';\n\nfunction Event(eventType) {\n  this.type = eventType;\n}\n\nEvent.prototype.initEvent = function(eventType, canBubble, cancelable) {\n  this.type = eventType;\n  this.bubbles = canBubble;\n  this.cancelable = cancelable;\n  this.timeStamp = +new Date();\n  return this;\n};\n\nEvent.prototype.stopPropagation = function() {};\nEvent.prototype.preventDefault = function() {};\n\nEvent.CAPTURING_PHASE = 1;\nEvent.AT_TARGET = 2;\nEvent.BUBBLING_PHASE = 3;\n\nmodule.exports = Event;\n\n},{}],5:[function(require,module,exports){\n'use strict';\n\n/* Simplified implementation of DOM2 EventTarget.\n *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget\n */\n\nfunction EventTarget() {\n  this._listeners = {};\n}\n\nEventTarget.prototype.addEventListener = function(eventType, listener) {\n  if (!(eventType in this._listeners)) {\n    this._listeners[eventType] = [];\n  }\n  var arr = this._listeners[eventType];\n  // #4\n  if (arr.indexOf(listener) === -1) {\n    // Make a copy so as not to interfere with a current dispatchEvent.\n    arr = arr.concat([listener]);\n  }\n  this._listeners[eventType] = arr;\n};\n\nEventTarget.prototype.removeEventListener = function(eventType, listener) {\n  var arr = this._listeners[eventType];\n  if (!arr) {\n    return;\n  }\n  var idx = arr.indexOf(listener);\n  if (idx !== -1) {\n    if (arr.length > 1) {\n      // Make a copy so as not to interfere with a current dispatchEvent.\n      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));\n    } else {\n      delete this._listeners[eventType];\n    }\n    return;\n  }\n};\n\nEventTarget.prototype.dispatchEvent = function() {\n  var event = arguments[0];\n  var t = event.type;\n  // equivalent of Array.prototype.slice.call(arguments, 0);\n  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);\n  // TODO: This doesn't match the real behavior; per spec, onfoo get\n  // their place in line from the /first/ time they're set from\n  // non-null. Although WebKit bumps it to the end every time it's\n  // set.\n  if (this['on' + t]) {\n    this['on' + t].apply(this, args);\n  }\n  if (t in this._listeners) {\n    // Grab a reference to the listeners list. removeEventListener may alter the list.\n    var listeners = this._listeners[t];\n    for (var i = 0; i < listeners.length; i++) {\n      listeners[i].apply(this, args);\n    }\n  }\n};\n\nmodule.exports = EventTarget;\n\n},{}],6:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , Event = require('./event')\n  ;\n\nfunction TransportMessageEvent(data) {\n  Event.call(this);\n  this.initEvent('message', false, false);\n  this.data = data;\n}\n\ninherits(TransportMessageEvent, Event);\n\nmodule.exports = TransportMessageEvent;\n\n},{\"./event\":4,\"inherits\":57}],7:[function(require,module,exports){\n'use strict';\n\nvar JSON3 = require('json3')\n  , iframeUtils = require('./utils/iframe')\n  ;\n\nfunction FacadeJS(transport) {\n  this._transport = transport;\n  transport.on('message', this._transportMessage.bind(this));\n  transport.on('close', this._transportClose.bind(this));\n}\n\nFacadeJS.prototype._transportClose = function(code, reason) {\n  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));\n};\nFacadeJS.prototype._transportMessage = function(frame) {\n  iframeUtils.postMessage('t', frame);\n};\nFacadeJS.prototype._send = function(data) {\n  this._transport.send(data);\n};\nFacadeJS.prototype._close = function() {\n  this._transport.close();\n  this._transport.removeAllListeners();\n};\n\nmodule.exports = FacadeJS;\n\n},{\"./utils/iframe\":47,\"json3\":58}],8:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar urlUtils = require('./utils/url')\n  , eventUtils = require('./utils/event')\n  , JSON3 = require('json3')\n  , FacadeJS = require('./facade')\n  , InfoIframeReceiver = require('./info-iframe-receiver')\n  , iframeUtils = require('./utils/iframe')\n  , loc = require('./location')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:iframe-bootstrap');\n}\n\nmodule.exports = function(SockJS, availableTransports) {\n  var transportMap = {};\n  availableTransports.forEach(function(at) {\n    if (at.facadeTransport) {\n      transportMap[at.facadeTransport.transportName] = at.facadeTransport;\n    }\n  });\n\n  // hard-coded for the info iframe\n  // TODO see if we can make this more dynamic\n  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;\n  var parentOrigin;\n\n  /* eslint-disable camelcase */\n  SockJS.bootstrap_iframe = function() {\n    /* eslint-enable camelcase */\n    var facade;\n    iframeUtils.currentWindowId = loc.hash.slice(1);\n    var onMessage = function(e) {\n      if (e.source !== parent) {\n        return;\n      }\n      if (typeof parentOrigin === 'undefined') {\n        parentOrigin = e.origin;\n      }\n      if (e.origin !== parentOrigin) {\n        return;\n      }\n\n      var iframeMessage;\n      try {\n        iframeMessage = JSON3.parse(e.data);\n      } catch (ignored) {\n        debug('bad json', e.data);\n        return;\n      }\n\n      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {\n        return;\n      }\n      switch (iframeMessage.type) {\n      case 's':\n        var p;\n        try {\n          p = JSON3.parse(iframeMessage.data);\n        } catch (ignored) {\n          debug('bad json', iframeMessage.data);\n          break;\n        }\n        var version = p[0];\n        var transport = p[1];\n        var transUrl = p[2];\n        var baseUrl = p[3];\n        debug(version, transport, transUrl, baseUrl);\n        // change this to semver logic\n        if (version !== SockJS.version) {\n          throw new Error('Incompatible SockJS! Main site uses:' +\n                    ' \"' + version + '\", the iframe:' +\n                    ' \"' + SockJS.version + '\".');\n        }\n\n        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||\n            !urlUtils.isOriginEqual(baseUrl, loc.href)) {\n          throw new Error('Can\\'t connect to different domain from within an ' +\n                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');\n        }\n        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));\n        break;\n      case 'm':\n        facade._send(iframeMessage.data);\n        break;\n      case 'c':\n        if (facade) {\n          facade._close();\n        }\n        facade = null;\n        break;\n      }\n    };\n\n    eventUtils.attachEvent('message', onMessage);\n\n    // Start\n    iframeUtils.postMessage('s');\n  };\n};\n\n}).call(this,{ env: {} })\n\n},{\"./facade\":7,\"./info-iframe-receiver\":10,\"./location\":13,\"./utils/event\":46,\"./utils/iframe\":47,\"./utils/url\":52,\"debug\":55,\"json3\":58}],9:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar EventEmitter = require('events').EventEmitter\n  , inherits = require('inherits')\n  , JSON3 = require('json3')\n  , objectUtils = require('./utils/object')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:info-ajax');\n}\n\nfunction InfoAjax(url, AjaxObject) {\n  EventEmitter.call(this);\n\n  var self = this;\n  var t0 = +new Date();\n  this.xo = new AjaxObject('GET', url);\n\n  this.xo.once('finish', function(status, text) {\n    var info, rtt;\n    if (status === 200) {\n      rtt = (+new Date()) - t0;\n      if (text) {\n        try {\n          info = JSON3.parse(text);\n        } catch (e) {\n          debug('bad json', text);\n        }\n      }\n\n      if (!objectUtils.isObject(info)) {\n        info = {};\n      }\n    }\n    self.emit('finish', info, rtt);\n    self.removeAllListeners();\n  });\n}\n\ninherits(InfoAjax, EventEmitter);\n\nInfoAjax.prototype.close = function() {\n  this.removeAllListeners();\n  this.xo.close();\n};\n\nmodule.exports = InfoAjax;\n\n}).call(this,{ env: {} })\n\n},{\"./utils/object\":49,\"debug\":55,\"events\":3,\"inherits\":57,\"json3\":58}],10:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  , JSON3 = require('json3')\n  , XHRLocalObject = require('./transport/sender/xhr-local')\n  , InfoAjax = require('./info-ajax')\n  ;\n\nfunction InfoReceiverIframe(transUrl) {\n  var self = this;\n  EventEmitter.call(this);\n\n  this.ir = new InfoAjax(transUrl, XHRLocalObject);\n  this.ir.once('finish', function(info, rtt) {\n    self.ir = null;\n    self.emit('message', JSON3.stringify([info, rtt]));\n  });\n}\n\ninherits(InfoReceiverIframe, EventEmitter);\n\nInfoReceiverIframe.transportName = 'iframe-info-receiver';\n\nInfoReceiverIframe.prototype.close = function() {\n  if (this.ir) {\n    this.ir.close();\n    this.ir = null;\n  }\n  this.removeAllListeners();\n};\n\nmodule.exports = InfoReceiverIframe;\n\n},{\"./info-ajax\":9,\"./transport/sender/xhr-local\":37,\"events\":3,\"inherits\":57,\"json3\":58}],11:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar EventEmitter = require('events').EventEmitter\n  , inherits = require('inherits')\n  , JSON3 = require('json3')\n  , utils = require('./utils/event')\n  , IframeTransport = require('./transport/iframe')\n  , InfoReceiverIframe = require('./info-iframe-receiver')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:info-iframe');\n}\n\nfunction InfoIframe(baseUrl, url) {\n  var self = this;\n  EventEmitter.call(this);\n\n  var go = function() {\n    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);\n\n    ifr.once('message', function(msg) {\n      if (msg) {\n        var d;\n        try {\n          d = JSON3.parse(msg);\n        } catch (e) {\n          debug('bad json', msg);\n          self.emit('finish');\n          self.close();\n          return;\n        }\n\n        var info = d[0], rtt = d[1];\n        self.emit('finish', info, rtt);\n      }\n      self.close();\n    });\n\n    ifr.once('close', function() {\n      self.emit('finish');\n      self.close();\n    });\n  };\n\n  // TODO this seems the same as the 'needBody' from transports\n  if (!global.document.body) {\n    utils.attachEvent('load', go);\n  } else {\n    go();\n  }\n}\n\ninherits(InfoIframe, EventEmitter);\n\nInfoIframe.enabled = function() {\n  return IframeTransport.enabled();\n};\n\nInfoIframe.prototype.close = function() {\n  if (this.ifr) {\n    this.ifr.close();\n  }\n  this.removeAllListeners();\n  this.ifr = null;\n};\n\nmodule.exports = InfoIframe;\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"./info-iframe-receiver\":10,\"./transport/iframe\":22,\"./utils/event\":46,\"debug\":55,\"events\":3,\"inherits\":57,\"json3\":58}],12:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar EventEmitter = require('events').EventEmitter\n  , inherits = require('inherits')\n  , urlUtils = require('./utils/url')\n  , XDR = require('./transport/sender/xdr')\n  , XHRCors = require('./transport/sender/xhr-cors')\n  , XHRLocal = require('./transport/sender/xhr-local')\n  , XHRFake = require('./transport/sender/xhr-fake')\n  , InfoIframe = require('./info-iframe')\n  , InfoAjax = require('./info-ajax')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:info-receiver');\n}\n\nfunction InfoReceiver(baseUrl, urlInfo) {\n  debug(baseUrl);\n  var self = this;\n  EventEmitter.call(this);\n\n  setTimeout(function() {\n    self.doXhr(baseUrl, urlInfo);\n  }, 0);\n}\n\ninherits(InfoReceiver, EventEmitter);\n\n// TODO this is currently ignoring the list of available transports and the whitelist\n\nInfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {\n  // determine method of CORS support (if needed)\n  if (urlInfo.sameOrigin) {\n    return new InfoAjax(url, XHRLocal);\n  }\n  if (XHRCors.enabled) {\n    return new InfoAjax(url, XHRCors);\n  }\n  if (XDR.enabled && urlInfo.sameScheme) {\n    return new InfoAjax(url, XDR);\n  }\n  if (InfoIframe.enabled()) {\n    return new InfoIframe(baseUrl, url);\n  }\n  return new InfoAjax(url, XHRFake);\n};\n\nInfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {\n  var self = this\n    , url = urlUtils.addPath(baseUrl, '/info')\n    ;\n  debug('doXhr', url);\n\n  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);\n\n  this.timeoutRef = setTimeout(function() {\n    debug('timeout');\n    self._cleanup(false);\n    self.emit('finish');\n  }, InfoReceiver.timeout);\n\n  this.xo.once('finish', function(info, rtt) {\n    debug('finish', info, rtt);\n    self._cleanup(true);\n    self.emit('finish', info, rtt);\n  });\n};\n\nInfoReceiver.prototype._cleanup = function(wasClean) {\n  debug('_cleanup');\n  clearTimeout(this.timeoutRef);\n  this.timeoutRef = null;\n  if (!wasClean && this.xo) {\n    this.xo.close();\n  }\n  this.xo = null;\n};\n\nInfoReceiver.prototype.close = function() {\n  debug('close');\n  this.removeAllListeners();\n  this._cleanup(false);\n};\n\nInfoReceiver.timeout = 8000;\n\nmodule.exports = InfoReceiver;\n\n}).call(this,{ env: {} })\n\n},{\"./info-ajax\":9,\"./info-iframe\":11,\"./transport/sender/xdr\":34,\"./transport/sender/xhr-cors\":35,\"./transport/sender/xhr-fake\":36,\"./transport/sender/xhr-local\":37,\"./utils/url\":52,\"debug\":55,\"events\":3,\"inherits\":57}],13:[function(require,module,exports){\n(function (global){\n'use strict';\n\nmodule.exports = global.location || {\n  origin: 'http://localhost:80'\n, protocol: 'http:'\n, host: 'localhost'\n, port: 80\n, href: 'http://localhost/'\n, hash: ''\n};\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],14:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nrequire('./shims');\n\nvar URL = require('url-parse')\n  , inherits = require('inherits')\n  , JSON3 = require('json3')\n  , random = require('./utils/random')\n  , escape = require('./utils/escape')\n  , urlUtils = require('./utils/url')\n  , eventUtils = require('./utils/event')\n  , transport = require('./utils/transport')\n  , objectUtils = require('./utils/object')\n  , browser = require('./utils/browser')\n  , log = require('./utils/log')\n  , Event = require('./event/event')\n  , EventTarget = require('./event/eventtarget')\n  , loc = require('./location')\n  , CloseEvent = require('./event/close')\n  , TransportMessageEvent = require('./event/trans-message')\n  , InfoReceiver = require('./info-receiver')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:main');\n}\n\nvar transports;\n\n// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface\nfunction SockJS(url, protocols, options) {\n  if (!(this instanceof SockJS)) {\n    return new SockJS(url, protocols, options);\n  }\n  if (arguments.length < 1) {\n    throw new TypeError(\"Failed to construct 'SockJS: 1 argument required, but only 0 present\");\n  }\n  EventTarget.call(this);\n\n  this.readyState = SockJS.CONNECTING;\n  this.extensions = '';\n  this.protocol = '';\n\n  // non-standard extension\n  options = options || {};\n  if (options.protocols_whitelist) {\n    log.warn(\"'protocols_whitelist' is DEPRECATED. Use 'transports' instead.\");\n  }\n  this._transportsWhitelist = options.transports;\n  this._transportOptions = options.transportOptions || {};\n  this._timeout = options.timeout || 0;\n\n  var sessionId = options.sessionId || 8;\n  if (typeof sessionId === 'function') {\n    this._generateSessionId = sessionId;\n  } else if (typeof sessionId === 'number') {\n    this._generateSessionId = function() {\n      return random.string(sessionId);\n    };\n  } else {\n    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');\n  }\n\n  this._server = options.server || random.numberString(1000);\n\n  // Step 1 of WS spec - parse and validate the url. Issue #8\n  var parsedUrl = new URL(url);\n  if (!parsedUrl.host || !parsedUrl.protocol) {\n    throw new SyntaxError(\"The URL '\" + url + \"' is invalid\");\n  } else if (parsedUrl.hash) {\n    throw new SyntaxError('The URL must not contain a fragment');\n  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {\n    throw new SyntaxError(\"The URL's scheme must be either 'http:' or 'https:'. '\" + parsedUrl.protocol + \"' is not allowed.\");\n  }\n\n  var secure = parsedUrl.protocol === 'https:';\n  // Step 2 - don't allow secure origin with an insecure protocol\n  if (loc.protocol === 'https:' && !secure) {\n    // exception is 127.0.0.0/8 and ::1 urls\n    if (!urlUtils.isLoopbackAddr(parsedUrl.hostname)) {\n      throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');\n    }\n  }\n\n  // Step 3 - check port access - no need here\n  // Step 4 - parse protocols argument\n  if (!protocols) {\n    protocols = [];\n  } else if (!Array.isArray(protocols)) {\n    protocols = [protocols];\n  }\n\n  // Step 5 - check protocols argument\n  var sortedProtocols = protocols.sort();\n  sortedProtocols.forEach(function(proto, i) {\n    if (!proto) {\n      throw new SyntaxError(\"The protocols entry '\" + proto + \"' is invalid.\");\n    }\n    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {\n      throw new SyntaxError(\"The protocols entry '\" + proto + \"' is duplicated.\");\n    }\n  });\n\n  // Step 6 - convert origin\n  var o = urlUtils.getOrigin(loc.href);\n  this._origin = o ? o.toLowerCase() : null;\n\n  // remove the trailing slash\n  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\\/+$/, ''));\n\n  // store the sanitized url\n  this.url = parsedUrl.href;\n  debug('using url', this.url);\n\n  // Step 7 - start connection in background\n  // obtain server info\n  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26\n  this._urlInfo = {\n    nullOrigin: !browser.hasDomain()\n  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)\n  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)\n  };\n\n  this._ir = new InfoReceiver(this.url, this._urlInfo);\n  this._ir.once('finish', this._receiveInfo.bind(this));\n}\n\ninherits(SockJS, EventTarget);\n\nfunction userSetCode(code) {\n  return code === 1000 || (code >= 3000 && code <= 4999);\n}\n\nSockJS.prototype.close = function(code, reason) {\n  // Step 1\n  if (code && !userSetCode(code)) {\n    throw new Error('InvalidAccessError: Invalid code');\n  }\n  // Step 2.4 states the max is 123 bytes, but we are just checking length\n  if (reason && reason.length > 123) {\n    throw new SyntaxError('reason argument has an invalid length');\n  }\n\n  // Step 3.1\n  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {\n    return;\n  }\n\n  // TODO look at docs to determine how to set this\n  var wasClean = true;\n  this._close(code || 1000, reason || 'Normal closure', wasClean);\n};\n\nSockJS.prototype.send = function(data) {\n  // #13 - convert anything non-string to string\n  // TODO this currently turns objects into [object Object]\n  if (typeof data !== 'string') {\n    data = '' + data;\n  }\n  if (this.readyState === SockJS.CONNECTING) {\n    throw new Error('InvalidStateError: The connection has not been established yet');\n  }\n  if (this.readyState !== SockJS.OPEN) {\n    return;\n  }\n  this._transport.send(escape.quote(data));\n};\n\nSockJS.version = require('./version');\n\nSockJS.CONNECTING = 0;\nSockJS.OPEN = 1;\nSockJS.CLOSING = 2;\nSockJS.CLOSED = 3;\n\nSockJS.prototype._receiveInfo = function(info, rtt) {\n  debug('_receiveInfo', rtt);\n  this._ir = null;\n  if (!info) {\n    this._close(1002, 'Cannot connect to server');\n    return;\n  }\n\n  // establish a round-trip timeout (RTO) based on the\n  // round-trip time (RTT)\n  this._rto = this.countRTO(rtt);\n  // allow server to override url used for the actual transport\n  this._transUrl = info.base_url ? info.base_url : this.url;\n  info = objectUtils.extend(info, this._urlInfo);\n  debug('info', info);\n  // determine list of desired and supported transports\n  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);\n  this._transports = enabledTransports.main;\n  debug(this._transports.length + ' enabled transports');\n\n  this._connect();\n};\n\nSockJS.prototype._connect = function() {\n  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {\n    debug('attempt', Transport.transportName);\n    if (Transport.needBody) {\n      if (!global.document.body ||\n          (typeof global.document.readyState !== 'undefined' &&\n            global.document.readyState !== 'complete' &&\n            global.document.readyState !== 'interactive')) {\n        debug('waiting for body');\n        this._transports.unshift(Transport);\n        eventUtils.attachEvent('load', this._connect.bind(this));\n        return;\n      }\n    }\n\n    // calculate timeout based on RTO and round trips. Default to 5s\n    var timeoutMs = Math.max(this._timeout, (this._rto * Transport.roundTrips) || 5000);\n    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);\n    debug('using timeout', timeoutMs);\n\n    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());\n    var options = this._transportOptions[Transport.transportName];\n    debug('transport url', transportUrl);\n    var transportObj = new Transport(transportUrl, this._transUrl, options);\n    transportObj.on('message', this._transportMessage.bind(this));\n    transportObj.once('close', this._transportClose.bind(this));\n    transportObj.transportName = Transport.transportName;\n    this._transport = transportObj;\n\n    return;\n  }\n  this._close(2000, 'All transports failed', false);\n};\n\nSockJS.prototype._transportTimeout = function() {\n  debug('_transportTimeout');\n  if (this.readyState === SockJS.CONNECTING) {\n    if (this._transport) {\n      this._transport.close();\n    }\n\n    this._transportClose(2007, 'Transport timed out');\n  }\n};\n\nSockJS.prototype._transportMessage = function(msg) {\n  debug('_transportMessage', msg);\n  var self = this\n    , type = msg.slice(0, 1)\n    , content = msg.slice(1)\n    , payload\n    ;\n\n  // first check for messages that don't need a payload\n  switch (type) {\n    case 'o':\n      this._open();\n      return;\n    case 'h':\n      this.dispatchEvent(new Event('heartbeat'));\n      debug('heartbeat', this.transport);\n      return;\n  }\n\n  if (content) {\n    try {\n      payload = JSON3.parse(content);\n    } catch (e) {\n      debug('bad json', content);\n    }\n  }\n\n  if (typeof payload === 'undefined') {\n    debug('empty payload', content);\n    return;\n  }\n\n  switch (type) {\n    case 'a':\n      if (Array.isArray(payload)) {\n        payload.forEach(function(p) {\n          debug('message', self.transport, p);\n          self.dispatchEvent(new TransportMessageEvent(p));\n        });\n      }\n      break;\n    case 'm':\n      debug('message', this.transport, payload);\n      this.dispatchEvent(new TransportMessageEvent(payload));\n      break;\n    case 'c':\n      if (Array.isArray(payload) && payload.length === 2) {\n        this._close(payload[0], payload[1], true);\n      }\n      break;\n  }\n};\n\nSockJS.prototype._transportClose = function(code, reason) {\n  debug('_transportClose', this.transport, code, reason);\n  if (this._transport) {\n    this._transport.removeAllListeners();\n    this._transport = null;\n    this.transport = null;\n  }\n\n  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {\n    this._connect();\n    return;\n  }\n\n  this._close(code, reason);\n};\n\nSockJS.prototype._open = function() {\n  debug('_open', this._transport && this._transport.transportName, this.readyState);\n  if (this.readyState === SockJS.CONNECTING) {\n    if (this._transportTimeoutId) {\n      clearTimeout(this._transportTimeoutId);\n      this._transportTimeoutId = null;\n    }\n    this.readyState = SockJS.OPEN;\n    this.transport = this._transport.transportName;\n    this.dispatchEvent(new Event('open'));\n    debug('connected', this.transport);\n  } else {\n    // The server might have been restarted, and lost track of our\n    // connection.\n    this._close(1006, 'Server lost session');\n  }\n};\n\nSockJS.prototype._close = function(code, reason, wasClean) {\n  debug('_close', this.transport, code, reason, wasClean, this.readyState);\n  var forceFail = false;\n\n  if (this._ir) {\n    forceFail = true;\n    this._ir.close();\n    this._ir = null;\n  }\n  if (this._transport) {\n    this._transport.close();\n    this._transport = null;\n    this.transport = null;\n  }\n\n  if (this.readyState === SockJS.CLOSED) {\n    throw new Error('InvalidStateError: SockJS has already been closed');\n  }\n\n  this.readyState = SockJS.CLOSING;\n  setTimeout(function() {\n    this.readyState = SockJS.CLOSED;\n\n    if (forceFail) {\n      this.dispatchEvent(new Event('error'));\n    }\n\n    var e = new CloseEvent('close');\n    e.wasClean = wasClean || false;\n    e.code = code || 1000;\n    e.reason = reason;\n\n    this.dispatchEvent(e);\n    this.onmessage = this.onclose = this.onerror = null;\n    debug('disconnected');\n  }.bind(this), 0);\n};\n\n// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/\n// and RFC 2988.\nSockJS.prototype.countRTO = function(rtt) {\n  // In a local environment, when using IE8/9 and the `jsonp-polling`\n  // transport the time needed to establish a connection (the time that pass\n  // from the opening of the transport to the call of `_dispatchOpen`) is\n  // around 200msec (the lower bound used in the article above) and this\n  // causes spurious timeouts. For this reason we calculate a value slightly\n  // larger than that used in the article.\n  if (rtt > 100) {\n    return 4 * rtt; // rto > 400msec\n  }\n  return 300 + rtt; // 300msec < rto <= 400msec\n};\n\nmodule.exports = function(availableTransports) {\n  transports = transport(availableTransports);\n  require('./iframe-bootstrap')(SockJS, availableTransports);\n  return SockJS;\n};\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"./event/close\":2,\"./event/event\":4,\"./event/eventtarget\":5,\"./event/trans-message\":6,\"./iframe-bootstrap\":8,\"./info-receiver\":12,\"./location\":13,\"./shims\":15,\"./utils/browser\":44,\"./utils/escape\":45,\"./utils/event\":46,\"./utils/log\":48,\"./utils/object\":49,\"./utils/random\":50,\"./utils/transport\":51,\"./utils/url\":52,\"./version\":53,\"debug\":55,\"inherits\":57,\"json3\":58,\"url-parse\":61}],15:[function(require,module,exports){\n/* eslint-disable */\n/* jscs: disable */\n'use strict';\n\n// pulled specific shims from https://github.com/es-shims/es5-shim\n\nvar ArrayPrototype = Array.prototype;\nvar ObjectPrototype = Object.prototype;\nvar FunctionPrototype = Function.prototype;\nvar StringPrototype = String.prototype;\nvar array_slice = ArrayPrototype.slice;\n\nvar _toString = ObjectPrototype.toString;\nvar isFunction = function (val) {\n    return ObjectPrototype.toString.call(val) === '[object Function]';\n};\nvar isArray = function isArray(obj) {\n    return _toString.call(obj) === '[object Array]';\n};\nvar isString = function isString(obj) {\n    return _toString.call(obj) === '[object String]';\n};\n\nvar supportsDescriptors = Object.defineProperty && (function () {\n    try {\n        Object.defineProperty({}, 'x', {});\n        return true;\n    } catch (e) { /* this is ES3 */\n        return false;\n    }\n}());\n\n// Define configurable, writable and non-enumerable props\n// if they don't exist.\nvar defineProperty;\nif (supportsDescriptors) {\n    defineProperty = function (object, name, method, forceAssign) {\n        if (!forceAssign && (name in object)) { return; }\n        Object.defineProperty(object, name, {\n            configurable: true,\n            enumerable: false,\n            writable: true,\n            value: method\n        });\n    };\n} else {\n    defineProperty = function (object, name, method, forceAssign) {\n        if (!forceAssign && (name in object)) { return; }\n        object[name] = method;\n    };\n}\nvar defineProperties = function (object, map, forceAssign) {\n    for (var name in map) {\n        if (ObjectPrototype.hasOwnProperty.call(map, name)) {\n          defineProperty(object, name, map[name], forceAssign);\n        }\n    }\n};\n\nvar toObject = function (o) {\n    if (o == null) { // this matches both null and undefined\n        throw new TypeError(\"can't convert \" + o + ' to object');\n    }\n    return Object(o);\n};\n\n//\n// Util\n// ======\n//\n\n// ES5 9.4\n// http://es5.github.com/#x9.4\n// http://jsperf.com/to-integer\n\nfunction toInteger(num) {\n    var n = +num;\n    if (n !== n) { // isNaN\n        n = 0;\n    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {\n        n = (n > 0 || -1) * Math.floor(Math.abs(n));\n    }\n    return n;\n}\n\nfunction ToUint32(x) {\n    return x >>> 0;\n}\n\n//\n// Function\n// ========\n//\n\n// ES-5 15.3.4.5\n// http://es5.github.com/#x15.3.4.5\n\nfunction Empty() {}\n\ndefineProperties(FunctionPrototype, {\n    bind: function bind(that) { // .length is 1\n        // 1. Let Target be the this value.\n        var target = this;\n        // 2. If IsCallable(Target) is false, throw a TypeError exception.\n        if (!isFunction(target)) {\n            throw new TypeError('Function.prototype.bind called on incompatible ' + target);\n        }\n        // 3. Let A be a new (possibly empty) internal list of all of the\n        //   argument values provided after thisArg (arg1, arg2 etc), in order.\n        // XXX slicedArgs will stand in for \"A\" if used\n        var args = array_slice.call(arguments, 1); // for normal call\n        // 4. Let F be a new native ECMAScript object.\n        // 11. Set the [[Prototype]] internal property of F to the standard\n        //   built-in Function prototype object as specified in 15.3.3.1.\n        // 12. Set the [[Call]] internal property of F as described in\n        //   15.3.4.5.1.\n        // 13. Set the [[Construct]] internal property of F as described in\n        //   15.3.4.5.2.\n        // 14. Set the [[HasInstance]] internal property of F as described in\n        //   15.3.4.5.3.\n        var binder = function () {\n\n            if (this instanceof bound) {\n                // 15.3.4.5.2 [[Construct]]\n                // When the [[Construct]] internal method of a function object,\n                // F that was created using the bind function is called with a\n                // list of arguments ExtraArgs, the following steps are taken:\n                // 1. Let target be the value of F's [[TargetFunction]]\n                //   internal property.\n                // 2. If target has no [[Construct]] internal method, a\n                //   TypeError exception is thrown.\n                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal\n                //   property.\n                // 4. Let args be a new list containing the same values as the\n                //   list boundArgs in the same order followed by the same\n                //   values as the list ExtraArgs in the same order.\n                // 5. Return the result of calling the [[Construct]] internal\n                //   method of target providing args as the arguments.\n\n                var result = target.apply(\n                    this,\n                    args.concat(array_slice.call(arguments))\n                );\n                if (Object(result) === result) {\n                    return result;\n                }\n                return this;\n\n            } else {\n                // 15.3.4.5.1 [[Call]]\n                // When the [[Call]] internal method of a function object, F,\n                // which was created using the bind function is called with a\n                // this value and a list of arguments ExtraArgs, the following\n                // steps are taken:\n                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal\n                //   property.\n                // 2. Let boundThis be the value of F's [[BoundThis]] internal\n                //   property.\n                // 3. Let target be the value of F's [[TargetFunction]] internal\n                //   property.\n                // 4. Let args be a new list containing the same values as the\n                //   list boundArgs in the same order followed by the same\n                //   values as the list ExtraArgs in the same order.\n                // 5. Return the result of calling the [[Call]] internal method\n                //   of target providing boundThis as the this value and\n                //   providing args as the arguments.\n\n                // equiv: target.call(this, ...boundArgs, ...args)\n                return target.apply(\n                    that,\n                    args.concat(array_slice.call(arguments))\n                );\n\n            }\n\n        };\n\n        // 15. If the [[Class]] internal property of Target is \"Function\", then\n        //     a. Let L be the length property of Target minus the length of A.\n        //     b. Set the length own property of F to either 0 or L, whichever is\n        //       larger.\n        // 16. Else set the length own property of F to 0.\n\n        var boundLength = Math.max(0, target.length - args.length);\n\n        // 17. Set the attributes of the length own property of F to the values\n        //   specified in 15.3.5.1.\n        var boundArgs = [];\n        for (var i = 0; i < boundLength; i++) {\n            boundArgs.push('$' + i);\n        }\n\n        // XXX Build a dynamic function with desired amount of arguments is the only\n        // way to set the length property of a function.\n        // In environments where Content Security Policies enabled (Chrome extensions,\n        // for ex.) all use of eval or Function costructor throws an exception.\n        // However in all of these environments Function.prototype.bind exists\n        // and so this code will never be executed.\n        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);\n\n        if (target.prototype) {\n            Empty.prototype = target.prototype;\n            bound.prototype = new Empty();\n            // Clean up dangling references.\n            Empty.prototype = null;\n        }\n\n        // TODO\n        // 18. Set the [[Extensible]] internal property of F to true.\n\n        // TODO\n        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).\n        // 20. Call the [[DefineOwnProperty]] internal method of F with\n        //   arguments \"caller\", PropertyDescriptor {[[Get]]: thrower, [[Set]]:\n        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and\n        //   false.\n        // 21. Call the [[DefineOwnProperty]] internal method of F with\n        //   arguments \"arguments\", PropertyDescriptor {[[Get]]: thrower,\n        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},\n        //   and false.\n\n        // TODO\n        // NOTE Function objects created using Function.prototype.bind do not\n        // have a prototype property or the [[Code]], [[FormalParameters]], and\n        // [[Scope]] internal properties.\n        // XXX can't delete prototype in pure-js.\n\n        // 22. Return F.\n        return bound;\n    }\n});\n\n//\n// Array\n// =====\n//\n\n// ES5 15.4.3.2\n// http://es5.github.com/#x15.4.3.2\n// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray\ndefineProperties(Array, { isArray: isArray });\n\n\nvar boxedString = Object('a');\nvar splitString = boxedString[0] !== 'a' || !(0 in boxedString);\n\nvar properlyBoxesContext = function properlyBoxed(method) {\n    // Check node 0.6.21 bug where third parameter is not boxed\n    var properlyBoxesNonStrict = true;\n    var properlyBoxesStrict = true;\n    if (method) {\n        method.call('foo', function (_, __, context) {\n            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }\n        });\n\n        method.call([1], function () {\n            'use strict';\n            properlyBoxesStrict = typeof this === 'string';\n        }, 'x');\n    }\n    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;\n};\n\ndefineProperties(ArrayPrototype, {\n    forEach: function forEach(fun /*, thisp*/) {\n        var object = toObject(this),\n            self = splitString && isString(this) ? this.split('') : object,\n            thisp = arguments[1],\n            i = -1,\n            length = self.length >>> 0;\n\n        // If no callback function or if callback is not a callable function\n        if (!isFunction(fun)) {\n            throw new TypeError(); // TODO message\n        }\n\n        while (++i < length) {\n            if (i in self) {\n                // Invoke the callback function with call, passing arguments:\n                // context, property value, property key, thisArg object\n                // context\n                fun.call(thisp, self[i], i, object);\n            }\n        }\n    }\n}, !properlyBoxesContext(ArrayPrototype.forEach));\n\n// ES5 15.4.4.14\n// http://es5.github.com/#x15.4.4.14\n// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf\nvar hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;\ndefineProperties(ArrayPrototype, {\n    indexOf: function indexOf(sought /*, fromIndex */ ) {\n        var self = splitString && isString(this) ? this.split('') : toObject(this),\n            length = self.length >>> 0;\n\n        if (!length) {\n            return -1;\n        }\n\n        var i = 0;\n        if (arguments.length > 1) {\n            i = toInteger(arguments[1]);\n        }\n\n        // handle negative indices\n        i = i >= 0 ? i : Math.max(0, length + i);\n        for (; i < length; i++) {\n            if (i in self && self[i] === sought) {\n                return i;\n            }\n        }\n        return -1;\n    }\n}, hasFirefox2IndexOfBug);\n\n//\n// String\n// ======\n//\n\n// ES5 15.5.4.14\n// http://es5.github.com/#x15.5.4.14\n\n// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]\n// Many browsers do not split properly with regular expressions or they\n// do not perform the split correctly under obscure conditions.\n// See http://blog.stevenlevithan.com/archives/cross-browser-split\n// I've tested in many browsers and this seems to cover the deviant ones:\n//    'ab'.split(/(?:ab)*/) should be [\"\", \"\"], not [\"\"]\n//    '.'.split(/(.?)(.?)/) should be [\"\", \".\", \"\", \"\"], not [\"\", \"\"]\n//    'tesst'.split(/(s)*/) should be [\"t\", undefined, \"e\", \"s\", \"t\"], not\n//       [undefined, \"t\", undefined, \"e\", ...]\n//    ''.split(/.?/) should be [], not [\"\"]\n//    '.'.split(/()()/) should be [\".\"], not [\"\", \"\", \".\"]\n\nvar string_split = StringPrototype.split;\nif (\n    'ab'.split(/(?:ab)*/).length !== 2 ||\n    '.'.split(/(.?)(.?)/).length !== 4 ||\n    'tesst'.split(/(s)*/)[1] === 't' ||\n    'test'.split(/(?:)/, -1).length !== 4 ||\n    ''.split(/.?/).length ||\n    '.'.split(/()()/).length > 1\n) {\n    (function () {\n        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group\n\n        StringPrototype.split = function (separator, limit) {\n            var string = this;\n            if (separator === void 0 && limit === 0) {\n                return [];\n            }\n\n            // If `separator` is not a regex, use native split\n            if (_toString.call(separator) !== '[object RegExp]') {\n                return string_split.call(this, separator, limit);\n            }\n\n            var output = [],\n                flags = (separator.ignoreCase ? 'i' : '') +\n                        (separator.multiline  ? 'm' : '') +\n                        (separator.extended   ? 'x' : '') + // Proposed for ES6\n                        (separator.sticky     ? 'y' : ''), // Firefox 3+\n                lastLastIndex = 0,\n                // Make `global` and avoid `lastIndex` issues by working with a copy\n                separator2, match, lastIndex, lastLength;\n            separator = new RegExp(separator.source, flags + 'g');\n            string += ''; // Type-convert\n            if (!compliantExecNpcg) {\n                // Doesn't need flags gy, but they don't hurt\n                separator2 = new RegExp('^' + separator.source + '$(?!\\\\s)', flags);\n            }\n            /* Values for `limit`, per the spec:\n             * If undefined: 4294967295 // Math.pow(2, 32) - 1\n             * If 0, Infinity, or NaN: 0\n             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;\n             * If negative number: 4294967296 - Math.floor(Math.abs(limit))\n             * If other: Type-convert, then use the above rules\n             */\n            limit = limit === void 0 ?\n                -1 >>> 0 : // Math.pow(2, 32) - 1\n                ToUint32(limit);\n            while (match = separator.exec(string)) {\n                // `separator.lastIndex` is not reliable cross-browser\n                lastIndex = match.index + match[0].length;\n                if (lastIndex > lastLastIndex) {\n                    output.push(string.slice(lastLastIndex, match.index));\n                    // Fix browsers whose `exec` methods don't consistently return `undefined` for\n                    // nonparticipating capturing groups\n                    if (!compliantExecNpcg && match.length > 1) {\n                        match[0].replace(separator2, function () {\n                            for (var i = 1; i < arguments.length - 2; i++) {\n                                if (arguments[i] === void 0) {\n                                    match[i] = void 0;\n                                }\n                            }\n                        });\n                    }\n                    if (match.length > 1 && match.index < string.length) {\n                        ArrayPrototype.push.apply(output, match.slice(1));\n                    }\n                    lastLength = match[0].length;\n                    lastLastIndex = lastIndex;\n                    if (output.length >= limit) {\n                        break;\n                    }\n                }\n                if (separator.lastIndex === match.index) {\n                    separator.lastIndex++; // Avoid an infinite loop\n                }\n            }\n            if (lastLastIndex === string.length) {\n                if (lastLength || !separator.test('')) {\n                    output.push('');\n                }\n            } else {\n                output.push(string.slice(lastLastIndex));\n            }\n            return output.length > limit ? output.slice(0, limit) : output;\n        };\n    }());\n\n// [bugfix, chrome]\n// If separator is undefined, then the result array contains just one String,\n// which is the this value (converted to a String). If limit is not undefined,\n// then the output array is truncated so that it contains no more than limit\n// elements.\n// \"0\".split(undefined, 0) -> []\n} else if ('0'.split(void 0, 0).length) {\n    StringPrototype.split = function split(separator, limit) {\n        if (separator === void 0 && limit === 0) { return []; }\n        return string_split.call(this, separator, limit);\n    };\n}\n\n// ECMA-262, 3rd B.2.3\n// Not an ECMAScript standard, although ECMAScript 3rd Edition has a\n// non-normative section suggesting uniform semantics and it should be\n// normalized across all browsers\n// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE\nvar string_substr = StringPrototype.substr;\nvar hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';\ndefineProperties(StringPrototype, {\n    substr: function substr(start, length) {\n        return string_substr.call(\n            this,\n            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,\n            length\n        );\n    }\n}, hasNegativeSubstrBug);\n\n},{}],16:[function(require,module,exports){\n'use strict';\n\nmodule.exports = [\n  // streaming transports\n  require('./transport/websocket')\n, require('./transport/xhr-streaming')\n, require('./transport/xdr-streaming')\n, require('./transport/eventsource')\n, require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))\n\n  // polling transports\n, require('./transport/htmlfile')\n, require('./transport/lib/iframe-wrap')(require('./transport/htmlfile'))\n, require('./transport/xhr-polling')\n, require('./transport/xdr-polling')\n, require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling'))\n, require('./transport/jsonp-polling')\n];\n\n},{\"./transport/eventsource\":20,\"./transport/htmlfile\":21,\"./transport/jsonp-polling\":23,\"./transport/lib/iframe-wrap\":26,\"./transport/websocket\":38,\"./transport/xdr-polling\":39,\"./transport/xdr-streaming\":40,\"./transport/xhr-polling\":41,\"./transport/xhr-streaming\":42}],17:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar EventEmitter = require('events').EventEmitter\n  , inherits = require('inherits')\n  , utils = require('../../utils/event')\n  , urlUtils = require('../../utils/url')\n  , XHR = global.XMLHttpRequest\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:browser:xhr');\n}\n\nfunction AbstractXHRObject(method, url, payload, opts) {\n  debug(method, url);\n  var self = this;\n  EventEmitter.call(this);\n\n  setTimeout(function () {\n    self._start(method, url, payload, opts);\n  }, 0);\n}\n\ninherits(AbstractXHRObject, EventEmitter);\n\nAbstractXHRObject.prototype._start = function(method, url, payload, opts) {\n  var self = this;\n\n  try {\n    this.xhr = new XHR();\n  } catch (x) {\n    // intentionally empty\n  }\n\n  if (!this.xhr) {\n    debug('no xhr');\n    this.emit('finish', 0, 'no xhr support');\n    this._cleanup();\n    return;\n  }\n\n  // several browsers cache POSTs\n  url = urlUtils.addQuery(url, 't=' + (+new Date()));\n\n  // Explorer tends to keep connection open, even after the\n  // tab gets closed: http://bugs.jquery.com/ticket/5280\n  this.unloadRef = utils.unloadAdd(function() {\n    debug('unload cleanup');\n    self._cleanup(true);\n  });\n  try {\n    this.xhr.open(method, url, true);\n    if (this.timeout && 'timeout' in this.xhr) {\n      this.xhr.timeout = this.timeout;\n      this.xhr.ontimeout = function() {\n        debug('xhr timeout');\n        self.emit('finish', 0, '');\n        self._cleanup(false);\n      };\n    }\n  } catch (e) {\n    debug('exception', e);\n    // IE raises an exception on wrong port.\n    this.emit('finish', 0, '');\n    this._cleanup(false);\n    return;\n  }\n\n  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {\n    debug('withCredentials');\n    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :\n    // \"This never affects same-site requests.\"\n\n    this.xhr.withCredentials = true;\n  }\n  if (opts && opts.headers) {\n    for (var key in opts.headers) {\n      this.xhr.setRequestHeader(key, opts.headers[key]);\n    }\n  }\n\n  this.xhr.onreadystatechange = function() {\n    if (self.xhr) {\n      var x = self.xhr;\n      var text, status;\n      debug('readyState', x.readyState);\n      switch (x.readyState) {\n      case 3:\n        // IE doesn't like peeking into responseText or status\n        // on Microsoft.XMLHTTP and readystate=3\n        try {\n          status = x.status;\n          text = x.responseText;\n        } catch (e) {\n          // intentionally empty\n        }\n        debug('status', status);\n        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450\n        if (status === 1223) {\n          status = 204;\n        }\n\n        // IE does return readystate == 3 for 404 answers.\n        if (status === 200 && text && text.length > 0) {\n          debug('chunk');\n          self.emit('chunk', status, text);\n        }\n        break;\n      case 4:\n        status = x.status;\n        debug('status', status);\n        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450\n        if (status === 1223) {\n          status = 204;\n        }\n        // IE returns this for a bad port\n        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx\n        if (status === 12005 || status === 12029) {\n          status = 0;\n        }\n\n        debug('finish', status, x.responseText);\n        self.emit('finish', status, x.responseText);\n        self._cleanup(false);\n        break;\n      }\n    }\n  };\n\n  try {\n    self.xhr.send(payload);\n  } catch (e) {\n    self.emit('finish', 0, '');\n    self._cleanup(false);\n  }\n};\n\nAbstractXHRObject.prototype._cleanup = function(abort) {\n  debug('cleanup');\n  if (!this.xhr) {\n    return;\n  }\n  this.removeAllListeners();\n  utils.unloadDel(this.unloadRef);\n\n  // IE needs this field to be a function\n  this.xhr.onreadystatechange = function() {};\n  if (this.xhr.ontimeout) {\n    this.xhr.ontimeout = null;\n  }\n\n  if (abort) {\n    try {\n      this.xhr.abort();\n    } catch (x) {\n      // intentionally empty\n    }\n  }\n  this.unloadRef = this.xhr = null;\n};\n\nAbstractXHRObject.prototype.close = function() {\n  debug('close');\n  this._cleanup(true);\n};\n\nAbstractXHRObject.enabled = !!XHR;\n// override XMLHttpRequest for IE6/7\n// obfuscate to avoid firewalls\nvar axo = ['Active'].concat('Object').join('X');\nif (!AbstractXHRObject.enabled && (axo in global)) {\n  debug('overriding xmlhttprequest');\n  XHR = function() {\n    try {\n      return new global[axo]('Microsoft.XMLHTTP');\n    } catch (e) {\n      return null;\n    }\n  };\n  AbstractXHRObject.enabled = !!new XHR();\n}\n\nvar cors = false;\ntry {\n  cors = 'withCredentials' in new XHR();\n} catch (ignored) {\n  // intentionally empty\n}\n\nAbstractXHRObject.supportsCORS = cors;\n\nmodule.exports = AbstractXHRObject;\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../../utils/event\":46,\"../../utils/url\":52,\"debug\":55,\"events\":3,\"inherits\":57}],18:[function(require,module,exports){\n(function (global){\nmodule.exports = global.EventSource;\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],19:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar Driver = global.WebSocket || global.MozWebSocket;\nif (Driver) {\n\tmodule.exports = function WebSocketBrowserDriver(url) {\n\t\treturn new Driver(url);\n\t};\n} else {\n\tmodule.exports = undefined;\n}\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],20:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , AjaxBasedTransport = require('./lib/ajax-based')\n  , EventSourceReceiver = require('./receiver/eventsource')\n  , XHRCorsObject = require('./sender/xhr-cors')\n  , EventSourceDriver = require('eventsource')\n  ;\n\nfunction EventSourceTransport(transUrl) {\n  if (!EventSourceTransport.enabled()) {\n    throw new Error('Transport created when disabled');\n  }\n\n  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);\n}\n\ninherits(EventSourceTransport, AjaxBasedTransport);\n\nEventSourceTransport.enabled = function() {\n  return !!EventSourceDriver;\n};\n\nEventSourceTransport.transportName = 'eventsource';\nEventSourceTransport.roundTrips = 2;\n\nmodule.exports = EventSourceTransport;\n\n},{\"./lib/ajax-based\":24,\"./receiver/eventsource\":29,\"./sender/xhr-cors\":35,\"eventsource\":18,\"inherits\":57}],21:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , HtmlfileReceiver = require('./receiver/htmlfile')\n  , XHRLocalObject = require('./sender/xhr-local')\n  , AjaxBasedTransport = require('./lib/ajax-based')\n  ;\n\nfunction HtmlFileTransport(transUrl) {\n  if (!HtmlfileReceiver.enabled) {\n    throw new Error('Transport created when disabled');\n  }\n  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);\n}\n\ninherits(HtmlFileTransport, AjaxBasedTransport);\n\nHtmlFileTransport.enabled = function(info) {\n  return HtmlfileReceiver.enabled && info.sameOrigin;\n};\n\nHtmlFileTransport.transportName = 'htmlfile';\nHtmlFileTransport.roundTrips = 2;\n\nmodule.exports = HtmlFileTransport;\n\n},{\"./lib/ajax-based\":24,\"./receiver/htmlfile\":30,\"./sender/xhr-local\":37,\"inherits\":57}],22:[function(require,module,exports){\n(function (process){\n'use strict';\n\n// Few cool transports do work only for same-origin. In order to make\n// them work cross-domain we shall use iframe, served from the\n// remote domain. New browsers have capabilities to communicate with\n// cross domain iframe using postMessage(). In IE it was implemented\n// from IE 8+, but of course, IE got some details wrong:\n//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx\n//    http://stevesouders.com/misc/test-postmessage.php\n\nvar inherits = require('inherits')\n  , JSON3 = require('json3')\n  , EventEmitter = require('events').EventEmitter\n  , version = require('../version')\n  , urlUtils = require('../utils/url')\n  , iframeUtils = require('../utils/iframe')\n  , eventUtils = require('../utils/event')\n  , random = require('../utils/random')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:transport:iframe');\n}\n\nfunction IframeTransport(transport, transUrl, baseUrl) {\n  if (!IframeTransport.enabled()) {\n    throw new Error('Transport created when disabled');\n  }\n  EventEmitter.call(this);\n\n  var self = this;\n  this.origin = urlUtils.getOrigin(baseUrl);\n  this.baseUrl = baseUrl;\n  this.transUrl = transUrl;\n  this.transport = transport;\n  this.windowId = random.string(8);\n\n  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;\n  debug(transport, transUrl, iframeUrl);\n\n  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {\n    debug('err callback');\n    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');\n    self.close();\n  });\n\n  this.onmessageCallback = this._message.bind(this);\n  eventUtils.attachEvent('message', this.onmessageCallback);\n}\n\ninherits(IframeTransport, EventEmitter);\n\nIframeTransport.prototype.close = function() {\n  debug('close');\n  this.removeAllListeners();\n  if (this.iframeObj) {\n    eventUtils.detachEvent('message', this.onmessageCallback);\n    try {\n      // When the iframe is not loaded, IE raises an exception\n      // on 'contentWindow'.\n      this.postMessage('c');\n    } catch (x) {\n      // intentionally empty\n    }\n    this.iframeObj.cleanup();\n    this.iframeObj = null;\n    this.onmessageCallback = this.iframeObj = null;\n  }\n};\n\nIframeTransport.prototype._message = function(e) {\n  debug('message', e.data);\n  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {\n    debug('not same origin', e.origin, this.origin);\n    return;\n  }\n\n  var iframeMessage;\n  try {\n    iframeMessage = JSON3.parse(e.data);\n  } catch (ignored) {\n    debug('bad json', e.data);\n    return;\n  }\n\n  if (iframeMessage.windowId !== this.windowId) {\n    debug('mismatched window id', iframeMessage.windowId, this.windowId);\n    return;\n  }\n\n  switch (iframeMessage.type) {\n  case 's':\n    this.iframeObj.loaded();\n    // window global dependency\n    this.postMessage('s', JSON3.stringify([\n      version\n    , this.transport\n    , this.transUrl\n    , this.baseUrl\n    ]));\n    break;\n  case 't':\n    this.emit('message', iframeMessage.data);\n    break;\n  case 'c':\n    var cdata;\n    try {\n      cdata = JSON3.parse(iframeMessage.data);\n    } catch (ignored) {\n      debug('bad json', iframeMessage.data);\n      return;\n    }\n    this.emit('close', cdata[0], cdata[1]);\n    this.close();\n    break;\n  }\n};\n\nIframeTransport.prototype.postMessage = function(type, data) {\n  debug('postMessage', type, data);\n  this.iframeObj.post(JSON3.stringify({\n    windowId: this.windowId\n  , type: type\n  , data: data || ''\n  }), this.origin);\n};\n\nIframeTransport.prototype.send = function(message) {\n  debug('send', message);\n  this.postMessage('m', message);\n};\n\nIframeTransport.enabled = function() {\n  return iframeUtils.iframeEnabled;\n};\n\nIframeTransport.transportName = 'iframe';\nIframeTransport.roundTrips = 2;\n\nmodule.exports = IframeTransport;\n\n}).call(this,{ env: {} })\n\n},{\"../utils/event\":46,\"../utils/iframe\":47,\"../utils/random\":50,\"../utils/url\":52,\"../version\":53,\"debug\":55,\"events\":3,\"inherits\":57,\"json3\":58}],23:[function(require,module,exports){\n(function (global){\n'use strict';\n\n// The simplest and most robust transport, using the well-know cross\n// domain hack - JSONP. This transport is quite inefficient - one\n// message could use up to one http request. But at least it works almost\n// everywhere.\n// Known limitations:\n//   o you will get a spinning cursor\n//   o for Konqueror a dumb timer is needed to detect errors\n\nvar inherits = require('inherits')\n  , SenderReceiver = require('./lib/sender-receiver')\n  , JsonpReceiver = require('./receiver/jsonp')\n  , jsonpSender = require('./sender/jsonp')\n  ;\n\nfunction JsonPTransport(transUrl) {\n  if (!JsonPTransport.enabled()) {\n    throw new Error('Transport created when disabled');\n  }\n  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);\n}\n\ninherits(JsonPTransport, SenderReceiver);\n\nJsonPTransport.enabled = function() {\n  return !!global.document;\n};\n\nJsonPTransport.transportName = 'jsonp-polling';\nJsonPTransport.roundTrips = 1;\nJsonPTransport.needBody = true;\n\nmodule.exports = JsonPTransport;\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"./lib/sender-receiver\":28,\"./receiver/jsonp\":31,\"./sender/jsonp\":33,\"inherits\":57}],24:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar inherits = require('inherits')\n  , urlUtils = require('../../utils/url')\n  , SenderReceiver = require('./sender-receiver')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:ajax-based');\n}\n\nfunction createAjaxSender(AjaxObject) {\n  return function(url, payload, callback) {\n    debug('create ajax sender', url, payload);\n    var opt = {};\n    if (typeof payload === 'string') {\n      opt.headers = {'Content-type': 'text/plain'};\n    }\n    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');\n    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);\n    xo.once('finish', function(status) {\n      debug('finish', status);\n      xo = null;\n\n      if (status !== 200 && status !== 204) {\n        return callback(new Error('http status ' + status));\n      }\n      callback();\n    });\n    return function() {\n      debug('abort');\n      xo.close();\n      xo = null;\n\n      var err = new Error('Aborted');\n      err.code = 1000;\n      callback(err);\n    };\n  };\n}\n\nfunction AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {\n  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);\n}\n\ninherits(AjaxBasedTransport, SenderReceiver);\n\nmodule.exports = AjaxBasedTransport;\n\n}).call(this,{ env: {} })\n\n},{\"../../utils/url\":52,\"./sender-receiver\":28,\"debug\":55,\"inherits\":57}],25:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:buffered-sender');\n}\n\nfunction BufferedSender(url, sender) {\n  debug(url);\n  EventEmitter.call(this);\n  this.sendBuffer = [];\n  this.sender = sender;\n  this.url = url;\n}\n\ninherits(BufferedSender, EventEmitter);\n\nBufferedSender.prototype.send = function(message) {\n  debug('send', message);\n  this.sendBuffer.push(message);\n  if (!this.sendStop) {\n    this.sendSchedule();\n  }\n};\n\n// For polling transports in a situation when in the message callback,\n// new message is being send. If the sending connection was started\n// before receiving one, it is possible to saturate the network and\n// timeout due to the lack of receiving socket. To avoid that we delay\n// sending messages by some small time, in order to let receiving\n// connection be started beforehand. This is only a halfmeasure and\n// does not fix the big problem, but it does make the tests go more\n// stable on slow networks.\nBufferedSender.prototype.sendScheduleWait = function() {\n  debug('sendScheduleWait');\n  var self = this;\n  var tref;\n  this.sendStop = function() {\n    debug('sendStop');\n    self.sendStop = null;\n    clearTimeout(tref);\n  };\n  tref = setTimeout(function() {\n    debug('timeout');\n    self.sendStop = null;\n    self.sendSchedule();\n  }, 25);\n};\n\nBufferedSender.prototype.sendSchedule = function() {\n  debug('sendSchedule', this.sendBuffer.length);\n  var self = this;\n  if (this.sendBuffer.length > 0) {\n    var payload = '[' + this.sendBuffer.join(',') + ']';\n    this.sendStop = this.sender(this.url, payload, function(err) {\n      self.sendStop = null;\n      if (err) {\n        debug('error', err);\n        self.emit('close', err.code || 1006, 'Sending error: ' + err);\n        self.close();\n      } else {\n        self.sendScheduleWait();\n      }\n    });\n    this.sendBuffer = [];\n  }\n};\n\nBufferedSender.prototype._cleanup = function() {\n  debug('_cleanup');\n  this.removeAllListeners();\n};\n\nBufferedSender.prototype.close = function() {\n  debug('close');\n  this._cleanup();\n  if (this.sendStop) {\n    this.sendStop();\n    this.sendStop = null;\n  }\n};\n\nmodule.exports = BufferedSender;\n\n}).call(this,{ env: {} })\n\n},{\"debug\":55,\"events\":3,\"inherits\":57}],26:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar inherits = require('inherits')\n  , IframeTransport = require('../iframe')\n  , objectUtils = require('../../utils/object')\n  ;\n\nmodule.exports = function(transport) {\n\n  function IframeWrapTransport(transUrl, baseUrl) {\n    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);\n  }\n\n  inherits(IframeWrapTransport, IframeTransport);\n\n  IframeWrapTransport.enabled = function(url, info) {\n    if (!global.document) {\n      return false;\n    }\n\n    var iframeInfo = objectUtils.extend({}, info);\n    iframeInfo.sameOrigin = true;\n    return transport.enabled(iframeInfo) && IframeTransport.enabled();\n  };\n\n  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;\n  IframeWrapTransport.needBody = true;\n  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)\n\n  IframeWrapTransport.facadeTransport = transport;\n\n  return IframeWrapTransport;\n};\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../../utils/object\":49,\"../iframe\":22,\"inherits\":57}],27:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:polling');\n}\n\nfunction Polling(Receiver, receiveUrl, AjaxObject) {\n  debug(receiveUrl);\n  EventEmitter.call(this);\n  this.Receiver = Receiver;\n  this.receiveUrl = receiveUrl;\n  this.AjaxObject = AjaxObject;\n  this._scheduleReceiver();\n}\n\ninherits(Polling, EventEmitter);\n\nPolling.prototype._scheduleReceiver = function() {\n  debug('_scheduleReceiver');\n  var self = this;\n  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);\n\n  poll.on('message', function(msg) {\n    debug('message', msg);\n    self.emit('message', msg);\n  });\n\n  poll.once('close', function(code, reason) {\n    debug('close', code, reason, self.pollIsClosing);\n    self.poll = poll = null;\n\n    if (!self.pollIsClosing) {\n      if (reason === 'network') {\n        self._scheduleReceiver();\n      } else {\n        self.emit('close', code || 1006, reason);\n        self.removeAllListeners();\n      }\n    }\n  });\n};\n\nPolling.prototype.abort = function() {\n  debug('abort');\n  this.removeAllListeners();\n  this.pollIsClosing = true;\n  if (this.poll) {\n    this.poll.abort();\n  }\n};\n\nmodule.exports = Polling;\n\n}).call(this,{ env: {} })\n\n},{\"debug\":55,\"events\":3,\"inherits\":57}],28:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar inherits = require('inherits')\n  , urlUtils = require('../../utils/url')\n  , BufferedSender = require('./buffered-sender')\n  , Polling = require('./polling')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:sender-receiver');\n}\n\nfunction SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {\n  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);\n  debug(pollUrl);\n  var self = this;\n  BufferedSender.call(this, transUrl, senderFunc);\n\n  this.poll = new Polling(Receiver, pollUrl, AjaxObject);\n  this.poll.on('message', function(msg) {\n    debug('poll message', msg);\n    self.emit('message', msg);\n  });\n  this.poll.once('close', function(code, reason) {\n    debug('poll close', code, reason);\n    self.poll = null;\n    self.emit('close', code, reason);\n    self.close();\n  });\n}\n\ninherits(SenderReceiver, BufferedSender);\n\nSenderReceiver.prototype.close = function() {\n  BufferedSender.prototype.close.call(this);\n  debug('close');\n  this.removeAllListeners();\n  if (this.poll) {\n    this.poll.abort();\n    this.poll = null;\n  }\n};\n\nmodule.exports = SenderReceiver;\n\n}).call(this,{ env: {} })\n\n},{\"../../utils/url\":52,\"./buffered-sender\":25,\"./polling\":27,\"debug\":55,\"inherits\":57}],29:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  , EventSourceDriver = require('eventsource')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:receiver:eventsource');\n}\n\nfunction EventSourceReceiver(url) {\n  debug(url);\n  EventEmitter.call(this);\n\n  var self = this;\n  var es = this.es = new EventSourceDriver(url);\n  es.onmessage = function(e) {\n    debug('message', e.data);\n    self.emit('message', decodeURI(e.data));\n  };\n  es.onerror = function(e) {\n    debug('error', es.readyState, e);\n    // ES on reconnection has readyState = 0 or 1.\n    // on network error it's CLOSED = 2\n    var reason = (es.readyState !== 2 ? 'network' : 'permanent');\n    self._cleanup();\n    self._close(reason);\n  };\n}\n\ninherits(EventSourceReceiver, EventEmitter);\n\nEventSourceReceiver.prototype.abort = function() {\n  debug('abort');\n  this._cleanup();\n  this._close('user');\n};\n\nEventSourceReceiver.prototype._cleanup = function() {\n  debug('cleanup');\n  var es = this.es;\n  if (es) {\n    es.onmessage = es.onerror = null;\n    es.close();\n    this.es = null;\n  }\n};\n\nEventSourceReceiver.prototype._close = function(reason) {\n  debug('close', reason);\n  var self = this;\n  // Safari and chrome < 15 crash if we close window before\n  // waiting for ES cleanup. See:\n  // https://code.google.com/p/chromium/issues/detail?id=89155\n  setTimeout(function() {\n    self.emit('close', null, reason);\n    self.removeAllListeners();\n  }, 200);\n};\n\nmodule.exports = EventSourceReceiver;\n\n}).call(this,{ env: {} })\n\n},{\"debug\":55,\"events\":3,\"eventsource\":18,\"inherits\":57}],30:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar inherits = require('inherits')\n  , iframeUtils = require('../../utils/iframe')\n  , urlUtils = require('../../utils/url')\n  , EventEmitter = require('events').EventEmitter\n  , random = require('../../utils/random')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:receiver:htmlfile');\n}\n\nfunction HtmlfileReceiver(url) {\n  debug(url);\n  EventEmitter.call(this);\n  var self = this;\n  iframeUtils.polluteGlobalNamespace();\n\n  this.id = 'a' + random.string(6);\n  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));\n\n  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);\n  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?\n      iframeUtils.createHtmlfile : iframeUtils.createIframe;\n\n  global[iframeUtils.WPrefix][this.id] = {\n    start: function() {\n      debug('start');\n      self.iframeObj.loaded();\n    }\n  , message: function(data) {\n      debug('message', data);\n      self.emit('message', data);\n    }\n  , stop: function() {\n      debug('stop');\n      self._cleanup();\n      self._close('network');\n    }\n  };\n  this.iframeObj = constructFunc(url, function() {\n    debug('callback');\n    self._cleanup();\n    self._close('permanent');\n  });\n}\n\ninherits(HtmlfileReceiver, EventEmitter);\n\nHtmlfileReceiver.prototype.abort = function() {\n  debug('abort');\n  this._cleanup();\n  this._close('user');\n};\n\nHtmlfileReceiver.prototype._cleanup = function() {\n  debug('_cleanup');\n  if (this.iframeObj) {\n    this.iframeObj.cleanup();\n    this.iframeObj = null;\n  }\n  delete global[iframeUtils.WPrefix][this.id];\n};\n\nHtmlfileReceiver.prototype._close = function(reason) {\n  debug('_close', reason);\n  this.emit('close', null, reason);\n  this.removeAllListeners();\n};\n\nHtmlfileReceiver.htmlfileEnabled = false;\n\n// obfuscate to avoid firewalls\nvar axo = ['Active'].concat('Object').join('X');\nif (axo in global) {\n  try {\n    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');\n  } catch (x) {\n    // intentionally empty\n  }\n}\n\nHtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;\n\nmodule.exports = HtmlfileReceiver;\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../../utils/iframe\":47,\"../../utils/random\":50,\"../../utils/url\":52,\"debug\":55,\"events\":3,\"inherits\":57}],31:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar utils = require('../../utils/iframe')\n  , random = require('../../utils/random')\n  , browser = require('../../utils/browser')\n  , urlUtils = require('../../utils/url')\n  , inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:receiver:jsonp');\n}\n\nfunction JsonpReceiver(url) {\n  debug(url);\n  var self = this;\n  EventEmitter.call(this);\n\n  utils.polluteGlobalNamespace();\n\n  this.id = 'a' + random.string(6);\n  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));\n\n  global[utils.WPrefix][this.id] = this._callback.bind(this);\n  this._createScript(urlWithId);\n\n  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.\n  this.timeoutId = setTimeout(function() {\n    debug('timeout');\n    self._abort(new Error('JSONP script loaded abnormally (timeout)'));\n  }, JsonpReceiver.timeout);\n}\n\ninherits(JsonpReceiver, EventEmitter);\n\nJsonpReceiver.prototype.abort = function() {\n  debug('abort');\n  if (global[utils.WPrefix][this.id]) {\n    var err = new Error('JSONP user aborted read');\n    err.code = 1000;\n    this._abort(err);\n  }\n};\n\nJsonpReceiver.timeout = 35000;\nJsonpReceiver.scriptErrorTimeout = 1000;\n\nJsonpReceiver.prototype._callback = function(data) {\n  debug('_callback', data);\n  this._cleanup();\n\n  if (this.aborting) {\n    return;\n  }\n\n  if (data) {\n    debug('message', data);\n    this.emit('message', data);\n  }\n  this.emit('close', null, 'network');\n  this.removeAllListeners();\n};\n\nJsonpReceiver.prototype._abort = function(err) {\n  debug('_abort', err);\n  this._cleanup();\n  this.aborting = true;\n  this.emit('close', err.code, err.message);\n  this.removeAllListeners();\n};\n\nJsonpReceiver.prototype._cleanup = function() {\n  debug('_cleanup');\n  clearTimeout(this.timeoutId);\n  if (this.script2) {\n    this.script2.parentNode.removeChild(this.script2);\n    this.script2 = null;\n  }\n  if (this.script) {\n    var script = this.script;\n    // Unfortunately, you can't really abort script loading of\n    // the script.\n    script.parentNode.removeChild(script);\n    script.onreadystatechange = script.onerror =\n        script.onload = script.onclick = null;\n    this.script = null;\n  }\n  delete global[utils.WPrefix][this.id];\n};\n\nJsonpReceiver.prototype._scriptError = function() {\n  debug('_scriptError');\n  var self = this;\n  if (this.errorTimer) {\n    return;\n  }\n\n  this.errorTimer = setTimeout(function() {\n    if (!self.loadedOkay) {\n      self._abort(new Error('JSONP script loaded abnormally (onerror)'));\n    }\n  }, JsonpReceiver.scriptErrorTimeout);\n};\n\nJsonpReceiver.prototype._createScript = function(url) {\n  debug('_createScript', url);\n  var self = this;\n  var script = this.script = global.document.createElement('script');\n  var script2;  // Opera synchronous load trick.\n\n  script.id = 'a' + random.string(8);\n  script.src = url;\n  script.type = 'text/javascript';\n  script.charset = 'UTF-8';\n  script.onerror = this._scriptError.bind(this);\n  script.onload = function() {\n    debug('onload');\n    self._abort(new Error('JSONP script loaded abnormally (onload)'));\n  };\n\n  // IE9 fires 'error' event after onreadystatechange or before, in random order.\n  // Use loadedOkay to determine if actually errored\n  script.onreadystatechange = function() {\n    debug('onreadystatechange', script.readyState);\n    if (/loaded|closed/.test(script.readyState)) {\n      if (script && script.htmlFor && script.onclick) {\n        self.loadedOkay = true;\n        try {\n          // In IE, actually execute the script.\n          script.onclick();\n        } catch (x) {\n          // intentionally empty\n        }\n      }\n      if (script) {\n        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));\n      }\n    }\n  };\n  // IE: event/htmlFor/onclick trick.\n  // One can't rely on proper order for onreadystatechange. In order to\n  // make sure, set a 'htmlFor' and 'event' properties, so that\n  // script code will be installed as 'onclick' handler for the\n  // script object. Later, onreadystatechange, manually execute this\n  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'\n  // set. For reference see:\n  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html\n  // Also, read on that about script ordering:\n  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order\n  if (typeof script.async === 'undefined' && global.document.attachEvent) {\n    // According to mozilla docs, in recent browsers script.async defaults\n    // to 'true', so we may use it to detect a good browser:\n    // https://developer.mozilla.org/en/HTML/Element/script\n    if (!browser.isOpera()) {\n      // Naively assume we're in IE\n      try {\n        script.htmlFor = script.id;\n        script.event = 'onclick';\n      } catch (x) {\n        // intentionally empty\n      }\n      script.async = true;\n    } else {\n      // Opera, second sync script hack\n      script2 = this.script2 = global.document.createElement('script');\n      script2.text = \"try{var a = document.getElementById('\" + script.id + \"'); if(a)a.onerror();}catch(x){};\";\n      script.async = script2.async = false;\n    }\n  }\n  if (typeof script.async !== 'undefined') {\n    script.async = true;\n  }\n\n  var head = global.document.getElementsByTagName('head')[0];\n  head.insertBefore(script, head.firstChild);\n  if (script2) {\n    head.insertBefore(script2, head.firstChild);\n  }\n};\n\nmodule.exports = JsonpReceiver;\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../../utils/browser\":44,\"../../utils/iframe\":47,\"../../utils/random\":50,\"../../utils/url\":52,\"debug\":55,\"events\":3,\"inherits\":57}],32:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:receiver:xhr');\n}\n\nfunction XhrReceiver(url, AjaxObject) {\n  debug(url);\n  EventEmitter.call(this);\n  var self = this;\n\n  this.bufferPosition = 0;\n\n  this.xo = new AjaxObject('POST', url, null);\n  this.xo.on('chunk', this._chunkHandler.bind(this));\n  this.xo.once('finish', function(status, text) {\n    debug('finish', status, text);\n    self._chunkHandler(status, text);\n    self.xo = null;\n    var reason = status === 200 ? 'network' : 'permanent';\n    debug('close', reason);\n    self.emit('close', null, reason);\n    self._cleanup();\n  });\n}\n\ninherits(XhrReceiver, EventEmitter);\n\nXhrReceiver.prototype._chunkHandler = function(status, text) {\n  debug('_chunkHandler', status);\n  if (status !== 200 || !text) {\n    return;\n  }\n\n  for (var idx = -1; ; this.bufferPosition += idx + 1) {\n    var buf = text.slice(this.bufferPosition);\n    idx = buf.indexOf('\\n');\n    if (idx === -1) {\n      break;\n    }\n    var msg = buf.slice(0, idx);\n    if (msg) {\n      debug('message', msg);\n      this.emit('message', msg);\n    }\n  }\n};\n\nXhrReceiver.prototype._cleanup = function() {\n  debug('_cleanup');\n  this.removeAllListeners();\n};\n\nXhrReceiver.prototype.abort = function() {\n  debug('abort');\n  if (this.xo) {\n    this.xo.close();\n    debug('close');\n    this.emit('close', null, 'user');\n    this.xo = null;\n  }\n  this._cleanup();\n};\n\nmodule.exports = XhrReceiver;\n\n}).call(this,{ env: {} })\n\n},{\"debug\":55,\"events\":3,\"inherits\":57}],33:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar random = require('../../utils/random')\n  , urlUtils = require('../../utils/url')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:sender:jsonp');\n}\n\nvar form, area;\n\nfunction createIframe(id) {\n  debug('createIframe', id);\n  try {\n    // ie6 dynamic iframes with target=\"\" support (thanks Chris Lambacher)\n    return global.document.createElement('<iframe name=\"' + id + '\">');\n  } catch (x) {\n    var iframe = global.document.createElement('iframe');\n    iframe.name = id;\n    return iframe;\n  }\n}\n\nfunction createForm() {\n  debug('createForm');\n  form = global.document.createElement('form');\n  form.style.display = 'none';\n  form.style.position = 'absolute';\n  form.method = 'POST';\n  form.enctype = 'application/x-www-form-urlencoded';\n  form.acceptCharset = 'UTF-8';\n\n  area = global.document.createElement('textarea');\n  area.name = 'd';\n  form.appendChild(area);\n\n  global.document.body.appendChild(form);\n}\n\nmodule.exports = function(url, payload, callback) {\n  debug(url, payload);\n  if (!form) {\n    createForm();\n  }\n  var id = 'a' + random.string(8);\n  form.target = id;\n  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);\n\n  var iframe = createIframe(id);\n  iframe.id = id;\n  iframe.style.display = 'none';\n  form.appendChild(iframe);\n\n  try {\n    area.value = payload;\n  } catch (e) {\n    // seriously broken browsers get here\n  }\n  form.submit();\n\n  var completed = function(err) {\n    debug('completed', id, err);\n    if (!iframe.onerror) {\n      return;\n    }\n    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;\n    // Opera mini doesn't like if we GC iframe\n    // immediately, thus this timeout.\n    setTimeout(function() {\n      debug('cleaning up', id);\n      iframe.parentNode.removeChild(iframe);\n      iframe = null;\n    }, 500);\n    area.value = '';\n    // It is not possible to detect if the iframe succeeded or\n    // failed to submit our form.\n    callback(err);\n  };\n  iframe.onerror = function() {\n    debug('onerror', id);\n    completed();\n  };\n  iframe.onload = function() {\n    debug('onload', id);\n    completed();\n  };\n  iframe.onreadystatechange = function(e) {\n    debug('onreadystatechange', id, iframe.readyState, e);\n    if (iframe.readyState === 'complete') {\n      completed();\n    }\n  };\n  return function() {\n    debug('aborted', id);\n    completed(new Error('Aborted'));\n  };\n};\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../../utils/random\":50,\"../../utils/url\":52,\"debug\":55}],34:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar EventEmitter = require('events').EventEmitter\n  , inherits = require('inherits')\n  , eventUtils = require('../../utils/event')\n  , browser = require('../../utils/browser')\n  , urlUtils = require('../../utils/url')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:sender:xdr');\n}\n\n// References:\n//   http://ajaxian.com/archives/100-line-ajax-wrapper\n//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx\n\nfunction XDRObject(method, url, payload) {\n  debug(method, url);\n  var self = this;\n  EventEmitter.call(this);\n\n  setTimeout(function() {\n    self._start(method, url, payload);\n  }, 0);\n}\n\ninherits(XDRObject, EventEmitter);\n\nXDRObject.prototype._start = function(method, url, payload) {\n  debug('_start');\n  var self = this;\n  var xdr = new global.XDomainRequest();\n  // IE caches even POSTs\n  url = urlUtils.addQuery(url, 't=' + (+new Date()));\n\n  xdr.onerror = function() {\n    debug('onerror');\n    self._error();\n  };\n  xdr.ontimeout = function() {\n    debug('ontimeout');\n    self._error();\n  };\n  xdr.onprogress = function() {\n    debug('progress', xdr.responseText);\n    self.emit('chunk', 200, xdr.responseText);\n  };\n  xdr.onload = function() {\n    debug('load');\n    self.emit('finish', 200, xdr.responseText);\n    self._cleanup(false);\n  };\n  this.xdr = xdr;\n  this.unloadRef = eventUtils.unloadAdd(function() {\n    self._cleanup(true);\n  });\n  try {\n    // Fails with AccessDenied if port number is bogus\n    this.xdr.open(method, url);\n    if (this.timeout) {\n      this.xdr.timeout = this.timeout;\n    }\n    this.xdr.send(payload);\n  } catch (x) {\n    this._error();\n  }\n};\n\nXDRObject.prototype._error = function() {\n  this.emit('finish', 0, '');\n  this._cleanup(false);\n};\n\nXDRObject.prototype._cleanup = function(abort) {\n  debug('cleanup', abort);\n  if (!this.xdr) {\n    return;\n  }\n  this.removeAllListeners();\n  eventUtils.unloadDel(this.unloadRef);\n\n  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;\n  if (abort) {\n    try {\n      this.xdr.abort();\n    } catch (x) {\n      // intentionally empty\n    }\n  }\n  this.unloadRef = this.xdr = null;\n};\n\nXDRObject.prototype.close = function() {\n  debug('close');\n  this._cleanup(true);\n};\n\n// IE 8/9 if the request target uses the same scheme - #79\nXDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());\n\nmodule.exports = XDRObject;\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../../utils/browser\":44,\"../../utils/event\":46,\"../../utils/url\":52,\"debug\":55,\"events\":3,\"inherits\":57}],35:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , XhrDriver = require('../driver/xhr')\n  ;\n\nfunction XHRCorsObject(method, url, payload, opts) {\n  XhrDriver.call(this, method, url, payload, opts);\n}\n\ninherits(XHRCorsObject, XhrDriver);\n\nXHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;\n\nmodule.exports = XHRCorsObject;\n\n},{\"../driver/xhr\":17,\"inherits\":57}],36:[function(require,module,exports){\n'use strict';\n\nvar EventEmitter = require('events').EventEmitter\n  , inherits = require('inherits')\n  ;\n\nfunction XHRFake(/* method, url, payload, opts */) {\n  var self = this;\n  EventEmitter.call(this);\n\n  this.to = setTimeout(function() {\n    self.emit('finish', 200, '{}');\n  }, XHRFake.timeout);\n}\n\ninherits(XHRFake, EventEmitter);\n\nXHRFake.prototype.close = function() {\n  clearTimeout(this.to);\n};\n\nXHRFake.timeout = 2000;\n\nmodule.exports = XHRFake;\n\n},{\"events\":3,\"inherits\":57}],37:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , XhrDriver = require('../driver/xhr')\n  ;\n\nfunction XHRLocalObject(method, url, payload /*, opts */) {\n  XhrDriver.call(this, method, url, payload, {\n    noCredentials: true\n  });\n}\n\ninherits(XHRLocalObject, XhrDriver);\n\nXHRLocalObject.enabled = XhrDriver.enabled;\n\nmodule.exports = XHRLocalObject;\n\n},{\"../driver/xhr\":17,\"inherits\":57}],38:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar utils = require('../utils/event')\n  , urlUtils = require('../utils/url')\n  , inherits = require('inherits')\n  , EventEmitter = require('events').EventEmitter\n  , WebsocketDriver = require('./driver/websocket')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:websocket');\n}\n\nfunction WebSocketTransport(transUrl, ignore, options) {\n  if (!WebSocketTransport.enabled()) {\n    throw new Error('Transport created when disabled');\n  }\n\n  EventEmitter.call(this);\n  debug('constructor', transUrl);\n\n  var self = this;\n  var url = urlUtils.addPath(transUrl, '/websocket');\n  if (url.slice(0, 5) === 'https') {\n    url = 'wss' + url.slice(5);\n  } else {\n    url = 'ws' + url.slice(4);\n  }\n  this.url = url;\n\n  this.ws = new WebsocketDriver(this.url, [], options);\n  this.ws.onmessage = function(e) {\n    debug('message event', e.data);\n    self.emit('message', e.data);\n  };\n  // Firefox has an interesting bug. If a websocket connection is\n  // created after onunload, it stays alive even when user\n  // navigates away from the page. In such situation let's lie -\n  // let's not open the ws connection at all. See:\n  // https://github.com/sockjs/sockjs-client/issues/28\n  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085\n  this.unloadRef = utils.unloadAdd(function() {\n    debug('unload');\n    self.ws.close();\n  });\n  this.ws.onclose = function(e) {\n    debug('close event', e.code, e.reason);\n    self.emit('close', e.code, e.reason);\n    self._cleanup();\n  };\n  this.ws.onerror = function(e) {\n    debug('error event', e);\n    self.emit('close', 1006, 'WebSocket connection broken');\n    self._cleanup();\n  };\n}\n\ninherits(WebSocketTransport, EventEmitter);\n\nWebSocketTransport.prototype.send = function(data) {\n  var msg = '[' + data + ']';\n  debug('send', msg);\n  this.ws.send(msg);\n};\n\nWebSocketTransport.prototype.close = function() {\n  debug('close');\n  var ws = this.ws;\n  this._cleanup();\n  if (ws) {\n    ws.close();\n  }\n};\n\nWebSocketTransport.prototype._cleanup = function() {\n  debug('_cleanup');\n  var ws = this.ws;\n  if (ws) {\n    ws.onmessage = ws.onclose = ws.onerror = null;\n  }\n  utils.unloadDel(this.unloadRef);\n  this.unloadRef = this.ws = null;\n  this.removeAllListeners();\n};\n\nWebSocketTransport.enabled = function() {\n  debug('enabled');\n  return !!WebsocketDriver;\n};\nWebSocketTransport.transportName = 'websocket';\n\n// In theory, ws should require 1 round trip. But in chrome, this is\n// not very stable over SSL. Most likely a ws connection requires a\n// separate SSL connection, in which case 2 round trips are an\n// absolute minumum.\nWebSocketTransport.roundTrips = 2;\n\nmodule.exports = WebSocketTransport;\n\n}).call(this,{ env: {} })\n\n},{\"../utils/event\":46,\"../utils/url\":52,\"./driver/websocket\":19,\"debug\":55,\"events\":3,\"inherits\":57}],39:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , AjaxBasedTransport = require('./lib/ajax-based')\n  , XdrStreamingTransport = require('./xdr-streaming')\n  , XhrReceiver = require('./receiver/xhr')\n  , XDRObject = require('./sender/xdr')\n  ;\n\nfunction XdrPollingTransport(transUrl) {\n  if (!XDRObject.enabled) {\n    throw new Error('Transport created when disabled');\n  }\n  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);\n}\n\ninherits(XdrPollingTransport, AjaxBasedTransport);\n\nXdrPollingTransport.enabled = XdrStreamingTransport.enabled;\nXdrPollingTransport.transportName = 'xdr-polling';\nXdrPollingTransport.roundTrips = 2; // preflight, ajax\n\nmodule.exports = XdrPollingTransport;\n\n},{\"./lib/ajax-based\":24,\"./receiver/xhr\":32,\"./sender/xdr\":34,\"./xdr-streaming\":40,\"inherits\":57}],40:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , AjaxBasedTransport = require('./lib/ajax-based')\n  , XhrReceiver = require('./receiver/xhr')\n  , XDRObject = require('./sender/xdr')\n  ;\n\n// According to:\n//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests\n//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/\n\nfunction XdrStreamingTransport(transUrl) {\n  if (!XDRObject.enabled) {\n    throw new Error('Transport created when disabled');\n  }\n  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);\n}\n\ninherits(XdrStreamingTransport, AjaxBasedTransport);\n\nXdrStreamingTransport.enabled = function(info) {\n  if (info.cookie_needed || info.nullOrigin) {\n    return false;\n  }\n  return XDRObject.enabled && info.sameScheme;\n};\n\nXdrStreamingTransport.transportName = 'xdr-streaming';\nXdrStreamingTransport.roundTrips = 2; // preflight, ajax\n\nmodule.exports = XdrStreamingTransport;\n\n},{\"./lib/ajax-based\":24,\"./receiver/xhr\":32,\"./sender/xdr\":34,\"inherits\":57}],41:[function(require,module,exports){\n'use strict';\n\nvar inherits = require('inherits')\n  , AjaxBasedTransport = require('./lib/ajax-based')\n  , XhrReceiver = require('./receiver/xhr')\n  , XHRCorsObject = require('./sender/xhr-cors')\n  , XHRLocalObject = require('./sender/xhr-local')\n  ;\n\nfunction XhrPollingTransport(transUrl) {\n  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {\n    throw new Error('Transport created when disabled');\n  }\n  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);\n}\n\ninherits(XhrPollingTransport, AjaxBasedTransport);\n\nXhrPollingTransport.enabled = function(info) {\n  if (info.nullOrigin) {\n    return false;\n  }\n\n  if (XHRLocalObject.enabled && info.sameOrigin) {\n    return true;\n  }\n  return XHRCorsObject.enabled;\n};\n\nXhrPollingTransport.transportName = 'xhr-polling';\nXhrPollingTransport.roundTrips = 2; // preflight, ajax\n\nmodule.exports = XhrPollingTransport;\n\n},{\"./lib/ajax-based\":24,\"./receiver/xhr\":32,\"./sender/xhr-cors\":35,\"./sender/xhr-local\":37,\"inherits\":57}],42:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar inherits = require('inherits')\n  , AjaxBasedTransport = require('./lib/ajax-based')\n  , XhrReceiver = require('./receiver/xhr')\n  , XHRCorsObject = require('./sender/xhr-cors')\n  , XHRLocalObject = require('./sender/xhr-local')\n  , browser = require('../utils/browser')\n  ;\n\nfunction XhrStreamingTransport(transUrl) {\n  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {\n    throw new Error('Transport created when disabled');\n  }\n  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);\n}\n\ninherits(XhrStreamingTransport, AjaxBasedTransport);\n\nXhrStreamingTransport.enabled = function(info) {\n  if (info.nullOrigin) {\n    return false;\n  }\n  // Opera doesn't support xhr-streaming #60\n  // But it might be able to #92\n  if (browser.isOpera()) {\n    return false;\n  }\n\n  return XHRCorsObject.enabled;\n};\n\nXhrStreamingTransport.transportName = 'xhr-streaming';\nXhrStreamingTransport.roundTrips = 2; // preflight, ajax\n\n// Safari gets confused when a streaming ajax request is started\n// before onload. This causes the load indicator to spin indefinetely.\n// Only require body when used in a browser\nXhrStreamingTransport.needBody = !!global.document;\n\nmodule.exports = XhrStreamingTransport;\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"../utils/browser\":44,\"./lib/ajax-based\":24,\"./receiver/xhr\":32,\"./sender/xhr-cors\":35,\"./sender/xhr-local\":37,\"inherits\":57}],43:[function(require,module,exports){\n(function (global){\n'use strict';\n\nif (global.crypto && global.crypto.getRandomValues) {\n  module.exports.randomBytes = function(length) {\n    var bytes = new Uint8Array(length);\n    global.crypto.getRandomValues(bytes);\n    return bytes;\n  };\n} else {\n  module.exports.randomBytes = function(length) {\n    var bytes = new Array(length);\n    for (var i = 0; i < length; i++) {\n      bytes[i] = Math.floor(Math.random() * 256);\n    }\n    return bytes;\n  };\n}\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],44:[function(require,module,exports){\n(function (global){\n'use strict';\n\nmodule.exports = {\n  isOpera: function() {\n    return global.navigator &&\n      /opera/i.test(global.navigator.userAgent);\n  }\n\n, isKonqueror: function() {\n    return global.navigator &&\n      /konqueror/i.test(global.navigator.userAgent);\n  }\n\n  // #187 wrap document.domain in try/catch because of WP8 from file:///\n, hasDomain: function () {\n    // non-browser client always has a domain\n    if (!global.document) {\n      return true;\n    }\n\n    try {\n      return !!global.document.domain;\n    } catch (e) {\n      return false;\n    }\n  }\n};\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],45:[function(require,module,exports){\n'use strict';\n\nvar JSON3 = require('json3');\n\n// Some extra characters that Chrome gets wrong, and substitutes with\n// something else on the wire.\n// eslint-disable-next-line no-control-regex, no-misleading-character-class\nvar extraEscapable = /[\\x00-\\x1f\\ud800-\\udfff\\ufffe\\uffff\\u0300-\\u0333\\u033d-\\u0346\\u034a-\\u034c\\u0350-\\u0352\\u0357-\\u0358\\u035c-\\u0362\\u0374\\u037e\\u0387\\u0591-\\u05af\\u05c4\\u0610-\\u0617\\u0653-\\u0654\\u0657-\\u065b\\u065d-\\u065e\\u06df-\\u06e2\\u06eb-\\u06ec\\u0730\\u0732-\\u0733\\u0735-\\u0736\\u073a\\u073d\\u073f-\\u0741\\u0743\\u0745\\u0747\\u07eb-\\u07f1\\u0951\\u0958-\\u095f\\u09dc-\\u09dd\\u09df\\u0a33\\u0a36\\u0a59-\\u0a5b\\u0a5e\\u0b5c-\\u0b5d\\u0e38-\\u0e39\\u0f43\\u0f4d\\u0f52\\u0f57\\u0f5c\\u0f69\\u0f72-\\u0f76\\u0f78\\u0f80-\\u0f83\\u0f93\\u0f9d\\u0fa2\\u0fa7\\u0fac\\u0fb9\\u1939-\\u193a\\u1a17\\u1b6b\\u1cda-\\u1cdb\\u1dc0-\\u1dcf\\u1dfc\\u1dfe\\u1f71\\u1f73\\u1f75\\u1f77\\u1f79\\u1f7b\\u1f7d\\u1fbb\\u1fbe\\u1fc9\\u1fcb\\u1fd3\\u1fdb\\u1fe3\\u1feb\\u1fee-\\u1fef\\u1ff9\\u1ffb\\u1ffd\\u2000-\\u2001\\u20d0-\\u20d1\\u20d4-\\u20d7\\u20e7-\\u20e9\\u2126\\u212a-\\u212b\\u2329-\\u232a\\u2adc\\u302b-\\u302c\\uaab2-\\uaab3\\uf900-\\ufa0d\\ufa10\\ufa12\\ufa15-\\ufa1e\\ufa20\\ufa22\\ufa25-\\ufa26\\ufa2a-\\ufa2d\\ufa30-\\ufa6d\\ufa70-\\ufad9\\ufb1d\\ufb1f\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40-\\ufb41\\ufb43-\\ufb44\\ufb46-\\ufb4e\\ufff0-\\uffff]/g\n  , extraLookup;\n\n// This may be quite slow, so let's delay until user actually uses bad\n// characters.\nvar unrollLookup = function(escapable) {\n  var i;\n  var unrolled = {};\n  var c = [];\n  for (i = 0; i < 65536; i++) {\n    c.push( String.fromCharCode(i) );\n  }\n  escapable.lastIndex = 0;\n  c.join('').replace(escapable, function(a) {\n    unrolled[ a ] = '\\\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);\n    return '';\n  });\n  escapable.lastIndex = 0;\n  return unrolled;\n};\n\n// Quote string, also taking care of unicode characters that browsers\n// often break. Especially, take care of unicode surrogates:\n// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates\nmodule.exports = {\n  quote: function(string) {\n    var quoted = JSON3.stringify(string);\n\n    // In most cases this should be very fast and good enough.\n    extraEscapable.lastIndex = 0;\n    if (!extraEscapable.test(quoted)) {\n      return quoted;\n    }\n\n    if (!extraLookup) {\n      extraLookup = unrollLookup(extraEscapable);\n    }\n\n    return quoted.replace(extraEscapable, function(a) {\n      return extraLookup[a];\n    });\n  }\n};\n\n},{\"json3\":58}],46:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar random = require('./random');\n\nvar onUnload = {}\n  , afterUnload = false\n    // detect google chrome packaged apps because they don't allow the 'unload' event\n  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime\n  ;\n\nmodule.exports = {\n  attachEvent: function(event, listener) {\n    if (typeof global.addEventListener !== 'undefined') {\n      global.addEventListener(event, listener, false);\n    } else if (global.document && global.attachEvent) {\n      // IE quirks.\n      // According to: http://stevesouders.com/misc/test-postmessage.php\n      // the message gets delivered only to 'document', not 'window'.\n      global.document.attachEvent('on' + event, listener);\n      // I get 'window' for ie8.\n      global.attachEvent('on' + event, listener);\n    }\n  }\n\n, detachEvent: function(event, listener) {\n    if (typeof global.addEventListener !== 'undefined') {\n      global.removeEventListener(event, listener, false);\n    } else if (global.document && global.detachEvent) {\n      global.document.detachEvent('on' + event, listener);\n      global.detachEvent('on' + event, listener);\n    }\n  }\n\n, unloadAdd: function(listener) {\n    if (isChromePackagedApp) {\n      return null;\n    }\n\n    var ref = random.string(8);\n    onUnload[ref] = listener;\n    if (afterUnload) {\n      setTimeout(this.triggerUnloadCallbacks, 0);\n    }\n    return ref;\n  }\n\n, unloadDel: function(ref) {\n    if (ref in onUnload) {\n      delete onUnload[ref];\n    }\n  }\n\n, triggerUnloadCallbacks: function() {\n    for (var ref in onUnload) {\n      onUnload[ref]();\n      delete onUnload[ref];\n    }\n  }\n};\n\nvar unloadTriggered = function() {\n  if (afterUnload) {\n    return;\n  }\n  afterUnload = true;\n  module.exports.triggerUnloadCallbacks();\n};\n\n// 'unload' alone is not reliable in opera within an iframe, but we\n// can't use `beforeunload` as IE fires it on javascript: links.\nif (!isChromePackagedApp) {\n  module.exports.attachEvent('unload', unloadTriggered);\n}\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"./random\":50}],47:[function(require,module,exports){\n(function (process,global){\n'use strict';\n\nvar eventUtils = require('./event')\n  , JSON3 = require('json3')\n  , browser = require('./browser')\n  ;\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:utils:iframe');\n}\n\nmodule.exports = {\n  WPrefix: '_jp'\n, currentWindowId: null\n\n, polluteGlobalNamespace: function() {\n    if (!(module.exports.WPrefix in global)) {\n      global[module.exports.WPrefix] = {};\n    }\n  }\n\n, postMessage: function(type, data) {\n    if (global.parent !== global) {\n      global.parent.postMessage(JSON3.stringify({\n        windowId: module.exports.currentWindowId\n      , type: type\n      , data: data || ''\n      }), '*');\n    } else {\n      debug('Cannot postMessage, no parent window.', type, data);\n    }\n  }\n\n, createIframe: function(iframeUrl, errorCallback) {\n    var iframe = global.document.createElement('iframe');\n    var tref, unloadRef;\n    var unattach = function() {\n      debug('unattach');\n      clearTimeout(tref);\n      // Explorer had problems with that.\n      try {\n        iframe.onload = null;\n      } catch (x) {\n        // intentionally empty\n      }\n      iframe.onerror = null;\n    };\n    var cleanup = function() {\n      debug('cleanup');\n      if (iframe) {\n        unattach();\n        // This timeout makes chrome fire onbeforeunload event\n        // within iframe. Without the timeout it goes straight to\n        // onunload.\n        setTimeout(function() {\n          if (iframe) {\n            iframe.parentNode.removeChild(iframe);\n          }\n          iframe = null;\n        }, 0);\n        eventUtils.unloadDel(unloadRef);\n      }\n    };\n    var onerror = function(err) {\n      debug('onerror', err);\n      if (iframe) {\n        cleanup();\n        errorCallback(err);\n      }\n    };\n    var post = function(msg, origin) {\n      debug('post', msg, origin);\n      setTimeout(function() {\n        try {\n          // When the iframe is not loaded, IE raises an exception\n          // on 'contentWindow'.\n          if (iframe && iframe.contentWindow) {\n            iframe.contentWindow.postMessage(msg, origin);\n          }\n        } catch (x) {\n          // intentionally empty\n        }\n      }, 0);\n    };\n\n    iframe.src = iframeUrl;\n    iframe.style.display = 'none';\n    iframe.style.position = 'absolute';\n    iframe.onerror = function() {\n      onerror('onerror');\n    };\n    iframe.onload = function() {\n      debug('onload');\n      // `onload` is triggered before scripts on the iframe are\n      // executed. Give it few seconds to actually load stuff.\n      clearTimeout(tref);\n      tref = setTimeout(function() {\n        onerror('onload timeout');\n      }, 2000);\n    };\n    global.document.body.appendChild(iframe);\n    tref = setTimeout(function() {\n      onerror('timeout');\n    }, 15000);\n    unloadRef = eventUtils.unloadAdd(cleanup);\n    return {\n      post: post\n    , cleanup: cleanup\n    , loaded: unattach\n    };\n  }\n\n/* eslint no-undef: \"off\", new-cap: \"off\" */\n, createHtmlfile: function(iframeUrl, errorCallback) {\n    var axo = ['Active'].concat('Object').join('X');\n    var doc = new global[axo]('htmlfile');\n    var tref, unloadRef;\n    var iframe;\n    var unattach = function() {\n      clearTimeout(tref);\n      iframe.onerror = null;\n    };\n    var cleanup = function() {\n      if (doc) {\n        unattach();\n        eventUtils.unloadDel(unloadRef);\n        iframe.parentNode.removeChild(iframe);\n        iframe = doc = null;\n        CollectGarbage();\n      }\n    };\n    var onerror = function(r) {\n      debug('onerror', r);\n      if (doc) {\n        cleanup();\n        errorCallback(r);\n      }\n    };\n    var post = function(msg, origin) {\n      try {\n        // When the iframe is not loaded, IE raises an exception\n        // on 'contentWindow'.\n        setTimeout(function() {\n          if (iframe && iframe.contentWindow) {\n              iframe.contentWindow.postMessage(msg, origin);\n          }\n        }, 0);\n      } catch (x) {\n        // intentionally empty\n      }\n    };\n\n    doc.open();\n    doc.write('<html><s' + 'cript>' +\n              'document.domain=\"' + global.document.domain + '\";' +\n              '</s' + 'cript></html>');\n    doc.close();\n    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];\n    var c = doc.createElement('div');\n    doc.body.appendChild(c);\n    iframe = doc.createElement('iframe');\n    c.appendChild(iframe);\n    iframe.src = iframeUrl;\n    iframe.onerror = function() {\n      onerror('onerror');\n    };\n    tref = setTimeout(function() {\n      onerror('timeout');\n    }, 15000);\n    unloadRef = eventUtils.unloadAdd(cleanup);\n    return {\n      post: post\n    , cleanup: cleanup\n    , loaded: unattach\n    };\n  }\n};\n\nmodule.exports.iframeEnabled = false;\nif (global.document) {\n  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with\n  // huge delay, or not at all.\n  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||\n    typeof global.postMessage === 'object') && (!browser.isKonqueror());\n}\n\n}).call(this,{ env: {} },typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"./browser\":44,\"./event\":46,\"debug\":55,\"json3\":58}],48:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar logObject = {};\n['log', 'debug', 'warn'].forEach(function (level) {\n  var levelExists;\n\n  try {\n    levelExists = global.console && global.console[level] && global.console[level].apply;\n  } catch(e) {\n    // do nothing\n  }\n\n  logObject[level] = levelExists ? function () {\n    return global.console[level].apply(global.console, arguments);\n  } : (level === 'log' ? function () {} : logObject.log);\n});\n\nmodule.exports = logObject;\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],49:[function(require,module,exports){\n'use strict';\n\nmodule.exports = {\n  isObject: function(obj) {\n    var type = typeof obj;\n    return type === 'function' || type === 'object' && !!obj;\n  }\n\n, extend: function(obj) {\n    if (!this.isObject(obj)) {\n      return obj;\n    }\n    var source, prop;\n    for (var i = 1, length = arguments.length; i < length; i++) {\n      source = arguments[i];\n      for (prop in source) {\n        if (Object.prototype.hasOwnProperty.call(source, prop)) {\n          obj[prop] = source[prop];\n        }\n      }\n    }\n    return obj;\n  }\n};\n\n},{}],50:[function(require,module,exports){\n'use strict';\n\nvar crypto = require('crypto');\n\n// This string has length 32, a power of 2, so the modulus doesn't introduce a\n// bias.\nvar _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';\nmodule.exports = {\n  string: function(length) {\n    var max = _randomStringChars.length;\n    var bytes = crypto.randomBytes(length);\n    var ret = [];\n    for (var i = 0; i < length; i++) {\n      ret.push(_randomStringChars.substr(bytes[i] % max, 1));\n    }\n    return ret.join('');\n  }\n\n, number: function(max) {\n    return Math.floor(Math.random() * max);\n  }\n\n, numberString: function(max) {\n    var t = ('' + (max - 1)).length;\n    var p = new Array(t + 1).join('0');\n    return (p + this.number(max)).slice(-t);\n  }\n};\n\n},{\"crypto\":43}],51:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:utils:transport');\n}\n\nmodule.exports = function(availableTransports) {\n  return {\n    filterToEnabled: function(transportsWhitelist, info) {\n      var transports = {\n        main: []\n      , facade: []\n      };\n      if (!transportsWhitelist) {\n        transportsWhitelist = [];\n      } else if (typeof transportsWhitelist === 'string') {\n        transportsWhitelist = [transportsWhitelist];\n      }\n\n      availableTransports.forEach(function(trans) {\n        if (!trans) {\n          return;\n        }\n\n        if (trans.transportName === 'websocket' && info.websocket === false) {\n          debug('disabled from server', 'websocket');\n          return;\n        }\n\n        if (transportsWhitelist.length &&\n            transportsWhitelist.indexOf(trans.transportName) === -1) {\n          debug('not in whitelist', trans.transportName);\n          return;\n        }\n\n        if (trans.enabled(info)) {\n          debug('enabled', trans.transportName);\n          transports.main.push(trans);\n          if (trans.facadeTransport) {\n            transports.facade.push(trans.facadeTransport);\n          }\n        } else {\n          debug('disabled', trans.transportName);\n        }\n      });\n      return transports;\n    }\n  };\n};\n\n}).call(this,{ env: {} })\n\n},{\"debug\":55}],52:[function(require,module,exports){\n(function (process){\n'use strict';\n\nvar URL = require('url-parse');\n\nvar debug = function() {};\nif (process.env.NODE_ENV !== 'production') {\n  debug = require('debug')('sockjs-client:utils:url');\n}\n\nmodule.exports = {\n  getOrigin: function(url) {\n    if (!url) {\n      return null;\n    }\n\n    var p = new URL(url);\n    if (p.protocol === 'file:') {\n      return null;\n    }\n\n    var port = p.port;\n    if (!port) {\n      port = (p.protocol === 'https:') ? '443' : '80';\n    }\n\n    return p.protocol + '//' + p.hostname + ':' + port;\n  }\n\n, isOriginEqual: function(a, b) {\n    var res = this.getOrigin(a) === this.getOrigin(b);\n    debug('same', a, b, res);\n    return res;\n  }\n\n, isSchemeEqual: function(a, b) {\n    return (a.split(':')[0] === b.split(':')[0]);\n  }\n\n, addPath: function (url, path) {\n    var qs = url.split('?');\n    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');\n  }\n\n, addQuery: function (url, q) {\n    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));\n  }\n\n, isLoopbackAddr: function (addr) {\n    return /^127\\.([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})$/i.test(addr) || /^\\[::1\\]$/.test(addr);\n  }\n};\n\n}).call(this,{ env: {} })\n\n},{\"debug\":55,\"url-parse\":61}],53:[function(require,module,exports){\nmodule.exports = '1.5.1';\n\n},{}],54:[function(require,module,exports){\n/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar w = d * 7;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isFinite(val)) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^(-?(?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'weeks':\n    case 'week':\n    case 'w':\n      return n * w;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  var msAbs = Math.abs(ms);\n  if (msAbs >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (msAbs >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (msAbs >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (msAbs >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  var msAbs = Math.abs(ms);\n  if (msAbs >= d) {\n    return plural(ms, msAbs, d, 'day');\n  }\n  if (msAbs >= h) {\n    return plural(ms, msAbs, h, 'hour');\n  }\n  if (msAbs >= m) {\n    return plural(ms, msAbs, m, 'minute');\n  }\n  if (msAbs >= s) {\n    return plural(ms, msAbs, s, 'second');\n  }\n  return ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, msAbs, n, name) {\n  var isPlural = msAbs >= n * 1.5;\n  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');\n}\n\n},{}],55:[function(require,module,exports){\n(function (process){\n\"use strict\";\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\n/* eslint-env browser */\n\n/**\n * This is the web browser implementation of `debug()`.\n */\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = localstorage();\n/**\n * Colors.\n */\n\nexports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n// eslint-disable-next-line complexity\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {\n    return true;\n  } // Internet Explorer and Edge do not support colors.\n\n\n  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\\/(\\d+)/)) {\n    return false;\n  } // Is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n\n\n  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773\n  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?\n  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker\n  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/);\n}\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\n\nfunction formatArgs(args) {\n  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);\n\n  if (!this.useColors) {\n    return;\n  }\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit'); // The final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function (match) {\n    if (match === '%%') {\n      return;\n    }\n\n    index++;\n\n    if (match === '%c') {\n      // We only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n  args.splice(lastC, 0, c);\n}\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\n\nfunction log() {\n  var _console;\n\n  // This hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return (typeof console === \"undefined\" ? \"undefined\" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);\n}\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\n\nfunction save(namespaces) {\n  try {\n    if (namespaces) {\n      exports.storage.setItem('debug', namespaces);\n    } else {\n      exports.storage.removeItem('debug');\n    }\n  } catch (error) {// Swallow\n    // XXX (@Qix-) should we be logging these?\n  }\n}\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\n\nfunction load() {\n  var r;\n\n  try {\n    r = exports.storage.getItem('debug');\n  } catch (error) {} // Swallow\n  // XXX (@Qix-) should we be logging these?\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n\n\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\n\nfunction localstorage() {\n  try {\n    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context\n    // The Browser also has localStorage in the global context.\n    return localStorage;\n  } catch (error) {// Swallow\n    // XXX (@Qix-) should we be logging these?\n  }\n}\n\nmodule.exports = require('./common')(exports);\nvar formatters = module.exports.formatters;\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nformatters.j = function (v) {\n  try {\n    return JSON.stringify(v);\n  } catch (error) {\n    return '[UnexpectedJSONParseError]: ' + error.message;\n  }\n};\n\n\n}).call(this,{ env: {} })\n\n},{\"./common\":56}],56:[function(require,module,exports){\n\"use strict\";\n\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n */\nfunction setup(env) {\n  createDebug.debug = createDebug;\n  createDebug.default = createDebug;\n  createDebug.coerce = coerce;\n  createDebug.disable = disable;\n  createDebug.enable = enable;\n  createDebug.enabled = enabled;\n  createDebug.humanize = require('ms');\n  Object.keys(env).forEach(function (key) {\n    createDebug[key] = env[key];\n  });\n  /**\n  * Active `debug` instances.\n  */\n\n  createDebug.instances = [];\n  /**\n  * The currently active debug mode names, and names to skip.\n  */\n\n  createDebug.names = [];\n  createDebug.skips = [];\n  /**\n  * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n  *\n  * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n  */\n\n  createDebug.formatters = {};\n  /**\n  * Selects a color for a debug namespace\n  * @param {String} namespace The namespace string for the for the debug instance to be colored\n  * @return {Number|String} An ANSI color code for the given namespace\n  * @api private\n  */\n\n  function selectColor(namespace) {\n    var hash = 0;\n\n    for (var i = 0; i < namespace.length; i++) {\n      hash = (hash << 5) - hash + namespace.charCodeAt(i);\n      hash |= 0; // Convert to 32bit integer\n    }\n\n    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];\n  }\n\n  createDebug.selectColor = selectColor;\n  /**\n  * Create a debugger with the given `namespace`.\n  *\n  * @param {String} namespace\n  * @return {Function}\n  * @api public\n  */\n\n  function createDebug(namespace) {\n    var prevTime;\n\n    function debug() {\n      // Disabled?\n      if (!debug.enabled) {\n        return;\n      }\n\n      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n        args[_key] = arguments[_key];\n      }\n\n      var self = debug; // Set `diff` timestamp\n\n      var curr = Number(new Date());\n      var ms = curr - (prevTime || curr);\n      self.diff = ms;\n      self.prev = prevTime;\n      self.curr = curr;\n      prevTime = curr;\n      args[0] = createDebug.coerce(args[0]);\n\n      if (typeof args[0] !== 'string') {\n        // Anything else let's inspect with %O\n        args.unshift('%O');\n      } // Apply any `formatters` transformations\n\n\n      var index = 0;\n      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {\n        // If we encounter an escaped % then don't increase the array index\n        if (match === '%%') {\n          return match;\n        }\n\n        index++;\n        var formatter = createDebug.formatters[format];\n\n        if (typeof formatter === 'function') {\n          var val = args[index];\n          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`\n\n          args.splice(index, 1);\n          index--;\n        }\n\n        return match;\n      }); // Apply env-specific formatting (colors, etc.)\n\n      createDebug.formatArgs.call(self, args);\n      var logFn = self.log || createDebug.log;\n      logFn.apply(self, args);\n    }\n\n    debug.namespace = namespace;\n    debug.enabled = createDebug.enabled(namespace);\n    debug.useColors = createDebug.useColors();\n    debug.color = selectColor(namespace);\n    debug.destroy = destroy;\n    debug.extend = extend; // Debug.formatArgs = formatArgs;\n    // debug.rawLog = rawLog;\n    // env-specific initialization logic for debug instances\n\n    if (typeof createDebug.init === 'function') {\n      createDebug.init(debug);\n    }\n\n    createDebug.instances.push(debug);\n    return debug;\n  }\n\n  function destroy() {\n    var index = createDebug.instances.indexOf(this);\n\n    if (index !== -1) {\n      createDebug.instances.splice(index, 1);\n      return true;\n    }\n\n    return false;\n  }\n\n  function extend(namespace, delimiter) {\n    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);\n  }\n  /**\n  * Enables a debug mode by namespaces. This can include modes\n  * separated by a colon and wildcards.\n  *\n  * @param {String} namespaces\n  * @api public\n  */\n\n\n  function enable(namespaces) {\n    createDebug.save(namespaces);\n    createDebug.names = [];\n    createDebug.skips = [];\n    var i;\n    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n    var len = split.length;\n\n    for (i = 0; i < len; i++) {\n      if (!split[i]) {\n        // ignore empty strings\n        continue;\n      }\n\n      namespaces = split[i].replace(/\\*/g, '.*?');\n\n      if (namespaces[0] === '-') {\n        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n      } else {\n        createDebug.names.push(new RegExp('^' + namespaces + '$'));\n      }\n    }\n\n    for (i = 0; i < createDebug.instances.length; i++) {\n      var instance = createDebug.instances[i];\n      instance.enabled = createDebug.enabled(instance.namespace);\n    }\n  }\n  /**\n  * Disable debug output.\n  *\n  * @api public\n  */\n\n\n  function disable() {\n    createDebug.enable('');\n  }\n  /**\n  * Returns true if the given mode name is enabled, false otherwise.\n  *\n  * @param {String} name\n  * @return {Boolean}\n  * @api public\n  */\n\n\n  function enabled(name) {\n    if (name[name.length - 1] === '*') {\n      return true;\n    }\n\n    var i;\n    var len;\n\n    for (i = 0, len = createDebug.skips.length; i < len; i++) {\n      if (createDebug.skips[i].test(name)) {\n        return false;\n      }\n    }\n\n    for (i = 0, len = createDebug.names.length; i < len; i++) {\n      if (createDebug.names[i].test(name)) {\n        return true;\n      }\n    }\n\n    return false;\n  }\n  /**\n  * Coerce `val`.\n  *\n  * @param {Mixed} val\n  * @return {Mixed}\n  * @api private\n  */\n\n\n  function coerce(val) {\n    if (val instanceof Error) {\n      return val.stack || val.message;\n    }\n\n    return val;\n  }\n\n  createDebug.enable(createDebug.load());\n  return createDebug;\n}\n\nmodule.exports = setup;\n\n\n},{\"ms\":54}],57:[function(require,module,exports){\nif (typeof Object.create === 'function') {\n  // implementation from standard node.js 'util' module\n  module.exports = function inherits(ctor, superCtor) {\n    if (superCtor) {\n      ctor.super_ = superCtor\n      ctor.prototype = Object.create(superCtor.prototype, {\n        constructor: {\n          value: ctor,\n          enumerable: false,\n          writable: true,\n          configurable: true\n        }\n      })\n    }\n  };\n} else {\n  // old school shim for old browsers\n  module.exports = function inherits(ctor, superCtor) {\n    if (superCtor) {\n      ctor.super_ = superCtor\n      var TempCtor = function () {}\n      TempCtor.prototype = superCtor.prototype\n      ctor.prototype = new TempCtor()\n      ctor.prototype.constructor = ctor\n    }\n  }\n}\n\n},{}],58:[function(require,module,exports){\n(function (global){\n/*! JSON v3.3.2 | https://bestiejs.github.io/json3 | Copyright 2012-2015, Kit Cambridge, Benjamin Tan | http://kit.mit-license.org */\n;(function () {\n  // Detect the `define` function exposed by asynchronous module loaders. The\n  // strict `define` check is necessary for compatibility with `r.js`.\n  var isLoader = typeof define === \"function\" && define.amd;\n\n  // A set of types used to distinguish objects from primitives.\n  var objectTypes = {\n    \"function\": true,\n    \"object\": true\n  };\n\n  // Detect the `exports` object exposed by CommonJS implementations.\n  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;\n\n  // Use the `global` object exposed by Node (including Browserify via\n  // `insert-module-globals`), Narwhal, and Ringo as the default context,\n  // and the `window` object in browsers. Rhino exports a `global` function\n  // instead.\n  var root = objectTypes[typeof window] && window || this,\n      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == \"object\" && global;\n\n  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {\n    root = freeGlobal;\n  }\n\n  // Public: Initializes JSON 3 using the given `context` object, attaching the\n  // `stringify` and `parse` functions to the specified `exports` object.\n  function runInContext(context, exports) {\n    context || (context = root.Object());\n    exports || (exports = root.Object());\n\n    // Native constructor aliases.\n    var Number = context.Number || root.Number,\n        String = context.String || root.String,\n        Object = context.Object || root.Object,\n        Date = context.Date || root.Date,\n        SyntaxError = context.SyntaxError || root.SyntaxError,\n        TypeError = context.TypeError || root.TypeError,\n        Math = context.Math || root.Math,\n        nativeJSON = context.JSON || root.JSON;\n\n    // Delegate to the native `stringify` and `parse` implementations.\n    if (typeof nativeJSON == \"object\" && nativeJSON) {\n      exports.stringify = nativeJSON.stringify;\n      exports.parse = nativeJSON.parse;\n    }\n\n    // Convenience aliases.\n    var objectProto = Object.prototype,\n        getClass = objectProto.toString,\n        isProperty = objectProto.hasOwnProperty,\n        undefined;\n\n    // Internal: Contains `try...catch` logic used by other functions.\n    // This prevents other functions from being deoptimized.\n    function attempt(func, errorFunc) {\n      try {\n        func();\n      } catch (exception) {\n        if (errorFunc) {\n          errorFunc();\n        }\n      }\n    }\n\n    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.\n    var isExtended = new Date(-3509827334573292);\n    attempt(function () {\n      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical\n      // results for certain dates in Opera >= 10.53.\n      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&\n        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;\n    });\n\n    // Internal: Determines whether the native `JSON.stringify` and `parse`\n    // implementations are spec-compliant. Based on work by Ken Snyder.\n    function has(name) {\n      if (has[name] != null) {\n        // Return cached feature test result.\n        return has[name];\n      }\n      var isSupported;\n      if (name == \"bug-string-char-index\") {\n        // IE <= 7 doesn't support accessing string characters using square\n        // bracket notation. IE 8 only supports this for primitives.\n        isSupported = \"a\"[0] != \"a\";\n      } else if (name == \"json\") {\n        // Indicates whether both `JSON.stringify` and `JSON.parse` are\n        // supported.\n        isSupported = has(\"json-stringify\") && has(\"date-serialization\") && has(\"json-parse\");\n      } else if (name == \"date-serialization\") {\n        // Indicates whether `Date`s can be serialized accurately by `JSON.stringify`.\n        isSupported = has(\"json-stringify\") && isExtended;\n        if (isSupported) {\n          var stringify = exports.stringify;\n          attempt(function () {\n            isSupported =\n              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly\n              // serialize extended years.\n              stringify(new Date(-8.64e15)) == '\"-271821-04-20T00:00:00.000Z\"' &&\n              // The milliseconds are optional in ES 5, but required in 5.1.\n              stringify(new Date(8.64e15)) == '\"+275760-09-13T00:00:00.000Z\"' &&\n              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative\n              // four-digit years instead of six-digit years. Credits: @Yaffle.\n              stringify(new Date(-621987552e5)) == '\"-000001-01-01T00:00:00.000Z\"' &&\n              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond\n              // values less than 1000. Credits: @Yaffle.\n              stringify(new Date(-1)) == '\"1969-12-31T23:59:59.999Z\"';\n          });\n        }\n      } else {\n        var value, serialized = '{\"a\":[1,true,false,null,\"\\\\u0000\\\\b\\\\n\\\\f\\\\r\\\\t\"]}';\n        // Test `JSON.stringify`.\n        if (name == \"json-stringify\") {\n          var stringify = exports.stringify, stringifySupported = typeof stringify == \"function\";\n          if (stringifySupported) {\n            // A test function object with a custom `toJSON` method.\n            (value = function () {\n              return 1;\n            }).toJSON = value;\n            attempt(function () {\n              stringifySupported =\n                // Firefox 3.1b1 and b2 serialize string, number, and boolean\n                // primitives as object literals.\n                stringify(0) === \"0\" &&\n                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object\n                // literals.\n                stringify(new Number()) === \"0\" &&\n                stringify(new String()) == '\"\"' &&\n                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or\n                // does not define a canonical JSON representation (this applies to\n                // objects with `toJSON` properties as well, *unless* they are nested\n                // within an object or array).\n                stringify(getClass) === undefined &&\n                // IE 8 serializes `undefined` as `\"undefined\"`. Safari <= 5.1.7 and\n                // FF 3.1b3 pass this test.\n                stringify(undefined) === undefined &&\n                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,\n                // respectively, if the value is omitted entirely.\n                stringify() === undefined &&\n                // FF 3.1b1, 2 throw an error if the given value is not a number,\n                // string, array, object, Boolean, or `null` literal. This applies to\n                // objects with custom `toJSON` methods as well, unless they are nested\n                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`\n                // methods entirely.\n                stringify(value) === \"1\" &&\n                stringify([value]) == \"[1]\" &&\n                // Prototype <= 1.6.1 serializes `[undefined]` as `\"[]\"` instead of\n                // `\"[null]\"`.\n                stringify([undefined]) == \"[null]\" &&\n                // YUI 3.0.0b1 fails to serialize `null` literals.\n                stringify(null) == \"null\" &&\n                // FF 3.1b1, 2 halts serialization if an array contains a function:\n                // `[1, true, getClass, 1]` serializes as \"[1,true,],\". FF 3.1b3\n                // elides non-JSON values from objects and arrays, unless they\n                // define custom `toJSON` methods.\n                stringify([undefined, getClass, null]) == \"[null,null,null]\" &&\n                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences\n                // where character escape codes are expected (e.g., `\\b` => `\\u0008`).\n                stringify({ \"a\": [value, true, false, null, \"\\x00\\b\\n\\f\\r\\t\"] }) == serialized &&\n                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.\n                stringify(null, value) === \"1\" &&\n                stringify([1, 2], null, 1) == \"[\\n 1,\\n 2\\n]\";\n            }, function () {\n              stringifySupported = false;\n            });\n          }\n          isSupported = stringifySupported;\n        }\n        // Test `JSON.parse`.\n        if (name == \"json-parse\") {\n          var parse = exports.parse, parseSupported;\n          if (typeof parse == \"function\") {\n            attempt(function () {\n              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.\n              // Conforming implementations should also coerce the initial argument to\n              // a string prior to parsing.\n              if (parse(\"0\") === 0 && !parse(false)) {\n                // Simple parsing test.\n                value = parse(serialized);\n                parseSupported = value[\"a\"].length == 5 && value[\"a\"][0] === 1;\n                if (parseSupported) {\n                  attempt(function () {\n                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.\n                    parseSupported = !parse('\"\\t\"');\n                  });\n                  if (parseSupported) {\n                    attempt(function () {\n                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading\n                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow\n                      // certain octal literals.\n                      parseSupported = parse(\"01\") !== 1;\n                    });\n                  }\n                  if (parseSupported) {\n                    attempt(function () {\n                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal\n                      // points. These environments, along with FF 3.1b1 and 2,\n                      // also allow trailing commas in JSON objects and arrays.\n                      parseSupported = parse(\"1.\") !== 1;\n                    });\n                  }\n                }\n              }\n            }, function () {\n              parseSupported = false;\n            });\n          }\n          isSupported = parseSupported;\n        }\n      }\n      return has[name] = !!isSupported;\n    }\n    has[\"bug-string-char-index\"] = has[\"date-serialization\"] = has[\"json\"] = has[\"json-stringify\"] = has[\"json-parse\"] = null;\n\n    if (!has(\"json\")) {\n      // Common `[[Class]]` name aliases.\n      var functionClass = \"[object Function]\",\n          dateClass = \"[object Date]\",\n          numberClass = \"[object Number]\",\n          stringClass = \"[object String]\",\n          arrayClass = \"[object Array]\",\n          booleanClass = \"[object Boolean]\";\n\n      // Detect incomplete support for accessing string characters by index.\n      var charIndexBuggy = has(\"bug-string-char-index\");\n\n      // Internal: Normalizes the `for...in` iteration algorithm across\n      // environments. Each enumerated key is yielded to a `callback` function.\n      var forOwn = function (object, callback) {\n        var size = 0, Properties, dontEnums, property;\n\n        // Tests for bugs in the current environment's `for...in` algorithm. The\n        // `valueOf` property inherits the non-enumerable flag from\n        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.\n        (Properties = function () {\n          this.valueOf = 0;\n        }).prototype.valueOf = 0;\n\n        // Iterate over a new instance of the `Properties` class.\n        dontEnums = new Properties();\n        for (property in dontEnums) {\n          // Ignore all properties inherited from `Object.prototype`.\n          if (isProperty.call(dontEnums, property)) {\n            size++;\n          }\n        }\n        Properties = dontEnums = null;\n\n        // Normalize the iteration algorithm.\n        if (!size) {\n          // A list of non-enumerable properties inherited from `Object.prototype`.\n          dontEnums = [\"valueOf\", \"toString\", \"toLocaleString\", \"propertyIsEnumerable\", \"isPrototypeOf\", \"hasOwnProperty\", \"constructor\"];\n          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable\n          // properties.\n          forOwn = function (object, callback) {\n            var isFunction = getClass.call(object) == functionClass, property, length;\n            var hasProperty = !isFunction && typeof object.constructor != \"function\" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;\n            for (property in object) {\n              // Gecko <= 1.0 enumerates the `prototype` property of functions under\n              // certain conditions; IE does not.\n              if (!(isFunction && property == \"prototype\") && hasProperty.call(object, property)) {\n                callback(property);\n              }\n            }\n            // Manually invoke the callback for each non-enumerable property.\n            for (length = dontEnums.length; property = dontEnums[--length];) {\n              if (hasProperty.call(object, property)) {\n                callback(property);\n              }\n            }\n          };\n        } else {\n          // No bugs detected; use the standard `for...in` algorithm.\n          forOwn = function (object, callback) {\n            var isFunction = getClass.call(object) == functionClass, property, isConstructor;\n            for (property in object) {\n              if (!(isFunction && property == \"prototype\") && isProperty.call(object, property) && !(isConstructor = property === \"constructor\")) {\n                callback(property);\n              }\n            }\n            // Manually invoke the callback for the `constructor` property due to\n            // cross-environment inconsistencies.\n            if (isConstructor || isProperty.call(object, (property = \"constructor\"))) {\n              callback(property);\n            }\n          };\n        }\n        return forOwn(object, callback);\n      };\n\n      // Public: Serializes a JavaScript `value` as a JSON string. The optional\n      // `filter` argument may specify either a function that alters how object and\n      // array members are serialized, or an array of strings and numbers that\n      // indicates which properties should be serialized. The optional `width`\n      // argument may be either a string or number that specifies the indentation\n      // level of the output.\n      if (!has(\"json-stringify\") && !has(\"date-serialization\")) {\n        // Internal: A map of control characters and their escaped equivalents.\n        var Escapes = {\n          92: \"\\\\\\\\\",\n          34: '\\\\\"',\n          8: \"\\\\b\",\n          12: \"\\\\f\",\n          10: \"\\\\n\",\n          13: \"\\\\r\",\n          9: \"\\\\t\"\n        };\n\n        // Internal: Converts `value` into a zero-padded string such that its\n        // length is at least equal to `width`. The `width` must be <= 6.\n        var leadingZeroes = \"000000\";\n        var toPaddedString = function (width, value) {\n          // The `|| 0` expression is necessary to work around a bug in\n          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== \"0\"`.\n          return (leadingZeroes + (value || 0)).slice(-width);\n        };\n\n        // Internal: Serializes a date object.\n        var serializeDate = function (value) {\n          var getData, year, month, date, time, hours, minutes, seconds, milliseconds;\n          // Define additional utility methods if the `Date` methods are buggy.\n          if (!isExtended) {\n            var floor = Math.floor;\n            // A mapping between the months of the year and the number of days between\n            // January 1st and the first of the respective month.\n            var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];\n            // Internal: Calculates the number of days between the Unix epoch and the\n            // first day of the given month.\n            var getDay = function (year, month) {\n              return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);\n            };\n            getData = function (value) {\n              // Manually compute the year, month, date, hours, minutes,\n              // seconds, and milliseconds if the `getUTC*` methods are\n              // buggy. Adapted from @Yaffle's `date-shim` project.\n              date = floor(value / 864e5);\n              for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);\n              for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);\n              date = 1 + date - getDay(year, month);\n              // The `time` value specifies the time within the day (see ES\n              // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used\n              // to compute `A modulo B`, as the `%` operator does not\n              // correspond to the `modulo` operation for negative numbers.\n              time = (value % 864e5 + 864e5) % 864e5;\n              // The hours, minutes, seconds, and milliseconds are obtained by\n              // decomposing the time within the day. See section 15.9.1.10.\n              hours = floor(time / 36e5) % 24;\n              minutes = floor(time / 6e4) % 60;\n              seconds = floor(time / 1e3) % 60;\n              milliseconds = time % 1e3;\n            };\n          } else {\n            getData = function (value) {\n              year = value.getUTCFullYear();\n              month = value.getUTCMonth();\n              date = value.getUTCDate();\n              hours = value.getUTCHours();\n              minutes = value.getUTCMinutes();\n              seconds = value.getUTCSeconds();\n              milliseconds = value.getUTCMilliseconds();\n            };\n          }\n          serializeDate = function (value) {\n            if (value > -1 / 0 && value < 1 / 0) {\n              // Dates are serialized according to the `Date#toJSON` method\n              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15\n              // for the ISO 8601 date time string format.\n              getData(value);\n              // Serialize extended years correctly.\n              value = (year <= 0 || year >= 1e4 ? (year < 0 ? \"-\" : \"+\") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +\n              \"-\" + toPaddedString(2, month + 1) + \"-\" + toPaddedString(2, date) +\n              // Months, dates, hours, minutes, and seconds should have two\n              // digits; milliseconds should have three.\n              \"T\" + toPaddedString(2, hours) + \":\" + toPaddedString(2, minutes) + \":\" + toPaddedString(2, seconds) +\n              // Milliseconds are optional in ES 5.0, but required in 5.1.\n              \".\" + toPaddedString(3, milliseconds) + \"Z\";\n              year = month = date = hours = minutes = seconds = milliseconds = null;\n            } else {\n              value = null;\n            }\n            return value;\n          };\n          return serializeDate(value);\n        };\n\n        // For environments with `JSON.stringify` but buggy date serialization,\n        // we override the native `Date#toJSON` implementation with a\n        // spec-compliant one.\n        if (has(\"json-stringify\") && !has(\"date-serialization\")) {\n          // Internal: the `Date#toJSON` implementation used to override the native one.\n          function dateToJSON (key) {\n            return serializeDate(this);\n          }\n\n          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.\n          var nativeStringify = exports.stringify;\n          exports.stringify = function (source, filter, width) {\n            var nativeToJSON = Date.prototype.toJSON;\n            Date.prototype.toJSON = dateToJSON;\n            var result = nativeStringify(source, filter, width);\n            Date.prototype.toJSON = nativeToJSON;\n            return result;\n          }\n        } else {\n          // Internal: Double-quotes a string `value`, replacing all ASCII control\n          // characters (characters with code unit values between 0 and 31) with\n          // their escaped equivalents. This is an implementation of the\n          // `Quote(value)` operation defined in ES 5.1 section 15.12.3.\n          var unicodePrefix = \"\\\\u00\";\n          var escapeChar = function (character) {\n            var charCode = character.charCodeAt(0), escaped = Escapes[charCode];\n            if (escaped) {\n              return escaped;\n            }\n            return unicodePrefix + toPaddedString(2, charCode.toString(16));\n          };\n          var reEscape = /[\\x00-\\x1f\\x22\\x5c]/g;\n          var quote = function (value) {\n            reEscape.lastIndex = 0;\n            return '\"' +\n              (\n                reEscape.test(value)\n                  ? value.replace(reEscape, escapeChar)\n                  : value\n              ) +\n              '\"';\n          };\n\n          // Internal: Recursively serializes an object. Implements the\n          // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.\n          var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {\n            var value, type, className, results, element, index, length, prefix, result;\n            attempt(function () {\n              // Necessary for host object support.\n              value = object[property];\n            });\n            if (typeof value == \"object\" && value) {\n              if (value.getUTCFullYear && getClass.call(value) == dateClass && value.toJSON === Date.prototype.toJSON) {\n                value = serializeDate(value);\n              } else if (typeof value.toJSON == \"function\") {\n                value = value.toJSON(property);\n              }\n            }\n            if (callback) {\n              // If a replacement function was provided, call it to obtain the value\n              // for serialization.\n              value = callback.call(object, property, value);\n            }\n            // Exit early if value is `undefined` or `null`.\n            if (value == undefined) {\n              return value === undefined ? value : \"null\";\n            }\n            type = typeof value;\n            // Only call `getClass` if the value is an object.\n            if (type == \"object\") {\n              className = getClass.call(value);\n            }\n            switch (className || type) {\n              case \"boolean\":\n              case booleanClass:\n                // Booleans are represented literally.\n                return \"\" + value;\n              case \"number\":\n              case numberClass:\n                // JSON numbers must be finite. `Infinity` and `NaN` are serialized as\n                // `\"null\"`.\n                return value > -1 / 0 && value < 1 / 0 ? \"\" + value : \"null\";\n              case \"string\":\n              case stringClass:\n                // Strings are double-quoted and escaped.\n                return quote(\"\" + value);\n            }\n            // Recursively serialize objects and arrays.\n            if (typeof value == \"object\") {\n              // Check for cyclic structures. This is a linear search; performance\n              // is inversely proportional to the number of unique nested objects.\n              for (length = stack.length; length--;) {\n                if (stack[length] === value) {\n                  // Cyclic structures cannot be serialized by `JSON.stringify`.\n                  throw TypeError();\n                }\n              }\n              // Add the object to the stack of traversed objects.\n              stack.push(value);\n              results = [];\n              // Save the current indentation level and indent one additional level.\n              prefix = indentation;\n              indentation += whitespace;\n              if (className == arrayClass) {\n                // Recursively serialize array elements.\n                for (index = 0, length = value.length; index < length; index++) {\n                  element = serialize(index, value, callback, properties, whitespace, indentation, stack);\n                  results.push(element === undefined ? \"null\" : element);\n                }\n                result = results.length ? (whitespace ? \"[\\n\" + indentation + results.join(\",\\n\" + indentation) + \"\\n\" + prefix + \"]\" : (\"[\" + results.join(\",\") + \"]\")) : \"[]\";\n              } else {\n                // Recursively serialize object members. Members are selected from\n                // either a user-specified list of property names, or the object\n                // itself.\n                forOwn(properties || value, function (property) {\n                  var element = serialize(property, value, callback, properties, whitespace, indentation, stack);\n                  if (element !== undefined) {\n                    // According to ES 5.1 section 15.12.3: \"If `gap` {whitespace}\n                    // is not the empty string, let `member` {quote(property) + \":\"}\n                    // be the concatenation of `member` and the `space` character.\"\n                    // The \"`space` character\" refers to the literal space\n                    // character, not the `space` {width} argument provided to\n                    // `JSON.stringify`.\n                    results.push(quote(property) + \":\" + (whitespace ? \" \" : \"\") + element);\n                  }\n                });\n                result = results.length ? (whitespace ? \"{\\n\" + indentation + results.join(\",\\n\" + indentation) + \"\\n\" + prefix + \"}\" : (\"{\" + results.join(\",\") + \"}\")) : \"{}\";\n              }\n              // Remove the object from the traversed object stack.\n              stack.pop();\n              return result;\n            }\n          };\n\n          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.\n          exports.stringify = function (source, filter, width) {\n            var whitespace, callback, properties, className;\n            if (objectTypes[typeof filter] && filter) {\n              className = getClass.call(filter);\n              if (className == functionClass) {\n                callback = filter;\n              } else if (className == arrayClass) {\n                // Convert the property names array into a makeshift set.\n                properties = {};\n                for (var index = 0, length = filter.length, value; index < length;) {\n                  value = filter[index++];\n                  className = getClass.call(value);\n                  if (className == \"[object String]\" || className == \"[object Number]\") {\n                    properties[value] = 1;\n                  }\n                }\n              }\n            }\n            if (width) {\n              className = getClass.call(width);\n              if (className == numberClass) {\n                // Convert the `width` to an integer and create a string containing\n                // `width` number of space characters.\n                if ((width -= width % 1) > 0) {\n                  if (width > 10) {\n                    width = 10;\n                  }\n                  for (whitespace = \"\"; whitespace.length < width;) {\n                    whitespace += \" \";\n                  }\n                }\n              } else if (className == stringClass) {\n                whitespace = width.length <= 10 ? width : width.slice(0, 10);\n              }\n            }\n            // Opera <= 7.54u2 discards the values associated with empty string keys\n            // (`\"\"`) only if they are used directly within an object member list\n            // (e.g., `!(\"\" in { \"\": 1})`).\n            return serialize(\"\", (value = {}, value[\"\"] = source, value), callback, properties, whitespace, \"\", []);\n          };\n        }\n      }\n\n      // Public: Parses a JSON source string.\n      if (!has(\"json-parse\")) {\n        var fromCharCode = String.fromCharCode;\n\n        // Internal: A map of escaped control characters and their unescaped\n        // equivalents.\n        var Unescapes = {\n          92: \"\\\\\",\n          34: '\"',\n          47: \"/\",\n          98: \"\\b\",\n          116: \"\\t\",\n          110: \"\\n\",\n          102: \"\\f\",\n          114: \"\\r\"\n        };\n\n        // Internal: Stores the parser state.\n        var Index, Source;\n\n        // Internal: Resets the parser state and throws a `SyntaxError`.\n        var abort = function () {\n          Index = Source = null;\n          throw SyntaxError();\n        };\n\n        // Internal: Returns the next token, or `\"$\"` if the parser has reached\n        // the end of the source string. A token may be a string, number, `null`\n        // literal, or Boolean literal.\n        var lex = function () {\n          var source = Source, length = source.length, value, begin, position, isSigned, charCode;\n          while (Index < length) {\n            charCode = source.charCodeAt(Index);\n            switch (charCode) {\n              case 9: case 10: case 13: case 32:\n                // Skip whitespace tokens, including tabs, carriage returns, line\n                // feeds, and space characters.\n                Index++;\n                break;\n              case 123: case 125: case 91: case 93: case 58: case 44:\n                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at\n                // the current position.\n                value = charIndexBuggy ? source.charAt(Index) : source[Index];\n                Index++;\n                return value;\n              case 34:\n                // `\"` delimits a JSON string; advance to the next character and\n                // begin parsing the string. String tokens are prefixed with the\n                // sentinel `@` character to distinguish them from punctuators and\n                // end-of-string tokens.\n                for (value = \"@\", Index++; Index < length;) {\n                  charCode = source.charCodeAt(Index);\n                  if (charCode < 32) {\n                    // Unescaped ASCII control characters (those with a code unit\n                    // less than the space character) are not permitted.\n                    abort();\n                  } else if (charCode == 92) {\n                    // A reverse solidus (`\\`) marks the beginning of an escaped\n                    // control character (including `\"`, `\\`, and `/`) or Unicode\n                    // escape sequence.\n                    charCode = source.charCodeAt(++Index);\n                    switch (charCode) {\n                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:\n                        // Revive escaped control characters.\n                        value += Unescapes[charCode];\n                        Index++;\n                        break;\n                      case 117:\n                        // `\\u` marks the beginning of a Unicode escape sequence.\n                        // Advance to the first character and validate the\n                        // four-digit code point.\n                        begin = ++Index;\n                        for (position = Index + 4; Index < position; Index++) {\n                          charCode = source.charCodeAt(Index);\n                          // A valid sequence comprises four hexdigits (case-\n                          // insensitive) that form a single hexadecimal value.\n                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {\n                            // Invalid Unicode escape sequence.\n                            abort();\n                          }\n                        }\n                        // Revive the escaped character.\n                        value += fromCharCode(\"0x\" + source.slice(begin, Index));\n                        break;\n                      default:\n                        // Invalid escape sequence.\n                        abort();\n                    }\n                  } else {\n                    if (charCode == 34) {\n                      // An unescaped double-quote character marks the end of the\n                      // string.\n                      break;\n                    }\n                    charCode = source.charCodeAt(Index);\n                    begin = Index;\n                    // Optimize for the common case where a string is valid.\n                    while (charCode >= 32 && charCode != 92 && charCode != 34) {\n                      charCode = source.charCodeAt(++Index);\n                    }\n                    // Append the string as-is.\n                    value += source.slice(begin, Index);\n                  }\n                }\n                if (source.charCodeAt(Index) == 34) {\n                  // Advance to the next character and return the revived string.\n                  Index++;\n                  return value;\n                }\n                // Unterminated string.\n                abort();\n              default:\n                // Parse numbers and literals.\n                begin = Index;\n                // Advance past the negative sign, if one is specified.\n                if (charCode == 45) {\n                  isSigned = true;\n                  charCode = source.charCodeAt(++Index);\n                }\n                // Parse an integer or floating-point value.\n                if (charCode >= 48 && charCode <= 57) {\n                  // Leading zeroes are interpreted as octal literals.\n                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {\n                    // Illegal octal literal.\n                    abort();\n                  }\n                  isSigned = false;\n                  // Parse the integer component.\n                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);\n                  // Floats cannot contain a leading decimal point; however, this\n                  // case is already accounted for by the parser.\n                  if (source.charCodeAt(Index) == 46) {\n                    position = ++Index;\n                    // Parse the decimal component.\n                    for (; position < length; position++) {\n                      charCode = source.charCodeAt(position);\n                      if (charCode < 48 || charCode > 57) {\n                        break;\n                      }\n                    }\n                    if (position == Index) {\n                      // Illegal trailing decimal.\n                      abort();\n                    }\n                    Index = position;\n                  }\n                  // Parse exponents. The `e` denoting the exponent is\n                  // case-insensitive.\n                  charCode = source.charCodeAt(Index);\n                  if (charCode == 101 || charCode == 69) {\n                    charCode = source.charCodeAt(++Index);\n                    // Skip past the sign following the exponent, if one is\n                    // specified.\n                    if (charCode == 43 || charCode == 45) {\n                      Index++;\n                    }\n                    // Parse the exponential component.\n                    for (position = Index; position < length; position++) {\n                      charCode = source.charCodeAt(position);\n                      if (charCode < 48 || charCode > 57) {\n                        break;\n                      }\n                    }\n                    if (position == Index) {\n                      // Illegal empty exponent.\n                      abort();\n                    }\n                    Index = position;\n                  }\n                  // Coerce the parsed value to a JavaScript number.\n                  return +source.slice(begin, Index);\n                }\n                // A negative sign may only precede numbers.\n                if (isSigned) {\n                  abort();\n                }\n                // `true`, `false`, and `null` literals.\n                var temp = source.slice(Index, Index + 4);\n                if (temp == \"true\") {\n                  Index += 4;\n                  return true;\n                } else if (temp == \"fals\" && source.charCodeAt(Index + 4 ) == 101) {\n                  Index += 5;\n                  return false;\n                } else if (temp == \"null\") {\n                  Index += 4;\n                  return null;\n                }\n                // Unrecognized token.\n                abort();\n            }\n          }\n          // Return the sentinel `$` character if the parser has reached the end\n          // of the source string.\n          return \"$\";\n        };\n\n        // Internal: Parses a JSON `value` token.\n        var get = function (value) {\n          var results, hasMembers;\n          if (value == \"$\") {\n            // Unexpected end of input.\n            abort();\n          }\n          if (typeof value == \"string\") {\n            if ((charIndexBuggy ? value.charAt(0) : value[0]) == \"@\") {\n              // Remove the sentinel `@` character.\n              return value.slice(1);\n            }\n            // Parse object and array literals.\n            if (value == \"[\") {\n              // Parses a JSON array, returning a new JavaScript array.\n              results = [];\n              for (;;) {\n                value = lex();\n                // A closing square bracket marks the end of the array literal.\n                if (value == \"]\") {\n                  break;\n                }\n                // If the array literal contains elements, the current token\n                // should be a comma separating the previous element from the\n                // next.\n                if (hasMembers) {\n                  if (value == \",\") {\n                    value = lex();\n                    if (value == \"]\") {\n                      // Unexpected trailing `,` in array literal.\n                      abort();\n                    }\n                  } else {\n                    // A `,` must separate each array element.\n                    abort();\n                  }\n                } else {\n                  hasMembers = true;\n                }\n                // Elisions and leading commas are not permitted.\n                if (value == \",\") {\n                  abort();\n                }\n                results.push(get(value));\n              }\n              return results;\n            } else if (value == \"{\") {\n              // Parses a JSON object, returning a new JavaScript object.\n              results = {};\n              for (;;) {\n                value = lex();\n                // A closing curly brace marks the end of the object literal.\n                if (value == \"}\") {\n                  break;\n                }\n                // If the object literal contains members, the current token\n                // should be a comma separator.\n                if (hasMembers) {\n                  if (value == \",\") {\n                    value = lex();\n                    if (value == \"}\") {\n                      // Unexpected trailing `,` in object literal.\n                      abort();\n                    }\n                  } else {\n                    // A `,` must separate each object member.\n                    abort();\n                  }\n                } else {\n                  hasMembers = true;\n                }\n                // Leading commas are not permitted, object property names must be\n                // double-quoted strings, and a `:` must separate each property\n                // name and value.\n                if (value == \",\" || typeof value != \"string\" || (charIndexBuggy ? value.charAt(0) : value[0]) != \"@\" || lex() != \":\") {\n                  abort();\n                }\n                results[value.slice(1)] = get(lex());\n              }\n              return results;\n            }\n            // Unexpected token encountered.\n            abort();\n          }\n          return value;\n        };\n\n        // Internal: Updates a traversed object member.\n        var update = function (source, property, callback) {\n          var element = walk(source, property, callback);\n          if (element === undefined) {\n            delete source[property];\n          } else {\n            source[property] = element;\n          }\n        };\n\n        // Internal: Recursively traverses a parsed JSON object, invoking the\n        // `callback` function for each value. This is an implementation of the\n        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.\n        var walk = function (source, property, callback) {\n          var value = source[property], length;\n          if (typeof value == \"object\" && value) {\n            // `forOwn` can't be used to traverse an array in Opera <= 8.54\n            // because its `Object#hasOwnProperty` implementation returns `false`\n            // for array indices (e.g., `![1, 2, 3].hasOwnProperty(\"0\")`).\n            if (getClass.call(value) == arrayClass) {\n              for (length = value.length; length--;) {\n                update(getClass, forOwn, value, length, callback);\n              }\n            } else {\n              forOwn(value, function (property) {\n                update(value, property, callback);\n              });\n            }\n          }\n          return callback.call(source, property, value);\n        };\n\n        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.\n        exports.parse = function (source, callback) {\n          var result, value;\n          Index = 0;\n          Source = \"\" + source;\n          result = get(lex());\n          // If a JSON string contains multiple tokens, it is invalid.\n          if (lex() != \"$\") {\n            abort();\n          }\n          // Reset the parser state.\n          Index = Source = null;\n          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[\"\"] = result, value), \"\", callback) : result;\n        };\n      }\n    }\n\n    exports.runInContext = runInContext;\n    return exports;\n  }\n\n  if (freeExports && !isLoader) {\n    // Export for CommonJS environments.\n    runInContext(root, freeExports);\n  } else {\n    // Export for web browsers and JavaScript engines.\n    var nativeJSON = root.JSON,\n        previousJSON = root.JSON3,\n        isRestored = false;\n\n    var JSON3 = runInContext(root, (root.JSON3 = {\n      // Public: Restores the original value of the global `JSON` object and\n      // returns a reference to the `JSON3` object.\n      \"noConflict\": function () {\n        if (!isRestored) {\n          isRestored = true;\n          root.JSON = nativeJSON;\n          root.JSON3 = previousJSON;\n          nativeJSON = previousJSON = null;\n        }\n        return JSON3;\n      }\n    }));\n\n    root.JSON = {\n      \"parse\": JSON3.parse,\n      \"stringify\": JSON3.stringify\n    };\n  }\n\n  // Export for asynchronous module loaders.\n  if (isLoader) {\n    define(function () {\n      return JSON3;\n    });\n  }\n}).call(this);\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{}],59:[function(require,module,exports){\n'use strict';\n\nvar has = Object.prototype.hasOwnProperty\n  , undef;\n\n/**\n * Decode a URI encoded string.\n *\n * @param {String} input The URI encoded string.\n * @returns {String|Null} The decoded string.\n * @api private\n */\nfunction decode(input) {\n  try {\n    return decodeURIComponent(input.replace(/\\+/g, ' '));\n  } catch (e) {\n    return null;\n  }\n}\n\n/**\n * Attempts to encode a given input.\n *\n * @param {String} input The string that needs to be encoded.\n * @returns {String|Null} The encoded string.\n * @api private\n */\nfunction encode(input) {\n  try {\n    return encodeURIComponent(input);\n  } catch (e) {\n    return null;\n  }\n}\n\n/**\n * Simple query string parser.\n *\n * @param {String} query The query string that needs to be parsed.\n * @returns {Object}\n * @api public\n */\nfunction querystring(query) {\n  var parser = /([^=?&]+)=?([^&]*)/g\n    , result = {}\n    , part;\n\n  while (part = parser.exec(query)) {\n    var key = decode(part[1])\n      , value = decode(part[2]);\n\n    //\n    // Prevent overriding of existing properties. This ensures that build-in\n    // methods like `toString` or __proto__ are not overriden by malicious\n    // querystrings.\n    //\n    // In the case if failed decoding, we want to omit the key/value pairs\n    // from the result.\n    //\n    if (key === null || value === null || key in result) continue;\n    result[key] = value;\n  }\n\n  return result;\n}\n\n/**\n * Transform a query string to an object.\n *\n * @param {Object} obj Object that should be transformed.\n * @param {String} prefix Optional prefix.\n * @returns {String}\n * @api public\n */\nfunction querystringify(obj, prefix) {\n  prefix = prefix || '';\n\n  var pairs = []\n    , value\n    , key;\n\n  //\n  // Optionally prefix with a '?' if needed\n  //\n  if ('string' !== typeof prefix) prefix = '?';\n\n  for (key in obj) {\n    if (has.call(obj, key)) {\n      value = obj[key];\n\n      //\n      // Edge cases where we actually want to encode the value to an empty\n      // string instead of the stringified value.\n      //\n      if (!value && (value === null || value === undef || isNaN(value))) {\n        value = '';\n      }\n\n      key = encodeURIComponent(key);\n      value = encodeURIComponent(value);\n\n      //\n      // If we failed to encode the strings, we should bail out as we don't\n      // want to add invalid strings to the query.\n      //\n      if (key === null || value === null) continue;\n      pairs.push(key +'='+ value);\n    }\n  }\n\n  return pairs.length ? prefix + pairs.join('&') : '';\n}\n\n//\n// Expose the module.\n//\nexports.stringify = querystringify;\nexports.parse = querystring;\n\n},{}],60:[function(require,module,exports){\n'use strict';\n\n/**\n * Check if we're required to add a port number.\n *\n * @see https://url.spec.whatwg.org/#default-port\n * @param {Number|String} port Port number we need to check\n * @param {String} protocol Protocol we need to check against.\n * @returns {Boolean} Is it a default port for the given protocol\n * @api private\n */\nmodule.exports = function required(port, protocol) {\n  protocol = protocol.split(':')[0];\n  port = +port;\n\n  if (!port) return false;\n\n  switch (protocol) {\n    case 'http':\n    case 'ws':\n    return port !== 80;\n\n    case 'https':\n    case 'wss':\n    return port !== 443;\n\n    case 'ftp':\n    return port !== 21;\n\n    case 'gopher':\n    return port !== 70;\n\n    case 'file':\n    return false;\n  }\n\n  return port !== 0;\n};\n\n},{}],61:[function(require,module,exports){\n(function (global){\n'use strict';\n\nvar required = require('requires-port')\n  , qs = require('querystringify')\n  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:[\\\\/]+/\n  , protocolre = /^([a-z][a-z0-9.+-]*:)?([\\\\/]{1,})?([\\S\\s]*)/i\n  , whitespace = '[\\\\x09\\\\x0A\\\\x0B\\\\x0C\\\\x0D\\\\x20\\\\xA0\\\\u1680\\\\u180E\\\\u2000\\\\u2001\\\\u2002\\\\u2003\\\\u2004\\\\u2005\\\\u2006\\\\u2007\\\\u2008\\\\u2009\\\\u200A\\\\u202F\\\\u205F\\\\u3000\\\\u2028\\\\u2029\\\\uFEFF]'\n  , left = new RegExp('^'+ whitespace +'+');\n\n/**\n * Trim a given string.\n *\n * @param {String} str String to trim.\n * @public\n */\nfunction trimLeft(str) {\n  return (str ? str : '').toString().replace(left, '');\n}\n\n/**\n * These are the parse rules for the URL parser, it informs the parser\n * about:\n *\n * 0. The char it Needs to parse, if it's a string it should be done using\n *    indexOf, RegExp using exec and NaN means set as current value.\n * 1. The property we should set when parsing this value.\n * 2. Indication if it's backwards or forward parsing, when set as number it's\n *    the value of extra chars that should be split off.\n * 3. Inherit from location if non existing in the parser.\n * 4. `toLowerCase` the resulting value.\n */\nvar rules = [\n  ['#', 'hash'],                        // Extract from the back.\n  ['?', 'query'],                       // Extract from the back.\n  function sanitize(address) {          // Sanitize what is left of the address\n    return address.replace('\\\\', '/');\n  },\n  ['/', 'pathname'],                    // Extract from the back.\n  ['@', 'auth', 1],                     // Extract from the front.\n  [NaN, 'host', undefined, 1, 1],       // Set left over value.\n  [/:(\\d+)$/, 'port', undefined, 1],    // RegExp the back.\n  [NaN, 'hostname', undefined, 1, 1]    // Set left over.\n];\n\n/**\n * These properties should not be copied or inherited from. This is only needed\n * for all non blob URL's as a blob URL does not include a hash, only the\n * origin.\n *\n * @type {Object}\n * @private\n */\nvar ignore = { hash: 1, query: 1 };\n\n/**\n * The location object differs when your code is loaded through a normal page,\n * Worker or through a worker using a blob. And with the blobble begins the\n * trouble as the location object will contain the URL of the blob, not the\n * location of the page where our code is loaded in. The actual origin is\n * encoded in the `pathname` so we can thankfully generate a good \"default\"\n * location from it so we can generate proper relative URL's again.\n *\n * @param {Object|String} loc Optional default location object.\n * @returns {Object} lolcation object.\n * @public\n */\nfunction lolcation(loc) {\n  var globalVar;\n\n  if (typeof window !== 'undefined') globalVar = window;\n  else if (typeof global !== 'undefined') globalVar = global;\n  else if (typeof self !== 'undefined') globalVar = self;\n  else globalVar = {};\n\n  var location = globalVar.location || {};\n  loc = loc || location;\n\n  var finaldestination = {}\n    , type = typeof loc\n    , key;\n\n  if ('blob:' === loc.protocol) {\n    finaldestination = new Url(unescape(loc.pathname), {});\n  } else if ('string' === type) {\n    finaldestination = new Url(loc, {});\n    for (key in ignore) delete finaldestination[key];\n  } else if ('object' === type) {\n    for (key in loc) {\n      if (key in ignore) continue;\n      finaldestination[key] = loc[key];\n    }\n\n    if (finaldestination.slashes === undefined) {\n      finaldestination.slashes = slashes.test(loc.href);\n    }\n  }\n\n  return finaldestination;\n}\n\n/**\n * @typedef ProtocolExtract\n * @type Object\n * @property {String} protocol Protocol matched in the URL, in lowercase.\n * @property {Boolean} slashes `true` if protocol is followed by \"//\", else `false`.\n * @property {String} rest Rest of the URL that is not part of the protocol.\n */\n\n/**\n * Extract protocol information from a URL with/without double slash (\"//\").\n *\n * @param {String} address URL we want to extract from.\n * @return {ProtocolExtract} Extracted information.\n * @private\n */\nfunction extractProtocol(address) {\n  address = trimLeft(address);\n\n  var match = protocolre.exec(address)\n    , protocol = match[1] ? match[1].toLowerCase() : ''\n    , slashes = !!(match[2] && match[2].length >= 2)\n    , rest =  match[2] && match[2].length === 1 ? '/' + match[3] : match[3];\n\n  return {\n    protocol: protocol,\n    slashes: slashes,\n    rest: rest\n  };\n}\n\n/**\n * Resolve a relative URL pathname against a base URL pathname.\n *\n * @param {String} relative Pathname of the relative URL.\n * @param {String} base Pathname of the base URL.\n * @return {String} Resolved pathname.\n * @private\n */\nfunction resolve(relative, base) {\n  if (relative === '') return base;\n\n  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))\n    , i = path.length\n    , last = path[i - 1]\n    , unshift = false\n    , up = 0;\n\n  while (i--) {\n    if (path[i] === '.') {\n      path.splice(i, 1);\n    } else if (path[i] === '..') {\n      path.splice(i, 1);\n      up++;\n    } else if (up) {\n      if (i === 0) unshift = true;\n      path.splice(i, 1);\n      up--;\n    }\n  }\n\n  if (unshift) path.unshift('');\n  if (last === '.' || last === '..') path.push('');\n\n  return path.join('/');\n}\n\n/**\n * The actual URL instance. Instead of returning an object we've opted-in to\n * create an actual constructor as it's much more memory efficient and\n * faster and it pleases my OCD.\n *\n * It is worth noting that we should not use `URL` as class name to prevent\n * clashes with the global URL instance that got introduced in browsers.\n *\n * @constructor\n * @param {String} address URL we want to parse.\n * @param {Object|String} [location] Location defaults for relative paths.\n * @param {Boolean|Function} [parser] Parser for the query string.\n * @private\n */\nfunction Url(address, location, parser) {\n  address = trimLeft(address);\n\n  if (!(this instanceof Url)) {\n    return new Url(address, location, parser);\n  }\n\n  var relative, extracted, parse, instruction, index, key\n    , instructions = rules.slice()\n    , type = typeof location\n    , url = this\n    , i = 0;\n\n  //\n  // The following if statements allows this module two have compatibility with\n  // 2 different API:\n  //\n  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments\n  //    where the boolean indicates that the query string should also be parsed.\n  //\n  // 2. The `URL` interface of the browser which accepts a URL, object as\n  //    arguments. The supplied object will be used as default values / fall-back\n  //    for relative paths.\n  //\n  if ('object' !== type && 'string' !== type) {\n    parser = location;\n    location = null;\n  }\n\n  if (parser && 'function' !== typeof parser) parser = qs.parse;\n\n  location = lolcation(location);\n\n  //\n  // Extract protocol information before running the instructions.\n  //\n  extracted = extractProtocol(address || '');\n  relative = !extracted.protocol && !extracted.slashes;\n  url.slashes = extracted.slashes || relative && location.slashes;\n  url.protocol = extracted.protocol || location.protocol || '';\n  address = extracted.rest;\n\n  //\n  // When the authority component is absent the URL starts with a path\n  // component.\n  //\n  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];\n\n  for (; i < instructions.length; i++) {\n    instruction = instructions[i];\n\n    if (typeof instruction === 'function') {\n      address = instruction(address);\n      continue;\n    }\n\n    parse = instruction[0];\n    key = instruction[1];\n\n    if (parse !== parse) {\n      url[key] = address;\n    } else if ('string' === typeof parse) {\n      if (~(index = address.indexOf(parse))) {\n        if ('number' === typeof instruction[2]) {\n          url[key] = address.slice(0, index);\n          address = address.slice(index + instruction[2]);\n        } else {\n          url[key] = address.slice(index);\n          address = address.slice(0, index);\n        }\n      }\n    } else if ((index = parse.exec(address))) {\n      url[key] = index[1];\n      address = address.slice(0, index.index);\n    }\n\n    url[key] = url[key] || (\n      relative && instruction[3] ? location[key] || '' : ''\n    );\n\n    //\n    // Hostname, host and protocol should be lowercased so they can be used to\n    // create a proper `origin`.\n    //\n    if (instruction[4]) url[key] = url[key].toLowerCase();\n  }\n\n  //\n  // Also parse the supplied query string in to an object. If we're supplied\n  // with a custom parser as function use that instead of the default build-in\n  // parser.\n  //\n  if (parser) url.query = parser(url.query);\n\n  //\n  // If the URL is relative, resolve the pathname against the base URL.\n  //\n  if (\n      relative\n    && location.slashes\n    && url.pathname.charAt(0) !== '/'\n    && (url.pathname !== '' || location.pathname !== '')\n  ) {\n    url.pathname = resolve(url.pathname, location.pathname);\n  }\n\n  //\n  // Default to a / for pathname if none exists. This normalizes the URL\n  // to always have a /\n  //\n  if (url.pathname.charAt(0) !== '/' && url.hostname) {\n    url.pathname = '/' + url.pathname;\n  }\n\n  //\n  // We should not add port numbers if they are already the default port number\n  // for a given protocol. As the host also contains the port number we're going\n  // override it with the hostname which contains no port number.\n  //\n  if (!required(url.port, url.protocol)) {\n    url.host = url.hostname;\n    url.port = '';\n  }\n\n  //\n  // Parse down the `auth` for the username and password.\n  //\n  url.username = url.password = '';\n  if (url.auth) {\n    instruction = url.auth.split(':');\n    url.username = instruction[0] || '';\n    url.password = instruction[1] || '';\n  }\n\n  url.origin = url.protocol && url.host && url.protocol !== 'file:'\n    ? url.protocol +'//'+ url.host\n    : 'null';\n\n  //\n  // The href is just the compiled result.\n  //\n  url.href = url.toString();\n}\n\n/**\n * This is convenience method for changing properties in the URL instance to\n * insure that they all propagate correctly.\n *\n * @param {String} part          Property we need to adjust.\n * @param {Mixed} value          The newly assigned value.\n * @param {Boolean|Function} fn  When setting the query, it will be the function\n *                               used to parse the query.\n *                               When setting the protocol, double slash will be\n *                               removed from the final url if it is true.\n * @returns {URL} URL instance for chaining.\n * @public\n */\nfunction set(part, value, fn) {\n  var url = this;\n\n  switch (part) {\n    case 'query':\n      if ('string' === typeof value && value.length) {\n        value = (fn || qs.parse)(value);\n      }\n\n      url[part] = value;\n      break;\n\n    case 'port':\n      url[part] = value;\n\n      if (!required(value, url.protocol)) {\n        url.host = url.hostname;\n        url[part] = '';\n      } else if (value) {\n        url.host = url.hostname +':'+ value;\n      }\n\n      break;\n\n    case 'hostname':\n      url[part] = value;\n\n      if (url.port) value += ':'+ url.port;\n      url.host = value;\n      break;\n\n    case 'host':\n      url[part] = value;\n\n      if (/:\\d+$/.test(value)) {\n        value = value.split(':');\n        url.port = value.pop();\n        url.hostname = value.join(':');\n      } else {\n        url.hostname = value;\n        url.port = '';\n      }\n\n      break;\n\n    case 'protocol':\n      url.protocol = value.toLowerCase();\n      url.slashes = !fn;\n      break;\n\n    case 'pathname':\n    case 'hash':\n      if (value) {\n        var char = part === 'pathname' ? '/' : '#';\n        url[part] = value.charAt(0) !== char ? char + value : value;\n      } else {\n        url[part] = value;\n      }\n      break;\n\n    default:\n      url[part] = value;\n  }\n\n  for (var i = 0; i < rules.length; i++) {\n    var ins = rules[i];\n\n    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();\n  }\n\n  url.origin = url.protocol && url.host && url.protocol !== 'file:'\n    ? url.protocol +'//'+ url.host\n    : 'null';\n\n  url.href = url.toString();\n\n  return url;\n}\n\n/**\n * Transform the properties back in to a valid and full URL string.\n *\n * @param {Function} stringify Optional query stringify function.\n * @returns {String} Compiled version of the URL.\n * @public\n */\nfunction toString(stringify) {\n  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;\n\n  var query\n    , url = this\n    , protocol = url.protocol;\n\n  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';\n\n  var result = protocol + (url.slashes ? '//' : '');\n\n  if (url.username) {\n    result += url.username;\n    if (url.password) result += ':'+ url.password;\n    result += '@';\n  }\n\n  result += url.host + url.pathname;\n\n  query = 'object' === typeof url.query ? stringify(url.query) : url.query;\n  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;\n\n  if (url.hash) result += url.hash;\n\n  return result;\n}\n\nUrl.prototype = { set: set, toString: toString };\n\n//\n// Expose the URL parser and some additional properties that might be useful for\n// others or testing.\n//\nUrl.extractProtocol = extractProtocol;\nUrl.location = lolcation;\nUrl.trimLeft = trimLeft;\nUrl.qs = qs;\n\nmodule.exports = Url;\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n\n},{\"querystringify\":59,\"requires-port\":60}]},{},[1])(1)\n});\n\n\n//# sourceMappingURL=sockjs.js.map\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/sockjs-client/dist/sockjs.js?"
        );

        /***/
      },

    /***/
    /*!******************************************!*\
  !*** ./node_modules/strip-ansi/index.js ***!
  \******************************************/
    './node_modules/strip-ansi/index.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\nvar ansiRegex = __webpack_require__(/*! ansi-regex */ \"./node_modules/ansi-regex/index.js\")();\n\nmodule.exports = function (str) {\n\treturn typeof str === 'string' ? str.replace(ansiRegex, '') : str;\n};\n\n\n//# sourceURL=webpack:///./node_modules/strip-ansi/index.js?"
        );

        /***/
      },

    /***/
    /*!*********************************!*\
  !*** ./node_modules/url/url.js ***!
  \*********************************/
    './node_modules/url/url.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar punycode = __webpack_require__(/*! punycode */ \"./node_modules/node-libs-browser/node_modules/punycode/punycode.js\");\nvar util = __webpack_require__(/*! ./util */ \"./node_modules/url/util.js\");\n\nexports.parse = urlParse;\nexports.resolve = urlResolve;\nexports.resolveObject = urlResolveObject;\nexports.format = urlFormat;\n\nexports.Url = Url;\n\nfunction Url() {\n  this.protocol = null;\n  this.slashes = null;\n  this.auth = null;\n  this.host = null;\n  this.port = null;\n  this.hostname = null;\n  this.hash = null;\n  this.search = null;\n  this.query = null;\n  this.pathname = null;\n  this.path = null;\n  this.href = null;\n}\n\n// Reference: RFC 3986, RFC 1808, RFC 2396\n\n// define these here so at least they only have to be\n// compiled once on the first module load.\nvar protocolPattern = /^([a-z0-9.+-]+:)/i,\n    portPattern = /:[0-9]*$/,\n\n    // Special case for a simple path URL\n    simplePathPattern = /^(\\/\\/?(?!\\/)[^\\?\\s]*)(\\?[^\\s]*)?$/,\n\n    // RFC 2396: characters reserved for delimiting URLs.\n    // We actually just auto-escape these.\n    delims = ['<', '>', '\"', '`', ' ', '\\r', '\\n', '\\t'],\n\n    // RFC 2396: characters not allowed for various reasons.\n    unwise = ['{', '}', '|', '\\\\', '^', '`'].concat(delims),\n\n    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.\n    autoEscape = ['\\''].concat(unwise),\n    // Characters that are never ever allowed in a hostname.\n    // Note that any invalid chars are also handled, but these\n    // are the ones that are *expected* to be seen, so we fast-path\n    // them.\n    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),\n    hostEndingChars = ['/', '?', '#'],\n    hostnameMaxLen = 255,\n    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,\n    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,\n    // protocols that can allow \"unsafe\" and \"unwise\" chars.\n    unsafeProtocol = {\n      'javascript': true,\n      'javascript:': true\n    },\n    // protocols that never have a hostname.\n    hostlessProtocol = {\n      'javascript': true,\n      'javascript:': true\n    },\n    // protocols that always contain a // bit.\n    slashedProtocol = {\n      'http': true,\n      'https': true,\n      'ftp': true,\n      'gopher': true,\n      'file': true,\n      'http:': true,\n      'https:': true,\n      'ftp:': true,\n      'gopher:': true,\n      'file:': true\n    },\n    querystring = __webpack_require__(/*! querystring */ \"./node_modules/querystring-es3/index.js\");\n\nfunction urlParse(url, parseQueryString, slashesDenoteHost) {\n  if (url && util.isObject(url) && url instanceof Url) return url;\n\n  var u = new Url;\n  u.parse(url, parseQueryString, slashesDenoteHost);\n  return u;\n}\n\nUrl.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {\n  if (!util.isString(url)) {\n    throw new TypeError(\"Parameter 'url' must be a string, not \" + typeof url);\n  }\n\n  // Copy chrome, IE, opera backslash-handling behavior.\n  // Back slashes before the query string get converted to forward slashes\n  // See: https://code.google.com/p/chromium/issues/detail?id=25916\n  var queryIndex = url.indexOf('?'),\n      splitter =\n          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',\n      uSplit = url.split(splitter),\n      slashRegex = /\\\\/g;\n  uSplit[0] = uSplit[0].replace(slashRegex, '/');\n  url = uSplit.join(splitter);\n\n  var rest = url;\n\n  // trim before proceeding.\n  // This is to support parse stuff like \"  http://foo.com  \\n\"\n  rest = rest.trim();\n\n  if (!slashesDenoteHost && url.split('#').length === 1) {\n    // Try fast path regexp\n    var simplePath = simplePathPattern.exec(rest);\n    if (simplePath) {\n      this.path = rest;\n      this.href = rest;\n      this.pathname = simplePath[1];\n      if (simplePath[2]) {\n        this.search = simplePath[2];\n        if (parseQueryString) {\n          this.query = querystring.parse(this.search.substr(1));\n        } else {\n          this.query = this.search.substr(1);\n        }\n      } else if (parseQueryString) {\n        this.search = '';\n        this.query = {};\n      }\n      return this;\n    }\n  }\n\n  var proto = protocolPattern.exec(rest);\n  if (proto) {\n    proto = proto[0];\n    var lowerProto = proto.toLowerCase();\n    this.protocol = lowerProto;\n    rest = rest.substr(proto.length);\n  }\n\n  // figure out if it's got a host\n  // user@server is *always* interpreted as a hostname, and url\n  // resolution will treat //foo/bar as host=foo,path=bar because that's\n  // how the browser resolves relative URLs.\n  if (slashesDenoteHost || proto || rest.match(/^\\/\\/[^@\\/]+@[^@\\/]+/)) {\n    var slashes = rest.substr(0, 2) === '//';\n    if (slashes && !(proto && hostlessProtocol[proto])) {\n      rest = rest.substr(2);\n      this.slashes = true;\n    }\n  }\n\n  if (!hostlessProtocol[proto] &&\n      (slashes || (proto && !slashedProtocol[proto]))) {\n\n    // there's a hostname.\n    // the first instance of /, ?, ;, or # ends the host.\n    //\n    // If there is an @ in the hostname, then non-host chars *are* allowed\n    // to the left of the last @ sign, unless some host-ending character\n    // comes *before* the @-sign.\n    // URLs are obnoxious.\n    //\n    // ex:\n    // http://a@b@c/ => user:a@b host:c\n    // http://a@b?@c => user:a host:c path:/?@c\n\n    // v0.12 TODO(isaacs): This is not quite how Chrome does things.\n    // Review our test case against browsers more comprehensively.\n\n    // find the first instance of any hostEndingChars\n    var hostEnd = -1;\n    for (var i = 0; i < hostEndingChars.length; i++) {\n      var hec = rest.indexOf(hostEndingChars[i]);\n      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))\n        hostEnd = hec;\n    }\n\n    // at this point, either we have an explicit point where the\n    // auth portion cannot go past, or the last @ char is the decider.\n    var auth, atSign;\n    if (hostEnd === -1) {\n      // atSign can be anywhere.\n      atSign = rest.lastIndexOf('@');\n    } else {\n      // atSign must be in auth portion.\n      // http://a@b/c@d => host:b auth:a path:/c@d\n      atSign = rest.lastIndexOf('@', hostEnd);\n    }\n\n    // Now we have a portion which is definitely the auth.\n    // Pull that off.\n    if (atSign !== -1) {\n      auth = rest.slice(0, atSign);\n      rest = rest.slice(atSign + 1);\n      this.auth = decodeURIComponent(auth);\n    }\n\n    // the host is the remaining to the left of the first non-host char\n    hostEnd = -1;\n    for (var i = 0; i < nonHostChars.length; i++) {\n      var hec = rest.indexOf(nonHostChars[i]);\n      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))\n        hostEnd = hec;\n    }\n    // if we still have not hit it, then the entire thing is a host.\n    if (hostEnd === -1)\n      hostEnd = rest.length;\n\n    this.host = rest.slice(0, hostEnd);\n    rest = rest.slice(hostEnd);\n\n    // pull out port.\n    this.parseHost();\n\n    // we've indicated that there is a hostname,\n    // so even if it's empty, it has to be present.\n    this.hostname = this.hostname || '';\n\n    // if hostname begins with [ and ends with ]\n    // assume that it's an IPv6 address.\n    var ipv6Hostname = this.hostname[0] === '[' &&\n        this.hostname[this.hostname.length - 1] === ']';\n\n    // validate a little.\n    if (!ipv6Hostname) {\n      var hostparts = this.hostname.split(/\\./);\n      for (var i = 0, l = hostparts.length; i < l; i++) {\n        var part = hostparts[i];\n        if (!part) continue;\n        if (!part.match(hostnamePartPattern)) {\n          var newpart = '';\n          for (var j = 0, k = part.length; j < k; j++) {\n            if (part.charCodeAt(j) > 127) {\n              // we replace non-ASCII char with a temporary placeholder\n              // we need this to make sure size of hostname is not\n              // broken by replacing non-ASCII by nothing\n              newpart += 'x';\n            } else {\n              newpart += part[j];\n            }\n          }\n          // we test again with ASCII char only\n          if (!newpart.match(hostnamePartPattern)) {\n            var validParts = hostparts.slice(0, i);\n            var notHost = hostparts.slice(i + 1);\n            var bit = part.match(hostnamePartStart);\n            if (bit) {\n              validParts.push(bit[1]);\n              notHost.unshift(bit[2]);\n            }\n            if (notHost.length) {\n              rest = '/' + notHost.join('.') + rest;\n            }\n            this.hostname = validParts.join('.');\n            break;\n          }\n        }\n      }\n    }\n\n    if (this.hostname.length > hostnameMaxLen) {\n      this.hostname = '';\n    } else {\n      // hostnames are always lower case.\n      this.hostname = this.hostname.toLowerCase();\n    }\n\n    if (!ipv6Hostname) {\n      // IDNA Support: Returns a punycoded representation of \"domain\".\n      // It only converts parts of the domain name that\n      // have non-ASCII characters, i.e. it doesn't matter if\n      // you call it with a domain that already is ASCII-only.\n      this.hostname = punycode.toASCII(this.hostname);\n    }\n\n    var p = this.port ? ':' + this.port : '';\n    var h = this.hostname || '';\n    this.host = h + p;\n    this.href += this.host;\n\n    // strip [ and ] from the hostname\n    // the host field still retains them, though\n    if (ipv6Hostname) {\n      this.hostname = this.hostname.substr(1, this.hostname.length - 2);\n      if (rest[0] !== '/') {\n        rest = '/' + rest;\n      }\n    }\n  }\n\n  // now rest is set to the post-host stuff.\n  // chop off any delim chars.\n  if (!unsafeProtocol[lowerProto]) {\n\n    // First, make 100% sure that any \"autoEscape\" chars get\n    // escaped, even if encodeURIComponent doesn't think they\n    // need to be.\n    for (var i = 0, l = autoEscape.length; i < l; i++) {\n      var ae = autoEscape[i];\n      if (rest.indexOf(ae) === -1)\n        continue;\n      var esc = encodeURIComponent(ae);\n      if (esc === ae) {\n        esc = escape(ae);\n      }\n      rest = rest.split(ae).join(esc);\n    }\n  }\n\n\n  // chop off from the tail first.\n  var hash = rest.indexOf('#');\n  if (hash !== -1) {\n    // got a fragment string.\n    this.hash = rest.substr(hash);\n    rest = rest.slice(0, hash);\n  }\n  var qm = rest.indexOf('?');\n  if (qm !== -1) {\n    this.search = rest.substr(qm);\n    this.query = rest.substr(qm + 1);\n    if (parseQueryString) {\n      this.query = querystring.parse(this.query);\n    }\n    rest = rest.slice(0, qm);\n  } else if (parseQueryString) {\n    // no query string, but parseQueryString still requested\n    this.search = '';\n    this.query = {};\n  }\n  if (rest) this.pathname = rest;\n  if (slashedProtocol[lowerProto] &&\n      this.hostname && !this.pathname) {\n    this.pathname = '/';\n  }\n\n  //to support http.request\n  if (this.pathname || this.search) {\n    var p = this.pathname || '';\n    var s = this.search || '';\n    this.path = p + s;\n  }\n\n  // finally, reconstruct the href based on what has been validated.\n  this.href = this.format();\n  return this;\n};\n\n// format a parsed object into a url string\nfunction urlFormat(obj) {\n  // ensure it's an object, and not a string url.\n  // If it's an obj, this is a no-op.\n  // this way, you can call url_format() on strings\n  // to clean up potentially wonky urls.\n  if (util.isString(obj)) obj = urlParse(obj);\n  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);\n  return obj.format();\n}\n\nUrl.prototype.format = function() {\n  var auth = this.auth || '';\n  if (auth) {\n    auth = encodeURIComponent(auth);\n    auth = auth.replace(/%3A/i, ':');\n    auth += '@';\n  }\n\n  var protocol = this.protocol || '',\n      pathname = this.pathname || '',\n      hash = this.hash || '',\n      host = false,\n      query = '';\n\n  if (this.host) {\n    host = auth + this.host;\n  } else if (this.hostname) {\n    host = auth + (this.hostname.indexOf(':') === -1 ?\n        this.hostname :\n        '[' + this.hostname + ']');\n    if (this.port) {\n      host += ':' + this.port;\n    }\n  }\n\n  if (this.query &&\n      util.isObject(this.query) &&\n      Object.keys(this.query).length) {\n    query = querystring.stringify(this.query);\n  }\n\n  var search = this.search || (query && ('?' + query)) || '';\n\n  if (protocol && protocol.substr(-1) !== ':') protocol += ':';\n\n  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.\n  // unless they had them to begin with.\n  if (this.slashes ||\n      (!protocol || slashedProtocol[protocol]) && host !== false) {\n    host = '//' + (host || '');\n    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;\n  } else if (!host) {\n    host = '';\n  }\n\n  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;\n  if (search && search.charAt(0) !== '?') search = '?' + search;\n\n  pathname = pathname.replace(/[?#]/g, function(match) {\n    return encodeURIComponent(match);\n  });\n  search = search.replace('#', '%23');\n\n  return protocol + host + pathname + search + hash;\n};\n\nfunction urlResolve(source, relative) {\n  return urlParse(source, false, true).resolve(relative);\n}\n\nUrl.prototype.resolve = function(relative) {\n  return this.resolveObject(urlParse(relative, false, true)).format();\n};\n\nfunction urlResolveObject(source, relative) {\n  if (!source) return relative;\n  return urlParse(source, false, true).resolveObject(relative);\n}\n\nUrl.prototype.resolveObject = function(relative) {\n  if (util.isString(relative)) {\n    var rel = new Url();\n    rel.parse(relative, false, true);\n    relative = rel;\n  }\n\n  var result = new Url();\n  var tkeys = Object.keys(this);\n  for (var tk = 0; tk < tkeys.length; tk++) {\n    var tkey = tkeys[tk];\n    result[tkey] = this[tkey];\n  }\n\n  // hash is always overridden, no matter what.\n  // even href=\"\" will remove it.\n  result.hash = relative.hash;\n\n  // if the relative url is empty, then there's nothing left to do here.\n  if (relative.href === '') {\n    result.href = result.format();\n    return result;\n  }\n\n  // hrefs like //foo/bar always cut to the protocol.\n  if (relative.slashes && !relative.protocol) {\n    // take everything except the protocol from relative\n    var rkeys = Object.keys(relative);\n    for (var rk = 0; rk < rkeys.length; rk++) {\n      var rkey = rkeys[rk];\n      if (rkey !== 'protocol')\n        result[rkey] = relative[rkey];\n    }\n\n    //urlParse appends trailing / to urls like http://www.example.com\n    if (slashedProtocol[result.protocol] &&\n        result.hostname && !result.pathname) {\n      result.path = result.pathname = '/';\n    }\n\n    result.href = result.format();\n    return result;\n  }\n\n  if (relative.protocol && relative.protocol !== result.protocol) {\n    // if it's a known url protocol, then changing\n    // the protocol does weird things\n    // first, if it's not file:, then we MUST have a host,\n    // and if there was a path\n    // to begin with, then we MUST have a path.\n    // if it is file:, then the host is dropped,\n    // because that's known to be hostless.\n    // anything else is assumed to be absolute.\n    if (!slashedProtocol[relative.protocol]) {\n      var keys = Object.keys(relative);\n      for (var v = 0; v < keys.length; v++) {\n        var k = keys[v];\n        result[k] = relative[k];\n      }\n      result.href = result.format();\n      return result;\n    }\n\n    result.protocol = relative.protocol;\n    if (!relative.host && !hostlessProtocol[relative.protocol]) {\n      var relPath = (relative.pathname || '').split('/');\n      while (relPath.length && !(relative.host = relPath.shift()));\n      if (!relative.host) relative.host = '';\n      if (!relative.hostname) relative.hostname = '';\n      if (relPath[0] !== '') relPath.unshift('');\n      if (relPath.length < 2) relPath.unshift('');\n      result.pathname = relPath.join('/');\n    } else {\n      result.pathname = relative.pathname;\n    }\n    result.search = relative.search;\n    result.query = relative.query;\n    result.host = relative.host || '';\n    result.auth = relative.auth;\n    result.hostname = relative.hostname || relative.host;\n    result.port = relative.port;\n    // to support http.request\n    if (result.pathname || result.search) {\n      var p = result.pathname || '';\n      var s = result.search || '';\n      result.path = p + s;\n    }\n    result.slashes = result.slashes || relative.slashes;\n    result.href = result.format();\n    return result;\n  }\n\n  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),\n      isRelAbs = (\n          relative.host ||\n          relative.pathname && relative.pathname.charAt(0) === '/'\n      ),\n      mustEndAbs = (isRelAbs || isSourceAbs ||\n                    (result.host && relative.pathname)),\n      removeAllDots = mustEndAbs,\n      srcPath = result.pathname && result.pathname.split('/') || [],\n      relPath = relative.pathname && relative.pathname.split('/') || [],\n      psychotic = result.protocol && !slashedProtocol[result.protocol];\n\n  // if the url is a non-slashed url, then relative\n  // links like ../.. should be able\n  // to crawl up to the hostname, as well.  This is strange.\n  // result.protocol has already been set by now.\n  // Later on, put the first path part into the host field.\n  if (psychotic) {\n    result.hostname = '';\n    result.port = null;\n    if (result.host) {\n      if (srcPath[0] === '') srcPath[0] = result.host;\n      else srcPath.unshift(result.host);\n    }\n    result.host = '';\n    if (relative.protocol) {\n      relative.hostname = null;\n      relative.port = null;\n      if (relative.host) {\n        if (relPath[0] === '') relPath[0] = relative.host;\n        else relPath.unshift(relative.host);\n      }\n      relative.host = null;\n    }\n    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');\n  }\n\n  if (isRelAbs) {\n    // it's absolute.\n    result.host = (relative.host || relative.host === '') ?\n                  relative.host : result.host;\n    result.hostname = (relative.hostname || relative.hostname === '') ?\n                      relative.hostname : result.hostname;\n    result.search = relative.search;\n    result.query = relative.query;\n    srcPath = relPath;\n    // fall through to the dot-handling below.\n  } else if (relPath.length) {\n    // it's relative\n    // throw away the existing file, and take the new path instead.\n    if (!srcPath) srcPath = [];\n    srcPath.pop();\n    srcPath = srcPath.concat(relPath);\n    result.search = relative.search;\n    result.query = relative.query;\n  } else if (!util.isNullOrUndefined(relative.search)) {\n    // just pull out the search.\n    // like href='?foo'.\n    // Put this after the other two cases because it simplifies the booleans\n    if (psychotic) {\n      result.hostname = result.host = srcPath.shift();\n      //occationaly the auth can get stuck only in host\n      //this especially happens in cases like\n      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')\n      var authInHost = result.host && result.host.indexOf('@') > 0 ?\n                       result.host.split('@') : false;\n      if (authInHost) {\n        result.auth = authInHost.shift();\n        result.host = result.hostname = authInHost.shift();\n      }\n    }\n    result.search = relative.search;\n    result.query = relative.query;\n    //to support http.request\n    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {\n      result.path = (result.pathname ? result.pathname : '') +\n                    (result.search ? result.search : '');\n    }\n    result.href = result.format();\n    return result;\n  }\n\n  if (!srcPath.length) {\n    // no path at all.  easy.\n    // we've already handled the other stuff above.\n    result.pathname = null;\n    //to support http.request\n    if (result.search) {\n      result.path = '/' + result.search;\n    } else {\n      result.path = null;\n    }\n    result.href = result.format();\n    return result;\n  }\n\n  // if a url ENDs in . or .., then it must get a trailing slash.\n  // however, if it ends in anything else non-slashy,\n  // then it must NOT get a trailing slash.\n  var last = srcPath.slice(-1)[0];\n  var hasTrailingSlash = (\n      (result.host || relative.host || srcPath.length > 1) &&\n      (last === '.' || last === '..') || last === '');\n\n  // strip single dots, resolve double dots to parent dir\n  // if the path tries to go above the root, `up` ends up > 0\n  var up = 0;\n  for (var i = srcPath.length; i >= 0; i--) {\n    last = srcPath[i];\n    if (last === '.') {\n      srcPath.splice(i, 1);\n    } else if (last === '..') {\n      srcPath.splice(i, 1);\n      up++;\n    } else if (up) {\n      srcPath.splice(i, 1);\n      up--;\n    }\n  }\n\n  // if the path is allowed to go above the root, restore leading ..s\n  if (!mustEndAbs && !removeAllDots) {\n    for (; up--; up) {\n      srcPath.unshift('..');\n    }\n  }\n\n  if (mustEndAbs && srcPath[0] !== '' &&\n      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {\n    srcPath.unshift('');\n  }\n\n  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {\n    srcPath.push('');\n  }\n\n  var isAbsolute = srcPath[0] === '' ||\n      (srcPath[0] && srcPath[0].charAt(0) === '/');\n\n  // put the host back\n  if (psychotic) {\n    result.hostname = result.host = isAbsolute ? '' :\n                                    srcPath.length ? srcPath.shift() : '';\n    //occationaly the auth can get stuck only in host\n    //this especially happens in cases like\n    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')\n    var authInHost = result.host && result.host.indexOf('@') > 0 ?\n                     result.host.split('@') : false;\n    if (authInHost) {\n      result.auth = authInHost.shift();\n      result.host = result.hostname = authInHost.shift();\n    }\n  }\n\n  mustEndAbs = mustEndAbs || (result.host && srcPath.length);\n\n  if (mustEndAbs && !isAbsolute) {\n    srcPath.unshift('');\n  }\n\n  if (!srcPath.length) {\n    result.pathname = null;\n    result.path = null;\n  } else {\n    result.pathname = srcPath.join('/');\n  }\n\n  //to support request.http\n  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {\n    result.path = (result.pathname ? result.pathname : '') +\n                  (result.search ? result.search : '');\n  }\n  result.auth = relative.auth || result.auth;\n  result.slashes = result.slashes || relative.slashes;\n  result.href = result.format();\n  return result;\n};\n\nUrl.prototype.parseHost = function() {\n  var host = this.host;\n  var port = portPattern.exec(host);\n  if (port) {\n    port = port[0];\n    if (port !== ':') {\n      this.port = port.substr(1);\n    }\n    host = host.substr(0, host.length - port.length);\n  }\n  if (host) this.hostname = host;\n};\n\n\n//# sourceURL=webpack:///./node_modules/url/url.js?"
        );

        /***/
      },

    /***/
    /*!**********************************!*\
  !*** ./node_modules/url/util.js ***!
  \**********************************/
    './node_modules/url/util.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n\nmodule.exports = {\n  isString: function(arg) {\n    return typeof(arg) === 'string';\n  },\n  isObject: function(arg) {\n    return typeof(arg) === 'object' && arg !== null;\n  },\n  isNull: function(arg) {\n    return arg === null;\n  },\n  isNullOrUndefined: function(arg) {\n    return arg == null;\n  }\n};\n\n\n//# sourceURL=webpack:///./node_modules/url/util.js?"
        );

        /***/
      },

    /***/
    /*!*********************************************************!*\
  !*** (webpack)-dev-server/client/clients/BaseClient.js ***!
  \*********************************************************/
    './node_modules/webpack-dev-server/client/clients/BaseClient.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\n/* eslint-disable\n  no-unused-vars\n*/\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nmodule.exports = /*#__PURE__*/function () {\n  function BaseClient() {\n    _classCallCheck(this, BaseClient);\n  }\n\n  _createClass(BaseClient, null, [{\n    key: "getClientPath",\n    value: function getClientPath(options) {\n      throw new Error(\'Client needs implementation\');\n    }\n  }]);\n\n  return BaseClient;\n}();\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/clients/BaseClient.js?'
        );

        /***/
      },

    /***/
    /*!***********************************************************!*\
  !*** (webpack)-dev-server/client/clients/SockJSClient.js ***!
  \***********************************************************/
    './node_modules/webpack-dev-server/client/clients/SockJSClient.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\n/* eslint-disable\n  no-unused-vars\n*/\n\nfunction _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nvar SockJS = __webpack_require__(/*! sockjs-client/dist/sockjs */ "./node_modules/sockjs-client/dist/sockjs.js");\n\nvar BaseClient = __webpack_require__(/*! ./BaseClient */ "./node_modules/webpack-dev-server/client/clients/BaseClient.js");\n\nmodule.exports = /*#__PURE__*/function (_BaseClient) {\n  _inherits(SockJSClient, _BaseClient);\n\n  var _super = _createSuper(SockJSClient);\n\n  function SockJSClient(url) {\n    var _this;\n\n    _classCallCheck(this, SockJSClient);\n\n    _this = _super.call(this);\n    _this.sock = new SockJS(url);\n\n    _this.sock.onerror = function (err) {// TODO: use logger to log the error event once client and client-src\n      // are reorganized to have the same directory structure\n    };\n\n    return _this;\n  }\n\n  _createClass(SockJSClient, [{\n    key: "onOpen",\n    value: function onOpen(f) {\n      this.sock.onopen = f;\n    }\n  }, {\n    key: "onClose",\n    value: function onClose(f) {\n      this.sock.onclose = f;\n    } // call f with the message string as the first argument\n\n  }, {\n    key: "onMessage",\n    value: function onMessage(f) {\n      this.sock.onmessage = function (e) {\n        f(e.data);\n      };\n    }\n  }], [{\n    key: "getClientPath",\n    value: function getClientPath(options) {\n      return /*require.resolve*/(/*! ./SockJSClient */ "./node_modules/webpack-dev-server/client/clients/SockJSClient.js");\n    }\n  }]);\n\n  return SockJSClient;\n}(BaseClient);\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/clients/SockJSClient.js?'
        );

        /***/
      },

    /***/
    /*!*********************************************************!*\
  !*** (webpack)-dev-server/client?http://localhost:8808 ***!
  \*********************************************************/
    './node_modules/webpack-dev-server/client/index.js?http://localhost:8808':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "/* WEBPACK VAR INJECTION */(function(__resourceQuery) {\n/* global __resourceQuery WorkerGlobalScope self */\n\n/* eslint prefer-destructuring: off */\n\nvar stripAnsi = __webpack_require__(/*! strip-ansi */ \"./node_modules/strip-ansi/index.js\");\n\nvar socket = __webpack_require__(/*! ./socket */ \"./node_modules/webpack-dev-server/client/socket.js\");\n\nvar overlay = __webpack_require__(/*! ./overlay */ \"./node_modules/webpack-dev-server/client/overlay.js\");\n\nvar _require = __webpack_require__(/*! ./utils/log */ \"./node_modules/webpack-dev-server/client/utils/log.js\"),\n    log = _require.log,\n    setLogLevel = _require.setLogLevel;\n\nvar sendMessage = __webpack_require__(/*! ./utils/sendMessage */ \"./node_modules/webpack-dev-server/client/utils/sendMessage.js\");\n\nvar reloadApp = __webpack_require__(/*! ./utils/reloadApp */ \"./node_modules/webpack-dev-server/client/utils/reloadApp.js\");\n\nvar createSocketUrl = __webpack_require__(/*! ./utils/createSocketUrl */ \"./node_modules/webpack-dev-server/client/utils/createSocketUrl.js\");\n\nvar status = {\n  isUnloading: false,\n  currentHash: ''\n};\nvar options = {\n  hot: false,\n  hotReload: true,\n  liveReload: false,\n  initial: true,\n  useWarningOverlay: false,\n  useErrorOverlay: false,\n  useProgress: false\n};\nvar socketUrl = createSocketUrl(__resourceQuery);\nself.addEventListener('beforeunload', function () {\n  status.isUnloading = true;\n});\n\nif (typeof window !== 'undefined') {\n  var qs = window.location.search.toLowerCase();\n  options.hotReload = qs.indexOf('hotreload=false') === -1;\n}\n\nvar onSocketMessage = {\n  hot: function hot() {\n    options.hot = true;\n    log.info('[WDS] Hot Module Replacement enabled.');\n  },\n  liveReload: function liveReload() {\n    options.liveReload = true;\n    log.info('[WDS] Live Reloading enabled.');\n  },\n  invalid: function invalid() {\n    log.info('[WDS] App updated. Recompiling...'); // fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.\n\n    if (options.useWarningOverlay || options.useErrorOverlay) {\n      overlay.clear();\n    }\n\n    sendMessage('Invalid');\n  },\n  hash: function hash(_hash) {\n    status.currentHash = _hash;\n  },\n  'still-ok': function stillOk() {\n    log.info('[WDS] Nothing changed.');\n\n    if (options.useWarningOverlay || options.useErrorOverlay) {\n      overlay.clear();\n    }\n\n    sendMessage('StillOk');\n  },\n  'log-level': function logLevel(level) {\n    var hotCtx = __webpack_require__(\"./node_modules/webpack/hot sync ^\\\\.\\\\/log$\");\n\n    if (hotCtx.keys().indexOf('./log') !== -1) {\n      hotCtx('./log').setLogLevel(level);\n    }\n\n    setLogLevel(level);\n  },\n  overlay: function overlay(value) {\n    if (typeof document !== 'undefined') {\n      if (typeof value === 'boolean') {\n        options.useWarningOverlay = false;\n        options.useErrorOverlay = value;\n      } else if (value) {\n        options.useWarningOverlay = value.warnings;\n        options.useErrorOverlay = value.errors;\n      }\n    }\n  },\n  progress: function progress(_progress) {\n    if (typeof document !== 'undefined') {\n      options.useProgress = _progress;\n    }\n  },\n  'progress-update': function progressUpdate(data) {\n    if (options.useProgress) {\n      log.info(\"[WDS] \".concat(data.percent, \"% - \").concat(data.msg, \".\"));\n    }\n\n    sendMessage('Progress', data);\n  },\n  ok: function ok() {\n    sendMessage('Ok');\n\n    if (options.useWarningOverlay || options.useErrorOverlay) {\n      overlay.clear();\n    }\n\n    if (options.initial) {\n      return options.initial = false;\n    } // eslint-disable-line no-return-assign\n\n\n    reloadApp(options, status);\n  },\n  'content-changed': function contentChanged() {\n    log.info('[WDS] Content base changed. Reloading...');\n    self.location.reload();\n  },\n  warnings: function warnings(_warnings) {\n    log.warn('[WDS] Warnings while compiling.');\n\n    var strippedWarnings = _warnings.map(function (warning) {\n      return stripAnsi(warning);\n    });\n\n    sendMessage('Warnings', strippedWarnings);\n\n    for (var i = 0; i < strippedWarnings.length; i++) {\n      log.warn(strippedWarnings[i]);\n    }\n\n    if (options.useWarningOverlay) {\n      overlay.showMessage(_warnings);\n    }\n\n    if (options.initial) {\n      return options.initial = false;\n    } // eslint-disable-line no-return-assign\n\n\n    reloadApp(options, status);\n  },\n  errors: function errors(_errors) {\n    log.error('[WDS] Errors while compiling. Reload prevented.');\n\n    var strippedErrors = _errors.map(function (error) {\n      return stripAnsi(error);\n    });\n\n    sendMessage('Errors', strippedErrors);\n\n    for (var i = 0; i < strippedErrors.length; i++) {\n      log.error(strippedErrors[i]);\n    }\n\n    if (options.useErrorOverlay) {\n      overlay.showMessage(_errors);\n    }\n\n    options.initial = false;\n  },\n  error: function error(_error) {\n    log.error(_error);\n  },\n  close: function close() {\n    log.error('[WDS] Disconnected!');\n    sendMessage('Close');\n  }\n};\nsocket(socketUrl, onSocketMessage);\n/* WEBPACK VAR INJECTION */}.call(this, \"?http://localhost:8808\"))\n\n//# sourceURL=webpack:///(webpack)-dev-server/client?"
        );

        /***/
      },

    /***/
    /*!**********************************************!*\
  !*** (webpack)-dev-server/client/overlay.js ***!
  \**********************************************/
    './node_modules/webpack-dev-server/client/overlay.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          " // The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)\n// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).\n\nvar ansiHTML = __webpack_require__(/*! ansi-html */ \"./node_modules/ansi-html/index.js\");\n\nvar _require = __webpack_require__(/*! html-entities */ \"./node_modules/html-entities/lib/index.js\"),\n    AllHtmlEntities = _require.AllHtmlEntities;\n\nvar entities = new AllHtmlEntities();\nvar colors = {\n  reset: ['transparent', 'transparent'],\n  black: '181818',\n  red: 'E36049',\n  green: 'B3CB74',\n  yellow: 'FFD080',\n  blue: '7CAFC2',\n  magenta: '7FACCA',\n  cyan: 'C3C2EF',\n  lightgrey: 'EBE7E3',\n  darkgrey: '6D7891'\n};\nvar overlayIframe = null;\nvar overlayDiv = null;\nvar lastOnOverlayDivReady = null;\nansiHTML.setColors(colors);\n\nfunction createOverlayIframe(onIframeLoad) {\n  var iframe = document.createElement('iframe');\n  iframe.id = 'webpack-dev-server-client-overlay';\n  iframe.src = 'about:blank';\n  iframe.style.position = 'fixed';\n  iframe.style.left = 0;\n  iframe.style.top = 0;\n  iframe.style.right = 0;\n  iframe.style.bottom = 0;\n  iframe.style.width = '100vw';\n  iframe.style.height = '100vh';\n  iframe.style.border = 'none';\n  iframe.style.zIndex = 9999999999;\n  iframe.onload = onIframeLoad;\n  return iframe;\n}\n\nfunction addOverlayDivTo(iframe) {\n  var div = iframe.contentDocument.createElement('div');\n  div.id = 'webpack-dev-server-client-overlay-div';\n  div.style.position = 'fixed';\n  div.style.boxSizing = 'border-box';\n  div.style.left = 0;\n  div.style.top = 0;\n  div.style.right = 0;\n  div.style.bottom = 0;\n  div.style.width = '100vw';\n  div.style.height = '100vh';\n  div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';\n  div.style.color = '#E8E8E8';\n  div.style.fontFamily = 'Menlo, Consolas, monospace';\n  div.style.fontSize = 'large';\n  div.style.padding = '2rem';\n  div.style.lineHeight = '1.2';\n  div.style.whiteSpace = 'pre-wrap';\n  div.style.overflow = 'auto';\n  iframe.contentDocument.body.appendChild(div);\n  return div;\n}\n\nfunction ensureOverlayDivExists(onOverlayDivReady) {\n  if (overlayDiv) {\n    // Everything is ready, call the callback right away.\n    onOverlayDivReady(overlayDiv);\n    return;\n  } // Creating an iframe may be asynchronous so we'll schedule the callback.\n  // In case of multiple calls, last callback wins.\n\n\n  lastOnOverlayDivReady = onOverlayDivReady;\n\n  if (overlayIframe) {\n    // We've already created it.\n    return;\n  } // Create iframe and, when it is ready, a div inside it.\n\n\n  overlayIframe = createOverlayIframe(function () {\n    overlayDiv = addOverlayDivTo(overlayIframe); // Now we can talk!\n\n    lastOnOverlayDivReady(overlayDiv);\n  }); // Zalgo alert: onIframeLoad() will be called either synchronously\n  // or asynchronously depending on the browser.\n  // We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.\n\n  document.body.appendChild(overlayIframe);\n} // Successful compilation.\n\n\nfunction clear() {\n  if (!overlayDiv) {\n    // It is not there in the first place.\n    return;\n  } // Clean up and reset internal state.\n\n\n  document.body.removeChild(overlayIframe);\n  overlayDiv = null;\n  overlayIframe = null;\n  lastOnOverlayDivReady = null;\n} // Compilation with errors (e.g. syntax error or missing modules).\n\n\nfunction showMessage(messages) {\n  ensureOverlayDivExists(function (div) {\n    // Make it look similar to our terminal.\n    div.innerHTML = \"<span style=\\\"color: #\".concat(colors.red, \"\\\">Failed to compile.</span><br><br>\").concat(ansiHTML(entities.encode(messages[0])));\n  });\n}\n\nmodule.exports = {\n  clear: clear,\n  showMessage: showMessage\n};\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/overlay.js?"
        );

        /***/
      },

    /***/
    /*!*********************************************!*\
  !*** (webpack)-dev-server/client/socket.js ***!
  \*********************************************/
    './node_modules/webpack-dev-server/client/socket.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "/* WEBPACK VAR INJECTION */(function(__webpack_dev_server_client__) {\n/* global __webpack_dev_server_client__ */\n\n/* eslint-disable\n  camelcase\n*/\n// this SockJSClient is here as a default fallback, in case inline mode\n// is off or the client is not injected. This will be switched to\n// WebsocketClient when it becomes the default\n// important: the path to SockJSClient here is made to work in the 'client'\n// directory, but is updated via the webpack compilation when compiled from\n// the 'client-src' directory\n\nvar Client = typeof __webpack_dev_server_client__ !== 'undefined' ? __webpack_dev_server_client__ : // eslint-disable-next-line import/no-unresolved\n__webpack_require__(/*! ./clients/SockJSClient */ \"./node_modules/webpack-dev-server/client/clients/SockJSClient.js\");\nvar retries = 0;\nvar client = null;\n\nvar socket = function initSocket(url, handlers) {\n  client = new Client(url);\n  client.onOpen(function () {\n    retries = 0;\n  });\n  client.onClose(function () {\n    if (retries === 0) {\n      handlers.close();\n    } // Try to reconnect.\n\n\n    client = null; // After 10 retries stop trying, to prevent logspam.\n\n    if (retries <= 10) {\n      // Exponentially increase timeout to reconnect.\n      // Respectfully copied from the package `got`.\n      // eslint-disable-next-line no-mixed-operators, no-restricted-properties\n      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;\n      retries += 1;\n      setTimeout(function () {\n        socket(url, handlers);\n      }, retryInMs);\n    }\n  });\n  client.onMessage(function (data) {\n    var msg = JSON.parse(data);\n\n    if (handlers[msg.type]) {\n      handlers[msg.type](msg.data);\n    }\n  });\n};\n\nmodule.exports = socket;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)-dev-server/client/clients/SockJSClient.js */ \"./node_modules/webpack-dev-server/client/clients/SockJSClient.js\")))\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/socket.js?"
        );

        /***/
      },

    /***/
    /*!************************************************************!*\
  !*** (webpack)-dev-server/client/utils/createSocketUrl.js ***!
  \************************************************************/
    './node_modules/webpack-dev-server/client/utils/createSocketUrl.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n/* global self */\n\nvar url = __webpack_require__(/*! url */ \"./node_modules/url/url.js\");\n\nvar getCurrentScriptSource = __webpack_require__(/*! ./getCurrentScriptSource */ \"./node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js\");\n\nfunction createSocketUrl(resourceQuery, currentLocation) {\n  var urlParts;\n\n  if (typeof resourceQuery === 'string' && resourceQuery !== '') {\n    // If this bundle is inlined, use the resource query to get the correct url.\n    // format is like `?http://0.0.0.0:8096&sockPort=8097&sockHost=localhost`\n    urlParts = url.parse(resourceQuery // strip leading `?` from query string to get a valid URL\n    .substr(1) // replace first `&` with `?` to have a valid query string\n    .replace('&', '?'), true);\n  } else {\n    // Else, get the url from the <script> this file was called with.\n    var scriptHost = getCurrentScriptSource();\n    urlParts = url.parse(scriptHost || '/', true, true);\n  } // Use parameter to allow passing location in unit tests\n\n\n  if (typeof currentLocation === 'string' && currentLocation !== '') {\n    currentLocation = url.parse(currentLocation);\n  } else {\n    currentLocation = self.location;\n  }\n\n  return getSocketUrl(urlParts, currentLocation);\n}\n/*\n * Gets socket URL based on Script Source/Location\n * (scriptSrc: URL, location: URL) -> URL\n */\n\n\nfunction getSocketUrl(urlParts, loc) {\n  var auth = urlParts.auth,\n      query = urlParts.query;\n  var hostname = urlParts.hostname,\n      protocol = urlParts.protocol,\n      port = urlParts.port;\n\n  if (!port || port === '0') {\n    port = loc.port;\n  } // check ipv4 and ipv6 `all hostname`\n  // why do we need this check?\n  // hostname n/a for file protocol (example, when using electron, ionic)\n  // see: https://github.com/webpack/webpack-dev-server/pull/384\n\n\n  if ((hostname === '0.0.0.0' || hostname === '::') && loc.hostname && loc.protocol.indexOf('http') === 0) {\n    hostname = loc.hostname;\n  } // `hostname` can be empty when the script path is relative. In that case, specifying\n  // a protocol would result in an invalid URL.\n  // When https is used in the app, secure websockets are always necessary\n  // because the browser doesn't accept non-secure websockets.\n\n\n  if (hostname && hostname !== '127.0.0.1' && (loc.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {\n    protocol = loc.protocol;\n  } // all of these sock url params are optionally passed in through\n  // resourceQuery, so we need to fall back to the default if\n  // they are not provided\n\n\n  var sockHost = query.sockHost || hostname;\n  var sockPath = query.sockPath || '/sockjs-node';\n  var sockPort = query.sockPort || port;\n\n  if (sockPort === 'location') {\n    sockPort = loc.port;\n  }\n\n  return url.format({\n    protocol: protocol,\n    auth: auth,\n    hostname: sockHost,\n    port: sockPort,\n    // If sockPath is provided it'll be passed in via the resourceQuery as a\n    // query param so it has to be parsed out of the querystring in order for the\n    // client to open the socket to the correct location.\n    pathname: sockPath\n  });\n}\n\nmodule.exports = createSocketUrl;\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/utils/createSocketUrl.js?"
        );

        /***/
      },

    /***/
    /*!*******************************************************************!*\
  !*** (webpack)-dev-server/client/utils/getCurrentScriptSource.js ***!
  \*******************************************************************/
    './node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n\nfunction getCurrentScriptSource() {\n  // `document.currentScript` is the most accurate way to find the current script,\n  // but is not supported in all browsers.\n  if (document.currentScript) {\n    return document.currentScript.getAttribute('src');\n  } // Fall back to getting all scripts in the document.\n\n\n  var scriptElements = document.scripts || [];\n  var currentScript = scriptElements[scriptElements.length - 1];\n\n  if (currentScript) {\n    return currentScript.getAttribute('src');\n  } // Fail as there was no script to use.\n\n\n  throw new Error('[WDS] Failed to get current script source.');\n}\n\nmodule.exports = getCurrentScriptSource;\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/utils/getCurrentScriptSource.js?"
        );

        /***/
      },

    /***/
    /*!************************************************!*\
  !*** (webpack)-dev-server/client/utils/log.js ***!
  \************************************************/
    './node_modules/webpack-dev-server/client/utils/log.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n\nvar log = __webpack_require__(/*! loglevel */ \"./node_modules/loglevel/lib/loglevel.js\").getLogger('webpack-dev-server');\n\nvar INFO = 'info';\nvar WARN = 'warn';\nvar ERROR = 'error';\nvar DEBUG = 'debug';\nvar TRACE = 'trace';\nvar SILENT = 'silent'; // deprecated\n// TODO: remove these at major released\n// https://github.com/webpack/webpack-dev-server/pull/1825\n\nvar WARNING = 'warning';\nvar NONE = 'none'; // Set the default log level\n\nlog.setDefaultLevel(INFO);\n\nfunction setLogLevel(level) {\n  switch (level) {\n    case INFO:\n    case WARN:\n    case ERROR:\n    case DEBUG:\n    case TRACE:\n      log.setLevel(level);\n      break;\n    // deprecated\n\n    case WARNING:\n      // loglevel's warning name is different from webpack's\n      log.setLevel('warn');\n      break;\n    // deprecated\n\n    case NONE:\n    case SILENT:\n      log.disableAll();\n      break;\n\n    default:\n      log.error(\"[WDS] Unknown clientLogLevel '\".concat(level, \"'\"));\n  }\n}\n\nmodule.exports = {\n  log: log,\n  setLogLevel: setLogLevel\n};\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/utils/log.js?"
        );

        /***/
      },

    /***/
    /*!******************************************************!*\
  !*** (webpack)-dev-server/client/utils/reloadApp.js ***!
  \******************************************************/
    './node_modules/webpack-dev-server/client/utils/reloadApp.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n/* global WorkerGlobalScope self */\n\nvar _require = __webpack_require__(/*! ./log */ \"./node_modules/webpack-dev-server/client/utils/log.js\"),\n    log = _require.log;\n\nfunction reloadApp(_ref, _ref2) {\n  var hotReload = _ref.hotReload,\n      hot = _ref.hot,\n      liveReload = _ref.liveReload;\n  var isUnloading = _ref2.isUnloading,\n      currentHash = _ref2.currentHash;\n\n  if (isUnloading || !hotReload) {\n    return;\n  }\n\n  if (hot) {\n    log.info('[WDS] App hot update...');\n\n    var hotEmitter = __webpack_require__(/*! webpack/hot/emitter */ \"./node_modules/webpack/hot/emitter.js\");\n\n    hotEmitter.emit('webpackHotUpdate', currentHash);\n\n    if (typeof self !== 'undefined' && self.window) {\n      // broadcast update to window\n      self.postMessage(\"webpackHotUpdate\".concat(currentHash), '*');\n    }\n  } // allow refreshing the page only if liveReload isn't disabled\n  else if (liveReload) {\n      var rootWindow = self; // use parent window for reload (in case we're in an iframe with no valid src)\n\n      var intervalId = self.setInterval(function () {\n        if (rootWindow.location.protocol !== 'about:') {\n          // reload immediately if protocol is valid\n          applyReload(rootWindow, intervalId);\n        } else {\n          rootWindow = rootWindow.parent;\n\n          if (rootWindow.parent === rootWindow) {\n            // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways\n            applyReload(rootWindow, intervalId);\n          }\n        }\n      });\n    }\n\n  function applyReload(rootWindow, intervalId) {\n    clearInterval(intervalId);\n    log.info('[WDS] App updated. Reloading...');\n    rootWindow.location.reload();\n  }\n}\n\nmodule.exports = reloadApp;\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/utils/reloadApp.js?"
        );

        /***/
      },

    /***/
    /*!********************************************************!*\
  !*** (webpack)-dev-server/client/utils/sendMessage.js ***!
  \********************************************************/
    './node_modules/webpack-dev-server/client/utils/sendMessage.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        'use strict';
        eval(
          "\n/* global __resourceQuery WorkerGlobalScope self */\n// Send messages to the outside, so plugins can consume it.\n\nfunction sendMsg(type, data) {\n  if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {\n    self.postMessage({\n      type: \"webpack\".concat(type),\n      data: data\n    }, '*');\n  }\n}\n\nmodule.exports = sendMsg;\n\n//# sourceURL=webpack:///(webpack)-dev-server/client/utils/sendMessage.js?"
        );

        /***/
      },

    /***/
    /*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
    './node_modules/webpack/buildin/global.js':
      /*! no static exports found */
      /***/
      function (module, exports) {
        eval(
          'var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function("return this")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === "object") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it\'s\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?'
        );

        /***/
      },

    /***/
    /*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
    './node_modules/webpack/buildin/module.js':
      /*! no static exports found */
      /***/
      function (module, exports) {
        eval(
          'module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, "loaded", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, "id", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?'
        );

        /***/
      },

    /***/
    /*!*************************************************!*\
  !*** (webpack)/hot sync nonrecursive ^\.\/log$ ***!
  \*************************************************/
    './node_modules/webpack/hot sync ^\\.\\/log$':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          'var map = {\n\t"./log": "./node_modules/webpack/hot/log.js"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error("Cannot find module \'" + req + "\'");\n\t\te.code = \'MODULE_NOT_FOUND\';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = "./node_modules/webpack/hot sync ^\\\\.\\\\/log$";\n\n//# sourceURL=webpack:///(webpack)/hot_sync_nonrecursive_^\\.\\/log$?'
        );

        /***/
      },

    /***/
    /*!***********************************!*\
  !*** (webpack)/hot/dev-server.js ***!
  \***********************************/
    './node_modules/webpack/hot/dev-server.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          '/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals window __webpack_hash__ */\nif (true) {\n\tvar lastHash;\n\tvar upToDate = function upToDate() {\n\t\treturn lastHash.indexOf(__webpack_require__.h()) >= 0;\n\t};\n\tvar log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");\n\tvar check = function check() {\n\t\tmodule.hot\n\t\t\t.check(true)\n\t\t\t.then(function(updatedModules) {\n\t\t\t\tif (!updatedModules) {\n\t\t\t\t\tlog("warning", "[HMR] Cannot find update. Need to do a full reload!");\n\t\t\t\t\tlog(\n\t\t\t\t\t\t"warning",\n\t\t\t\t\t\t"[HMR] (Probably because of restarting the webpack-dev-server)"\n\t\t\t\t\t);\n\t\t\t\t\twindow.location.reload();\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (!upToDate()) {\n\t\t\t\t\tcheck();\n\t\t\t\t}\n\n\t\t\t\t__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);\n\n\t\t\t\tif (upToDate()) {\n\t\t\t\t\tlog("info", "[HMR] App is up to date.");\n\t\t\t\t}\n\t\t\t})\n\t\t\t.catch(function(err) {\n\t\t\t\tvar status = module.hot.status();\n\t\t\t\tif (["abort", "fail"].indexOf(status) >= 0) {\n\t\t\t\t\tlog(\n\t\t\t\t\t\t"warning",\n\t\t\t\t\t\t"[HMR] Cannot apply update. Need to do a full reload!"\n\t\t\t\t\t);\n\t\t\t\t\tlog("warning", "[HMR] " + log.formatError(err));\n\t\t\t\t\twindow.location.reload();\n\t\t\t\t} else {\n\t\t\t\t\tlog("warning", "[HMR] Update failed: " + log.formatError(err));\n\t\t\t\t}\n\t\t\t});\n\t};\n\tvar hotEmitter = __webpack_require__(/*! ./emitter */ "./node_modules/webpack/hot/emitter.js");\n\thotEmitter.on("webpackHotUpdate", function(currentHash) {\n\t\tlastHash = currentHash;\n\t\tif (!upToDate() && module.hot.status() === "idle") {\n\t\t\tlog("info", "[HMR] Checking for updates on the server...");\n\t\t\tcheck();\n\t\t}\n\t});\n\tlog("info", "[HMR] Waiting for update signal from WDS...");\n} else {}\n\n\n//# sourceURL=webpack:///(webpack)/hot/dev-server.js?'
        );

        /***/
      },

    /***/
    /*!********************************!*\
  !*** (webpack)/hot/emitter.js ***!
  \********************************/
    './node_modules/webpack/hot/emitter.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          'var EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");\nmodule.exports = new EventEmitter();\n\n\n//# sourceURL=webpack:///(webpack)/hot/emitter.js?'
        );

        /***/
      },

    /***/
    /*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
    './node_modules/webpack/hot/log-apply-result.js':
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          '/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t"warning",\n\t\t\t"[HMR] The following modules couldn\'t be hot updated: (They would need a full reload!)"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog("warning", "[HMR]  - " + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog("info", "[HMR] Nothing hot updated.");\n\t} else {\n\t\tlog("info", "[HMR] Updated modules:");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {\n\t\t\t\tvar parts = moduleId.split("!");\n\t\t\t\tlog.groupCollapsed("info", "[HMR]  - " + parts.pop());\n\t\t\t\tlog("info", "[HMR]  - " + moduleId);\n\t\t\t\tlog.groupEnd("info");\n\t\t\t} else {\n\t\t\t\tlog("info", "[HMR]  - " + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === "number";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t"info",\n\t\t\t\t"[HMR] Consider using the NamedModulesPlugin for module names."\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?'
        );

        /***/
      },

    /***/
    /*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
    './node_modules/webpack/hot/log.js':
      /*! no static exports found */
      /***/
      function (module, exports) {
        eval(
          'var logLevel = "info";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === "info" && level === "info") ||\n\t\t(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||\n\t\t(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === "info") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === "warning") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === "error") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\nmodule.exports.formatError = function(err) {\n\tvar message = err.message;\n\tvar stack = err.stack;\n\tif (!stack) {\n\t\treturn message;\n\t} else if (stack.indexOf(message) < 0) {\n\t\treturn message + "\\n" + stack;\n\t} else {\n\t\treturn stack;\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?'
        );

        /***/
      },

    /***/
    /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
    './src/index.js':
      /*! no exports provided */
      /***/
      function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./log */ "./src/log.js");\n\n\nfunction setTimer() {\n  let count = 0;\n  const h = document.createElement(\'h2\');\n  document.body.appendChild(h);\n\n  function updateContent() {\n    h.innerHTML = "page alive for ".concat(count++, " seconds");\n  }\n\n  updateContent();\n  return setInterval(updateContent, 1000);\n}\n\nsetTimer();\nObject(_log__WEBPACK_IMPORTED_MODULE_0__["default"])();\n\nif (true) {\n  module.hot.accept(/*! ./log.js */ "./src/log.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./log.js */ "./src/log.js");\n(() => {\n    Object(_log__WEBPACK_IMPORTED_MODULE_0__["default"])();\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));\n}\n\n//# sourceURL=webpack:///./src/index.js?'
        );

        /***/
      },

    /***/
    /*!********************!*\
  !*** ./src/log.js ***!
  \********************/
    './src/log.js':
      /*! exports provided: default */
      /***/
      function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          "__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return log; });\nfunction log() {\n  const h4 = document.createElement('h4');\n  h4.innerHTML = 'hello, world';\n  document.body.appendChild(h4);\n}\n\n//# sourceURL=webpack:///./src/log.js?"
        );

        /***/
      },

    /***/
    /*!**********************************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://localhost:8808 (webpack)/hot/dev-server.js ./src/index.js ***!
  \**********************************************************************************************************/
    0:
      /*! no static exports found */
      /***/
      function (module, exports, __webpack_require__) {
        eval(
          '__webpack_require__(/*! D:\\workspace\\hot-module-replacement-under-the-hood\\simple-HMR-demo\\node_modules\\webpack-dev-server\\client\\index.js?http://localhost:8808 */"./node_modules/webpack-dev-server/client/index.js?http://localhost:8808");\n__webpack_require__(/*! D:\\workspace\\hot-module-replacement-under-the-hood\\simple-HMR-demo\\node_modules\\webpack\\hot\\dev-server.js */"./node_modules/webpack/hot/dev-server.js");\nmodule.exports = __webpack_require__(/*! D:\\workspace\\hot-module-replacement-under-the-hood\\simple-HMR-demo\\src\\index.js */"./src/index.js");\n\n\n//# sourceURL=webpack:///multi_(webpack)-dev-server/client?'
        );

        /***/
      },
    /******/
  }
);
