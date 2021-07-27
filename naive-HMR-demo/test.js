const T = require('webpack').Template;
const H = T.getFunctionContent(
  require('./node_modules/webpack/lib/HotModuleReplacement.runtime')
);
const h = T.getFunctionContent(require('./client/HMR-runtime'));

h.replace(/\$require\$/g, (...args) => {
  console.log('in replace', args);
});

// if (true) {\n  module.hot.accept(/*! ./dialog-content.jsx */ "./src/dialog-content.jsx", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _dialog_content__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dialog-content.jsx */ "./src/dialog-content.jsx");\n(() => {\n    render();\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));\n}
