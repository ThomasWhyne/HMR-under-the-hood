/******/ (function (modules) {
  // webpackBootstrap
  /******/ const hotCurrentHash = '92c7e9825563f7aab75b';
  /******/ const hotRequestTimeout = 16000;
  /******/ const hotCurrentModule = {};
  /******/ const hotCurrentModuleData = {};
  /******/ let hotCurrentChildModule,
    /******/ hotCurrentParents = [],
    /******/ hotCurrentParentsTemp;
  /******/
  /******/ let hotUpdate, hotUpdateNewHash;
  /******/
  /******/ let hotDeferred,
    /******/ hotRequestedFilesMap = {},
    /******/ hotWaitingFilesMap = {},
    /******/ hotAvailableFilesMap = {}; // require wrapper
  /******/ /******/ function hotCreateRequire(moduleId) {
    /******/ const m = installedModules[moduleId];
    /******/ console.log(m);
    /******/ if (!m) return __webpack_require__;
    /******/ function fn(request) {
      /******/ // builds runtime relationship
      /******/ if (installedModules[request]) {
        /******/ if (!installedModules[request].parents.includes(request))
          /******/ installedModules[request].parents.push(request);
        /******/
      } else {
        /******/ hotCurrentParents = [moduleId];
        /******/ hotCurrentChildModule = request;
        /******/
      }
      /******/ if (!m.children.includes(request)) m.children.push(request);
      /******/ return __webpack_require__(request);
      /******/
    }
    /******/ for (const name in __webpack_require__) {
      /******/ if (
        Object.prototype.hasOwnProperty.call(__webpack_require__, name)
      ) {
        /******/ fn[name] = __webpack_require__[name];
        /******/
      }
      /******/
    }
    /******/ return fn;
    /******/
  } // injects hot api to moduels
  /******/ /******/ function hotCreateModule(moduleId) {
    /******/ const hot = {
      /******/ _acceptedDependencies: {},
      /******/ _main: hotCurrentChildModule !== moduleId, // HMR plugin uses identifier evaluation
      /******/
      /******/ /******/ hot: true,
      /******/ active: true, // data: hotCurrentModuleData[moduleId],
      /******/ /******/ accept(dep, callback) {
        /******/ dep = typeof dep === 'string' ? [dep] : dep;
        /******/ if (!Array.isArray(dep)) return;
        /******/ dep.forEach((d) => {
          /******/ hot._acceptedDependencies[d] = callback;
          /******/
        });
        /******/
      },
      /******/ check: hotCheck,
      /******/ apply: hotApply,
      /******/
    };
    /******/ hotCurrentChildModule = undefined;
    /******/ return hot;
    /******/
  }
  /******/ function hotCheck(apply) {
    /******/ return hotDownloadManifest().then((update) => {
      /******/ if (!update) return;
      /******/ hotRequestedFilesMap = {};
      /******/ hotWaitingFilesMap = {};
      /******/ hotAvailableFilesMap = update.c;
      /******/ hotUpdateNewHash = update.h;
      /******/
      /******/ const promise = new Promise((resolve, reject) => {
        /******/ hotDeferred = {
          /******/ resolve,
          /******/ reject,
          /******/
        };
        /******/ hotUpdate = {};
        /******/
      });
      /******/
      /******/ var chunkId = 'main';
      /******/ {
        /******/ hotEnsureUpdateChunk(chunkId);
        /******/
      }
      /******/
    });
    /******/
  }
  /******/ function hotApply() {
    /******/ let outdatedDependencies = {},
      /******/ outdatedModules = [],
      /******/ appliedUpdate = {};
    /******/ function getAllAffectedStuff(updateModuleId) {
      /******/ const outdatedDependencies = {};
      /******/ const outdatedModules = [];
      /******/ let queue = outdatedModules.slice().map((id) => ({
        /******/ chain: [id],
        /******/ id,
        /******/
      }));
      /******/ while (queue.length) {
        /******/ const queueItem = queue.pop();
        /******/ const moduleId = queueItem.id;
        /******/ const { chain } = queueItem;
        /******/ iModule = installedModules[moduleId];
        /******/ if (!iModule) continue;
        /******/ if (iModule.hot._main)
          /******/ return {
            /******/ type: 'unaccepted',
            /******/ chain,
            /******/ moduleId,
            /******/
          };
        /******/ for (let i = 0; i < iModule.parents.length; i++) {
          /******/ const parentId = iModule.parents[i];
          /******/ const parent = installedModules[parentId];
          /******/ if (!parent) continue;
          /******/ if (outdatedModules.includes(parentId)) continue;
          /******/ if (parent.hot._acceptedDependencies[moduleId]) {
            /******/ if (!outdatedDependencies[parentId])
              /******/ outdatedDependencies[parentId] = [];
            /******/ outdatedDependencies[parentId].push(moduleId);
            /******/ continue;
            /******/
          }
          /******/ delete outdatedDependencies[parentId];
          /******/ outdatedModules.push(parentId);
          /******/ queue.push({
            /******/ chain: chain.concat([parentId]),
            /******/ id: parentId,
            /******/
          });
          /******/
        }
        /******/
      }
      /******/ return {
        /******/ type: 'accepted',
        /******/ moduleId: updateModuleId,
        /******/ outdatedModules,
        /******/ outdatedDependencies,
        /******/
      };
      /******/
    }
    /******/ let abortError = false,
      /******/ doApply = false;
    /******/ for (const id in hotUpdate) {
      /******/ let result = getAllAffectedStuff(id);
      /******/ console.log('[hotApply] affectec update result', result);
      /******/ switch (result.type) {
        /******/ case 'unaccepted':
          /******/ abortError = new Error(
            `abort for update in ${id} is not accepted`
          );
          /******/ break;
        /******/ case 'accepted':
          /******/ doApply = true;
          /******/ break;
        /******/ default:
          /******/ throw new Error('unexpected type of result', result.type);
        /******/
      }
      /******/ if (abortError) return Promise.reject(abortError);
      /******/ if (doApply) {
        /******/ appliedUpdate[id] = hotUpdate[id];
        /******/ outdatedModules = outdatedModules.concat(
          result.outdatedModules
        );
        /******/ for (const moduleId in result.outdatedDependencies) {
          /******/ if (!outdatedDependencies[moduleId])
            /******/ outdatedDependencies[moduleId] = [];
          /******/ outdatedDependencies[
            moduleId
          ] = outdatedDependencies /******/[
            moduleId
            /******/
          ]
            .concat(result.outdatedDependencies[moduleId]);
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
    /******/ const queue = outdatedModules.slice();
    /******/ while (queue.length > 0) {
      /******/ const outdatedModuleId = queue.pop();
      /******/ const iModule = installedModules[outdatedModuleId];
      /******/ if (!iModule) continue;
      /******/ iModule.hot.active = false;
      /******/ delete installedModules[outdatedModuleId];
      /******/ delete outdatedDependencies[outdatedModuleId]; // remove "parents" references from all children
      /******/ /******/ for (let i = 0; i < iModule.children.length; i++) {
        /******/ const child = installedModules[iModule.children[i]];
        /******/ if (!child) continue;
        /******/ const parentIdx = child.parents.indexOf(outdatedModuleId);
        /******/ if (parentIdx >= 0) child.parents.splice(idx, 1);
        /******/
      }
      /******/
    } // remove outdated dependency from module children
    /******/
    /******/ /******/ let dependency, moduleOutdatedDependencies;
    /******/ for (const outdatedModuleIdInDep in outdatedDependencies) {
      /******/ const iModuleInDep = installedModules[outdatedModuleIdInDep];
      /******/ if (iModuleInDep) {
        /******/ moduleOutdatedDependencies =
          outdatedDependencies[iModuleInDep];
        /******/ for (let j = 0; j < moduleOutdatedDependencies.length; j++) {
          /******/ dependency = moduleOutdatedDependencies[j];
          /******/ const childIdx = iModuleInDep.children.indexOf(dependency);
          /******/ if (childIdx >= 0) iModuleInDep.children.splice(idx, 1);
          /******/
        }
        /******/
      }
      /******/
    } // insert new code
    /******/
    /******/ /******/ for (const appliedModuleId in appliedUpdate) {
      /******/ modules[appliedModuleId] = appliedUpdate[appliedModuleId];
      /******/
    }
    /******/
    /******/ let errorThrown;
    /******/ for (const outdateModuleIdAccept in outdatedDependencies) {
      /******/ const outdatedModuleAccept =
        installedModules[outdateModuleIdAccept];
      /******/ if (outdatedModuleAccept) {
        /******/ moduleOutdatedDependencies =
          /******/ outdatedDependencies[outdateModuleIdAccept];
        /******/ const callbacks = [];
        /******/ for (let c = 0; c < moduleOutdatedDependencies.length; c++) {
          /******/ dependency = moduleOutdatedDependencies[c];
          /******/ const cb =
            /******/ outdateModuleIdAccept.hot._acceptedDependencies[
              dependency
            ];
          /******/ if (cb) callbacks.push(cb);
          /******/
        }
        /******/ for (let k = 0; k < callbacks.length; k++) {
          /******/ const cb = callbacks[k];
          /******/ try {
            /******/ cb(moduleOutdatedDependencies);
            /******/
          } catch (error) {
            /******/ if (!errorThrown) errorThrown = error;
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    }
    /******/ if (errorThrown) return Promise.reject(errorThrown);
    /******/ return new Promise((resolve) => resolve(outdatedModules));
    /******/
  }
  /******/
  /******/ function hotDownloadManifest() {
    /******/ return fetch(
      '92c7e9825563f7aab75b.hot-update.json'
    ).then((response) => response.json());
    /******/
  }
  /******/
  /******/ function hotEnsureUpdateChunk(chunkId) {
    /******/ if (hotWaitingFilesMap[chunkId]) {
      /******/ const head = document.getElementsByTagName('head')[0];
      /******/ const script = document.createElement('script');
      /******/ script.src = 'main.92c7e9825563f7aab75b.hot-update.js';
      /******/ head.appendChild(script);
      /******/
    }
    /******/
  }
  /******/
  /******/ function hotUpdateDownloaded() {
    /******/ let defered = hotDeferred;
    /******/ hotDeferred = null;
    /******/ if (!defered) return;
    /******/ Promise.resolve()
      /******/ .then(() => hotApply())
      /******/ .then((result) => defered.resolve(result))
      /******/ .catch(defered.reject);
    /******/
  }
  /******/
  /******/ window['webpackHotUpdate'] = function (chunkId, moreModules) {
    /******/ for (const moduleId in moreModules) {
      /******/ hotUpdate[moduleId] = moreModules[moduleId];
      /******/
    }
    /******/ hotUpdateDownloaded();
    /******/
  }; // The module cache
  /******/
  /******/ /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/ hot: hotCreateModule(moduleId),
      /******/ parents:
        ((hotCurrentParentsTemp = hotCurrentParents),
        (hotCurrentParents = []),
        hotCurrentParentsTemp),
      /******/ children: [],
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      hotCreateRequire(moduleId)
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
      /******/
    }
    /******/
  }; // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function (exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module',
      });
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true });
    /******/
  }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value,
    });
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '/build/'; // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return hotCreateRequire(0)((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ './client/HMR-dev-server.js':
      /*!**********************************!*\
  !*** ./client/HMR-dev-server.js ***!
  \**********************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        eval(
          '/* WEBPACK VAR INJECTION */(function(module) {if (true) {\n  console.log(\'[HMR-dev-server.js] module\', module);\n} else {}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))\n\n//# sourceURL=webpack:///./client/HMR-dev-server.js?'
        );

        /***/
      },

    /***/ './client/client.js':
      /*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
      /*! no static exports found */
      /***/ function (module, exports) {
        eval(
          "let currentHash;\nconst messageHandler = {\n  connection(...args) {\n    console.log('[connection]', args);\n  },\n\n  hash(hash) {\n    console.log('[hash]', hash);\n    currentHash = hash;\n  },\n\n  // webpack HMR doesn't do it this way !!!\n  ok(hot) {\n    console.log('[ok]', hot);\n    if (!currentHash) return; // if (hot) {\n    //   console.log('')\n    // }\n  },\n\n  error(...args) {\n    console.error('[error]', args);\n    window.location.reload();\n  }\n\n};\nconst socket = io('ws://localhost:5555');\nObject.keys(messageHandler).forEach(k => {\n  socket.on(k, messageHandler[k]);\n});\n\n//# sourceURL=webpack:///./client/client.js?"
        );

        /***/
      },

    /***/ './node_modules/webpack/buildin/harmony-module.js':
      /*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
      /*! no static exports found */
      /***/ function (module, exports) {
        eval(
          'module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, "loaded", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, "id", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, "exports", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/harmony-module.js?'
        );

        /***/
      },

    /***/ './node_modules/webpack/buildin/module.js':
      /*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
      /*! no static exports found */
      /***/ function (module, exports) {
        eval(
          'module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, "loaded", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, "id", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?'
        );

        /***/
      },

    /***/ './src/index.js':
      /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
      /*! no exports provided */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          '__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./log */ "./src/log.js");\n\nObject(_log__WEBPACK_IMPORTED_MODULE_0__["default"])();\nObject(_log__WEBPACK_IMPORTED_MODULE_0__["default"])();\nObject(_log__WEBPACK_IMPORTED_MODULE_0__["default"])();\n\nif (true) {\n  console.log(\'[./src/index.js] module\', module);\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))\n\n//# sourceURL=webpack:///./src/index.js?'
        );

        /***/
      },

    /***/ './src/log.js':
      /*!********************!*\
  !*** ./src/log.js ***!
  \********************/
      /*! exports provided: default */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          '__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return log; });\nfunction log() {\n  document.write(\'<h2>Hello, World!</h2>\');\n}\n\n//# sourceURL=webpack:///./src/log.js?'
        );

        /***/
      },

    /***/ 0:
      /*!**************************************************************************!*\
  !*** multi ./client/HMR-dev-server.js ./client/client.js ./src/index.js ***!
  \**************************************************************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        eval(
          '__webpack_require__(/*! D:\\workspace\\hot-module-replacement-under-the-hood\\naive-HRM-demo\\client\\HMR-dev-server.js */"./client/HMR-dev-server.js");\n__webpack_require__(/*! D:\\workspace\\hot-module-replacement-under-the-hood\\naive-HRM-demo\\client\\client.js */"./client/client.js");\nmodule.exports = __webpack_require__(/*! D:\\workspace\\hot-module-replacement-under-the-hood\\naive-HRM-demo\\src\\index.js */"./src/index.js");\n\n\n//# sourceURL=webpack:///multi_./client/HMR-dev-server.js_./client/client.js_./src/index.js?'
        );

        /***/
      },

    /******/
  }
);
