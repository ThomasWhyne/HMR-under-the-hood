const path = require('path');
const util = require('./util');
const { RawSource } = require('webpack-sources');
const { Template } = require('webpack');
const ParserHelpers = require('./node_modules/webpack/lib/ParserHelpers');
const hrmRuntime = require('./client/HMR-runtime');

const hotInitCode = Template.getFunctionContent(hrmRuntime);

class NaiveHotModuleReplacementPlugin {
  constructor() {
    /**
     * @readonly
     * @const {'NaiveHotModuleReplacementPlugin'}
     */
    this.name = 'NaiveHotModuleReplacementPlugin';
  }

  /**
   * @param { import('webpack').Compiler } compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(
      this.name,
      /**
       * @param { import('webpack').Compilation } compilation
       */
      (compilation, { normalModuleFactory }) => {
        // record compilation|module|chunk hash
        compilation.hooks.record.tap(this.name, (compilation, records) => {
          if (compilation.hash === records.hash) return;
          records.hash = compilation.hash;
          records.moduleHashs = {};
          for (const module of compilation.modules) {
            const identifier = module.identifier();
            console.log('[module identifier]', identifier);
            const hash = util.createHash(
              compilation.outputOptions.hashFunction
            );
            module.updateHash(hash);
            records.moduleHashs[identifier] = hash.digest('hex');
          }
          records.chunkHashs = {};
          for (const chunk of compilation.chunks) {
            records.chunkHashs[chunk.id] = chunk.hash;
          }
          records.chunkModuleIds = {};
          for (const chunk of compilation.chunks) {
            records.chunkModuleIds[chunk.id] = Array.from(
              chunk.modulesIterable,
              (m) => m.id
            );
          }
          console.log('[records.chunkHashs]', records.chunkHashs);
        });
        let initialPass = false;
        let recompilation = false;
        compilation.hooks.afterHash.tap(this.name, () => {
          let records = compilation.records;
          if (!records) {
            initialPass = true;
            return;
          }
          if (!records.hash) initialPass = true;
          const preHash = records.preHash || 'x';
          const prepreHash = records.prepreHash || 'x';
          if (preHash === prepreHash) {
            recompilation = true;
            compilation.modifyHash(prepreHash);
            return;
          }
          records.prepreHash = records.hash || 'x';
          records.preHash = compilation.hash;
          compilation.modifyHash(records.prepreHash);
        });

        //  assets need additinal process
        compilation.hooks.needAdditionalPass.tap(
          this.name,
          () => !recompilation && !initialPass
        );
        // generates manifest and hot update file
        compilation.hooks.additionalChunkAssets.tap(this.name, () => {
          console.log(
            '[additionalChunkAssets] record hash',
            compilation.records.hash
          );
          console.log(
            '[additionalChunkAssets] compilation hash',
            compilation.hash
          );
          const { records } = compilation;
          if (records.hash === compilation.hash) return;
          if (
            !records.moduleHashs ||
            !records.chunkHashs ||
            !records.chunkModuleIds
          )
            return;
          for (const module of compilation.modules) {
            const identifier = module.identifier();
            let hash = util.createHash(compilation.outputOptions.hashFunction);
            module.updateHash(hash);
            hash = hash.digest('hex');
            module.hotUpdate = records.moduleHashs[identifier] !== hash;
          }

          const hotUpdateMainContent = {
            h: compilation.hash,
            c: {},
          };
          for (let chunkId of Object.keys(records.chunkHashs)) {
            const currentChunk = compilation.chunks.find(
              (chunk) => chunk.id == chunkId
            );
            if (currentChunk) {
              const newModules = currentChunk
                .getModules()
                .filter((m) => m.hotUpdate);
              console.log(
                '[additionalChunkAssets] newModules',
                newModules.map((m) => m.id)
              );
              const allModules = new Set();
              for (const module of currentChunk.modulesIterable) {
                allModules.add(module.id);
              }
              const removedModules = records.chunkModuleIds[chunkId].filter(
                (id) => !allModules.has(id)
              );
              console.log(
                '[additionalChunkAssets] removedModules',
                removedModules
              );
              if (newModules.length || removedModules.length) {
                const source = compilation.hotUpdateChunkTemplate.render(
                  chunkId,
                  newModules,
                  removedModules,
                  compilation.hash,
                  compilation.moduleTemplates.javascript,
                  compilation.dependencyTemplates
                );
                console.log(
                  '[additionalChunkAssets] hot-update.js source',
                  source
                );

                const filename = `${chunkId}.${records.hash}.hot-update.js`;
                compilation.additionalChunkAssets.push(filename);
                compilation.assets[filename] = source;
                hotUpdateMainContent.c[chunkId] = true;
                currentChunk.files.push(filename);
                // triggers for adding new chunk here
                compilation.hooks.chunkAsset.call(
                  this.name,
                  currentChunk,
                  filename
                );
              }
            } else {
              hotUpdateMainContent.c[chunkId] = false;
            }
          }
          const source = new RawSource(JSON.stringify(hotUpdateMainContent));
          const filename = `${records.hash}.hot-update.json`;
          console.log('[additionalChunkAssets] hot-update.json source', source);
          compilation.assets[filename] = source;
        });

        // now tweaks the mainTemplate
        const { mainTemplate } = compilation;
        mainTemplate.hooks.hash.tap(this.name, (hash) => {
          hash.update('NaiveHotMainTemplateDecorator');
        });
        // decorates require for modules
        mainTemplate.hooks.moduleRequire.tap(
          this.name,
          (_, chunk, hash, varModuleId) => {
            return `hotCreateRequire(${varModuleId})`;
          }
        );
        // inject HMR runtime
        mainTemplate.hooks.bootstrap.tap(this.name, (source, chunk, hash) => {
          // skip for simplicity
          // source = mainTemplate.hooks.hotBootstrap.call(source, chunk, hash);
          const replacedHotInitCode = hotInitCode
            .replace(/\$require\$/g, mainTemplate.requireFn)
            .replace(/\$hash\$/g, JSON.stringify(hash))
            // know it for sure
            .replace(
              /\/\*foreachInstalledChunks\*\//g,
              `var chunkId = ${JSON.stringify(chunk.id)}`
            )
            .replace(/\$manifestFilename\$/, `"${hash}.hot-update.json"`)
            .replace(
              /\$updateFilename\$/,
              `"${chunk.id}.${hash}.hot-update.js"`
            );
          // console.log(
          //   '[mainTemplate] bootstrap hotInitCode',
          //   replacedHotInitCode
          // );
          return Template.asString([source, '', replacedHotInitCode]);
        });

        mainTemplate.hooks.globalHash.tap(this.name, () => true);
        mainTemplate.hooks.currentHash.tap(this.name, (_, length) => {
          if (isFinite(length)) return `hotCurrentHash.substr(0, ${length})`;
          else return 'hotCurrentHash';
        });

        mainTemplate.hooks.moduleObj.tap(
          this.name,
          (source, chunk, hash, varModuleId) => {
            return Template.asString([
              `${source},`,
              `hot: hotCreateModule(${varModuleId}),`,
              'parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),',
              'children: []',
            ]);
          }
        );
        mainTemplate.hooks.requireExtensions.tap(this.name, (source) => {
          const buf = [source];
          buf.push('');
          buf.push('// __webpack_hash__');
          buf.push(
            mainTemplate.requireFn +
              '.h = function() { return hotCurrentHash; };'
          );
          return Template.asString(buf);
        });

        normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap(this.name, (parser, parserOptions) => {
            parser.hooks.expression
              .for('__webpack_hash__')
              .tap(
                this.name,
                ParserHelpers.toConstantDependencyWithWebpackRequire(
                  parser,
                  '__webpack_require__.h()'
                )
              );
          });
      }
    );
  }
}

module.exports = {
  mode: 'development',
  watch: true,
  entry: [
    path.join(__dirname, './client/HMR-dev-server.js'),
    path.join(__dirname, './client/client.js'),
    path.join(__dirname, './src/index.js'),
  ],
  output: {
    path: path.join(__dirname, './build'),
    publicPath: '/build/',
  },
  // devServer: {
  //   port: 3333,
  //   hot: true,
  //   inline: true,
  //   open: true,
  //   openPage: `http://127.0.0.1:3333/build`,
  // },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      $src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [new NaiveHotModuleReplacementPlugin()],
};
