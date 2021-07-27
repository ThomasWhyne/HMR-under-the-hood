/*global $hash$ $requestTimeout$ installedModules $require$ hotDownloadManifest hotDownloadUpdateChunk hotDisposeChunk modules */
module.exports = function () {
  let hotCurrentHash = $hash$;
  const hotRequestTimeout = 16000;
  const hotCurrentModule = {};
  const hotCurrentModuleData = {};
  let hotCurrentChildModule,
    hotCurrentParents = [],
    hotCurrentParentsTemp;

  let hotUpdate, hotUpdateNewHash;

  let hotDeferred,
    hotRequestedFilesMap = {},
    hotWaitingFilesMap = {},
    hotAvailableFilesMap = {};
  // require wrapper
  function hotCreateRequire(moduleId) {
    const m = installedModules[moduleId];
    console.log('[hotCreateRequire] installedModule', m);
    if (!m) return $require$;
    function fn(request) {
      // builds runtime relationship
      if (installedModules[request]) {
        if (!installedModules[request].parents.includes(request))
          installedModules[request].parents.push(request);
      } else {
        hotCurrentParents = [moduleId];
        hotCurrentChildModule = request;
      }
      if (!m.children.includes(request)) m.children.push(request);
      return $require$(request);
    }
    for (const name in $require$) {
      if (Object.prototype.hasOwnProperty.call($require$, name)) {
        fn[name] = $require$[name];
      }
    }
    return fn;
  }
  // injects hot api to moduels
  function hotCreateModule(moduleId) {
    const hot = {
      _acceptedDependencies: {},
      _main: hotCurrentChildModule !== moduleId,

      // HMR plugin uses identifier evaluation
      hot: true,
      active: true,
      // data: hotCurrentModuleData[moduleId],
      accept(dep, callback) {
        dep = typeof dep === 'string' ? [dep] : dep;
        if (!Array.isArray(dep)) return;
        dep.forEach((d) => {
          hot._acceptedDependencies[d] = callback;
        });
      },
      check: hotCheck,
      apply: hotApply,
    };
    hotCurrentChildModule = undefined;
    return hot;
  }
  function hotCheck(apply) {
    return hotDownloadManifest().then((update) => {
      if (!update) return;
      hotRequestedFilesMap = {};
      hotWaitingFilesMap = {};
      hotAvailableFilesMap = update.c;
      hotUpdateNewHash = update.h;

      const promise = new Promise((resolve, reject) => {
        hotDeferred = {
          resolve,
          reject,
        };
        hotUpdate = {};
      });

      /*foreachInstalledChunks*/
      {
        hotEnsureUpdateChunk(chunkId);
      }
      return promise;
    });
  }
  function hotApply() {
    let outdatedDependencies = {},
      outdatedModules = [],
      appliedUpdate = {};
    function getAllAffectedStuff(updateModuleId) {
      const outdatedDependencies = {};
      const outdatedModules = [updateModuleId];
      let queue = outdatedModules.slice().map((id) => ({
        chain: [id],
        id,
      }));
      while (queue.length) {
        const queueItem = queue.pop();
        const moduleId = queueItem.id;
        const { chain } = queueItem;
        iModule = installedModules[moduleId];
        if (!iModule) continue;
        if (iModule.hot._main)
          return {
            type: 'unaccepted',
            chain,
            moduleId,
          };
        for (let i = 0; i < iModule.parents.length; i++) {
          const parentId = iModule.parents[i];
          const parent = installedModules[parentId];
          if (!parent) continue;
          if (outdatedModules.includes(parentId)) continue;
          if (parent.hot._acceptedDependencies[moduleId]) {
            if (!outdatedDependencies[parentId])
              outdatedDependencies[parentId] = [];
            outdatedDependencies[parentId].push(moduleId);
            continue;
          }
          delete outdatedDependencies[parentId];
          outdatedModules.push(parentId);
          queue.push({
            chain: chain.concat([parentId]),
            id: parentId,
          });
        }
      }
      return {
        type: 'accepted',
        moduleId: updateModuleId,
        outdatedModules,
        outdatedDependencies,
      };
    }
    let abortError = false,
      doApply = false;
    for (const id in hotUpdate) {
      let result = getAllAffectedStuff(id);
      console.log('[hotApply] affectec update result', result);
      switch (result.type) {
        case 'unaccepted':
          abortError = new Error(`abort for update in ${id} is not accepted`);
          break;
        case 'accepted':
          doApply = true;
          break;
        default:
          throw new Error('unexpected type of result', result.type);
      }
      if (abortError) return Promise.reject(abortError);
      if (doApply) {
        appliedUpdate[id] = hotUpdate[id];
        outdatedModules = outdatedModules.concat(result.outdatedModules);
        for (const moduleId in result.outdatedDependencies) {
          if (!outdatedDependencies[moduleId])
            outdatedDependencies[moduleId] = [];
          outdatedDependencies[moduleId] = outdatedDependencies[
            moduleId
          ].concat(result.outdatedDependencies[moduleId]);
        }
      }
    }

    const queue = outdatedModules.slice();
    while (queue.length > 0) {
      const outdatedModuleId = queue.pop();
      const iModule = installedModules[outdatedModuleId];
      if (!iModule) continue;
      iModule.hot.active = false;
      delete installedModules[outdatedModuleId];
      delete outdatedDependencies[outdatedModuleId];
      // remove "parents" references from all children
      for (let i = 0; i < iModule.children.length; i++) {
        const child = installedModules[iModule.children[i]];
        if (!child) continue;
        const parentIdx = child.parents.indexOf(outdatedModuleId);
        if (parentIdx >= 0) child.parents.splice(idx, 1);
      }
    }

    // remove outdated dependency from module children
    let dependency, moduleOutdatedDependencies;
    for (const outdatedModuleIdInDep in outdatedDependencies) {
      const iModuleInDep = installedModules[outdatedModuleIdInDep];
      if (iModuleInDep) {
        moduleOutdatedDependencies =
          outdatedDependencies[outdatedModuleIdInDep];
        for (let j = 0; j < moduleOutdatedDependencies.length; j++) {
          dependency = moduleOutdatedDependencies[j];
          const childIdx = iModuleInDep.children.indexOf(dependency);
          if (childIdx >= 0) iModuleInDep.children.splice(childIdx, 1);
        }
      }
    }

    hotCurrentHash = hotUpdateNewHash;

    // insert new code
    for (const appliedModuleId in appliedUpdate) {
      modules[appliedModuleId] = appliedUpdate[appliedModuleId];
    }

    let errorThrown;
    for (const outdateModuleIdAccept in outdatedDependencies) {
      const outdatedModuleAccept = installedModules[outdateModuleIdAccept];
      if (outdatedModuleAccept) {
        moduleOutdatedDependencies =
          outdatedDependencies[outdateModuleIdAccept];
        const callbacks = [];
        for (let c = 0; c < moduleOutdatedDependencies.length; c++) {
          dependency = moduleOutdatedDependencies[c];
          const cb = outdatedModuleAccept.hot._acceptedDependencies[dependency];
          if (cb) callbacks.push(cb);
        }
        for (let k = 0; k < callbacks.length; k++) {
          const cb = callbacks[k];
          try {
            cb(moduleOutdatedDependencies);
          } catch (error) {
            if (!errorThrown) errorThrown = error;
          }
        }
      }
    }
    if (errorThrown) return Promise.reject(errorThrown);
    return new Promise((resolve) => resolve(outdatedModules));
  }

  function hotDownloadManifest() {
    console.log('[HMR-runtime hotDownloadManifest]', 'downloading manifest..');
    return fetch(`${hotCurrentHash}.hot-update.json`).then((response) =>
      response.json()
    );
  }

  function hotEnsureUpdateChunk(chunkId) {
    console.log(
      '[HMR-runtime hotEnsureUpdateChunk]',
      'downloading hotUpdateFile..'
    );
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.src = `${chunkId}.${hotCurrentHash}.hot-update.js`;
    head.appendChild(script);
  }

  function hotUpdateDownloaded() {
    let defered = hotDeferred;
    hotDeferred = null;
    if (!defered) return;
    Promise.resolve()
      .then(() => hotApply())
      .then((result) => defered.resolve(result))
      .catch((err) => {
        alert(`hot apply failed ${err.message}`);
        defered.reject(err);
      });
  }

  window['webpackHotUpdate'] = function (chunkId, moreModules) {
    console.log(
      '[HMR-runtime webpackHotUpdate]',
      'webpackHotUpdate callback triggered',
      moreModules
    );
    for (const moduleId in moreModules) {
      hotUpdate[moduleId] = moreModules[moduleId];
    }
    console.log('[HMR-runtime webpackHotUpdate] hotUpdate', hotUpdate);
    hotUpdateDownloaded();
  };
};
