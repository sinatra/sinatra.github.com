'use strict';

exports.__esModule = true;

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _atRule = require('./at-rule');

var _atRule2 = _interopRequireDefault(_atRule);

var _vendor = require('./vendor');

var _vendor2 = _interopRequireDefault(_vendor);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _rule = require('./rule');

var _rule2 = _interopRequireDefault(_rule);

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a new {@link Processor} instance that will apply `plugins`
 * as CSS processors.
 *
 * @param {Array.<Plugin|pluginFunction>|Processor} plugins - PostCSS
 *        plugins. See {@link Processor#use} for plugin format.
 *
 * @return {Processor} Processor to process multiple CSS
 *
 * @example
 * import postcss from 'postcss';
 *
 * postcss(plugins).process(css, { from, to }).then(result => {
 *   console.log(result.css);
 * });
 *
 * @namespace postcss
 */
function postcss() {
  for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new _processor2.default(plugins);
}

/**
 * Creates a PostCSS plugin with a standard API.
 *
 * The newly-wrapped function will provide both the name and PostCSS
 * version of the plugin.
 *
 * ```js
 *  const processor = postcss([replace]);
 *  processor.plugins[0].postcssPlugin  //=> 'postcss-replace'
 *  processor.plugins[0].postcssVersion //=> '5.1.0'
 * ```
 *
 * The plugin function receives 2 arguments: {@link Root}
 * and {@link Result} instance. The function should mutate the provided
 * `Root` node. Alternatively, you can create a new `Root` node
 * and override the `result.root` property.
 *
 * ```js
 * const cleaner = postcss.plugin('postcss-cleaner', () => {
 *   return (css, result) => {
 *     result.root = postcss.root();
 *   };
 * });
 * ```
 *
 * As a convenience, plugins also expose a `process` method so that you can use
 * them as standalone tools.
 *
 * ```js
 * cleaner.process(css, options);
 * // This is equivalent to:
 * postcss([ cleaner(options) ]).process(css);
 * ```
 *
 * Asynchronous plugins should return a `Promise` instance.
 *
 * ```js
 * postcss.plugin('postcss-import', () => {
 *   return (css, result) => {
 *     return new Promise( (resolve, reject) => {
 *       fs.readFile('base.css', (base) => {
 *         css.prepend(base);
 *         resolve();
 *       });
 *     });
 *   };
 * });
 * ```
 *
 * Add warnings using the {@link Node#warn} method.
 * Send data to other plugins using the {@link Result#messages} array.
 *
 * ```js
 * postcss.plugin('postcss-caniuse-test', () => {
 *   return (css, result) => {
 *     css.walkDecls(decl => {
 *       if ( !caniuse.support(decl.prop) ) {
 *         decl.warn(result, 'Some browsers do not support ' + decl.prop);
 *       }
 *     });
 *   };
 * });
 * ```
 *
 * @param {string} name          - PostCSS plugin name. Same as in `name`
 *                                 property in `package.json`. It will be saved
 *                                 in `plugin.postcssPlugin` property.
 * @param {function} initializer - will receive plugin options
 *                                 and should return {@link pluginFunction}
 *
 * @return {Plugin} PostCSS plugin
 */
postcss.plugin = function plugin(name, initializer) {
  var creator = function creator() {
    var transformer = initializer.apply(undefined, arguments);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new _processor2.default().version;
    return transformer;
  };

  var cache = void 0;
  Object.defineProperty(creator, 'postcss', {
    get: function get() {
      if (!cache) cache = creator();
      return cache;
    }
  });

  creator.process = function (css, opts) {
    return postcss([creator(opts)]).process(css, opts);
  };

  return creator;
};

/**
 * Default function to convert a node tree into a CSS string.
 *
 * @param {Node} node       - start node for stringifing. Usually {@link Root}.
 * @param {builder} builder - function to concatenate CSS from node’s parts
 *                            or generate string and source map
 *
 * @return {void}
 *
 * @function
 */
postcss.stringify = _stringify2.default;

/**
 * Parses source css and returns a new {@link Root} node,
 * which contains the source CSS nodes.
 *
 * @param {string|toString} css   - string with input CSS or any object
 *                                  with toString() method, like a Buffer
 * @param {processOptions} [opts] - options with only `from` and `map` keys
 *
 * @return {Root} PostCSS AST
 *
 * @example
 * // Simple CSS concatenation with source map support
 * const root1 = postcss.parse(css1, { from: file1 });
 * const root2 = postcss.parse(css2, { from: file2 });
 * root1.append(root2).toResult().css;
 *
 * @function
 */
postcss.parse = _parse2.default;

/**
 * @member {vendor} - Contains the {@link vendor} module.
 *
 * @example
 * postcss.vendor.unprefixed('-moz-tab') //=> ['tab']
 */
postcss.vendor = _vendor2.default;

/**
 * @member {list} - Contains the {@link list} module.
 *
 * @example
 * postcss.list.space('5px calc(10% + 5px)') //=> ['5px', 'calc(10% + 5px)']
 */
postcss.list = _list2.default;

/**
 * Creates a new {@link Comment} node.
 *
 * @param {object} [defaults] - properties for the new node.
 *
 * @return {Comment} new Comment node
 *
 * @example
 * postcss.comment({ text: 'test' })
 */
postcss.comment = function (defaults) {
  return new _comment2.default(defaults);
};

/**
 * Creates a new {@link AtRule} node.
 *
 * @param {object} [defaults] - properties for the new node.
 *
 * @return {AtRule} new AtRule node
 *
 * @example
 * postcss.atRule({ name: 'charset' }).toString() //=> "@charset"
 */
postcss.atRule = function (defaults) {
  return new _atRule2.default(defaults);
};

/**
 * Creates a new {@link Declaration} node.
 *
 * @param {object} [defaults] - properties for the new node.
 *
 * @return {Declaration} new Declaration node
 *
 * @example
 * postcss.decl({ prop: 'color', value: 'red' }).toString() //=> "color: red"
 */
postcss.decl = function (defaults) {
  return new _declaration2.default(defaults);
};

/**
 * Creates a new {@link Rule} node.
 *
 * @param {object} [defaults] - properties for the new node.
 *
 * @return {AtRule} new Rule node
 *
 * @example
 * postcss.rule({ selector: 'a' }).toString() //=> "a {\n}"
 */
postcss.rule = function (defaults) {
  return new _rule2.default(defaults);
};

/**
 * Creates a new {@link Root} node.
 *
 * @param {object} [defaults] - properties for the new node.
 *
 * @return {Root} new Root node
 *
 * @example
 * postcss.root({ after: '\n' }).toString() //=> "\n"
 */
postcss.root = function (defaults) {
  return new _root2.default(defaults);
};

exports.default = postcss;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3Rjc3MuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLFNBQVMsT0FBVCxHQUE2QjtBQUFBLG9DQUFULE9BQVM7QUFBVCxXQUFTO0FBQUE7O0FBQ3pCLE1BQUssUUFBUSxNQUFSLEtBQW1CLENBQW5CLElBQXdCLE1BQU0sT0FBTixDQUFjLFFBQVEsQ0FBUixDQUFkLENBQTdCLEVBQXlEO0FBQ3JELGNBQVUsUUFBUSxDQUFSLENBQVY7QUFDSDtBQUNELFNBQU8sd0JBQWMsT0FBZCxDQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEVELFFBQVEsTUFBUixHQUFpQixTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0IsV0FBdEIsRUFBbUM7QUFDaEQsTUFBSSxVQUFVLFNBQVYsT0FBVSxHQUFtQjtBQUM3QixRQUFJLGNBQWMsdUNBQWxCO0FBQ0EsZ0JBQVksYUFBWixHQUE2QixJQUE3QjtBQUNBLGdCQUFZLGNBQVosR0FBOEIseUJBQUQsQ0FBa0IsT0FBL0M7QUFDQSxXQUFPLFdBQVA7QUFDSCxHQUxEOztBQU9BLE1BQUksY0FBSjtBQUNBLFNBQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixTQUEvQixFQUEwQztBQUN0QyxPQURzQyxpQkFDaEM7QUFDRixVQUFLLENBQUMsS0FBTixFQUFjLFFBQVEsU0FBUjtBQUNkLGFBQU8sS0FBUDtBQUNIO0FBSnFDLEdBQTFDOztBQU9BLFVBQVEsT0FBUixHQUFrQixVQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXFCO0FBQ25DLFdBQU8sUUFBUSxDQUFFLFFBQVEsSUFBUixDQUFGLENBQVIsRUFBMkIsT0FBM0IsQ0FBbUMsR0FBbkMsRUFBd0MsSUFBeEMsQ0FBUDtBQUNILEdBRkQ7O0FBSUEsU0FBTyxPQUFQO0FBQ0gsQ0FyQkQ7Ozs7Ozs7Ozs7Ozs7QUFrQ0EsUUFBUSxTQUFSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxRQUFRLEtBQVI7Ozs7Ozs7O0FBUUEsUUFBUSxNQUFSOzs7Ozs7OztBQVFBLFFBQVEsSUFBUjs7Ozs7Ozs7Ozs7O0FBWUEsUUFBUSxPQUFSLEdBQWtCO0FBQUEsU0FBWSxzQkFBWSxRQUFaLENBQVo7QUFBQSxDQUFsQjs7Ozs7Ozs7Ozs7O0FBWUEsUUFBUSxNQUFSLEdBQWlCO0FBQUEsU0FBWSxxQkFBVyxRQUFYLENBQVo7QUFBQSxDQUFqQjs7Ozs7Ozs7Ozs7O0FBWUEsUUFBUSxJQUFSLEdBQWU7QUFBQSxTQUFZLDBCQUFnQixRQUFoQixDQUFaO0FBQUEsQ0FBZjs7Ozs7Ozs7Ozs7O0FBWUEsUUFBUSxJQUFSLEdBQWU7QUFBQSxTQUFZLG1CQUFTLFFBQVQsQ0FBWjtBQUFBLENBQWY7Ozs7Ozs7Ozs7OztBQVlBLFFBQVEsSUFBUixHQUFlO0FBQUEsU0FBWSxtQkFBUyxRQUFULENBQVo7QUFBQSxDQUFmOztrQkFFZSxPIiwiZmlsZSI6InBvc3Rjc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVjbGFyYXRpb24gZnJvbSAnLi9kZWNsYXJhdGlvbic7XG5pbXBvcnQgUHJvY2Vzc29yICAgZnJvbSAnLi9wcm9jZXNzb3InO1xuaW1wb3J0IHN0cmluZ2lmeSAgIGZyb20gJy4vc3RyaW5naWZ5JztcbmltcG9ydCBDb21tZW50ICAgICBmcm9tICcuL2NvbW1lbnQnO1xuaW1wb3J0IEF0UnVsZSAgICAgIGZyb20gJy4vYXQtcnVsZSc7XG5pbXBvcnQgdmVuZG9yICAgICAgZnJvbSAnLi92ZW5kb3InO1xuaW1wb3J0IHBhcnNlICAgICAgIGZyb20gJy4vcGFyc2UnO1xuaW1wb3J0IGxpc3QgICAgICAgIGZyb20gJy4vbGlzdCc7XG5pbXBvcnQgUnVsZSAgICAgICAgZnJvbSAnLi9ydWxlJztcbmltcG9ydCBSb290ICAgICAgICBmcm9tICcuL3Jvb3QnO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyB7QGxpbmsgUHJvY2Vzc29yfSBpbnN0YW5jZSB0aGF0IHdpbGwgYXBwbHkgYHBsdWdpbnNgXG4gKiBhcyBDU1MgcHJvY2Vzc29ycy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxQbHVnaW58cGx1Z2luRnVuY3Rpb24+fFByb2Nlc3Nvcn0gcGx1Z2lucyAtIFBvc3RDU1NcbiAqICAgICAgICBwbHVnaW5zLiBTZWUge0BsaW5rIFByb2Nlc3NvciN1c2V9IGZvciBwbHVnaW4gZm9ybWF0LlxuICpcbiAqIEByZXR1cm4ge1Byb2Nlc3Nvcn0gUHJvY2Vzc29yIHRvIHByb2Nlc3MgbXVsdGlwbGUgQ1NTXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBwb3N0Y3NzIGZyb20gJ3Bvc3Rjc3MnO1xuICpcbiAqIHBvc3Rjc3MocGx1Z2lucykucHJvY2Vzcyhjc3MsIHsgZnJvbSwgdG8gfSkudGhlbihyZXN1bHQgPT4ge1xuICogICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKTtcbiAqIH0pO1xuICpcbiAqIEBuYW1lc3BhY2UgcG9zdGNzc1xuICovXG5mdW5jdGlvbiBwb3N0Y3NzKC4uLnBsdWdpbnMpIHtcbiAgICBpZiAoIHBsdWdpbnMubGVuZ3RoID09PSAxICYmIEFycmF5LmlzQXJyYXkocGx1Z2luc1swXSkgKSB7XG4gICAgICAgIHBsdWdpbnMgPSBwbHVnaW5zWzBdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb2Nlc3NvcihwbHVnaW5zKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgUG9zdENTUyBwbHVnaW4gd2l0aCBhIHN0YW5kYXJkIEFQSS5cbiAqXG4gKiBUaGUgbmV3bHktd3JhcHBlZCBmdW5jdGlvbiB3aWxsIHByb3ZpZGUgYm90aCB0aGUgbmFtZSBhbmQgUG9zdENTU1xuICogdmVyc2lvbiBvZiB0aGUgcGx1Z2luLlxuICpcbiAqIGBgYGpzXG4gKiAgY29uc3QgcHJvY2Vzc29yID0gcG9zdGNzcyhbcmVwbGFjZV0pO1xuICogIHByb2Nlc3Nvci5wbHVnaW5zWzBdLnBvc3Rjc3NQbHVnaW4gIC8vPT4gJ3Bvc3Rjc3MtcmVwbGFjZSdcbiAqICBwcm9jZXNzb3IucGx1Z2luc1swXS5wb3N0Y3NzVmVyc2lvbiAvLz0+ICc1LjEuMCdcbiAqIGBgYFxuICpcbiAqIFRoZSBwbHVnaW4gZnVuY3Rpb24gcmVjZWl2ZXMgMiBhcmd1bWVudHM6IHtAbGluayBSb290fVxuICogYW5kIHtAbGluayBSZXN1bHR9IGluc3RhbmNlLiBUaGUgZnVuY3Rpb24gc2hvdWxkIG11dGF0ZSB0aGUgcHJvdmlkZWRcbiAqIGBSb290YCBub2RlLiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGNyZWF0ZSBhIG5ldyBgUm9vdGAgbm9kZVxuICogYW5kIG92ZXJyaWRlIHRoZSBgcmVzdWx0LnJvb3RgIHByb3BlcnR5LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBjbGVhbmVyID0gcG9zdGNzcy5wbHVnaW4oJ3Bvc3Rjc3MtY2xlYW5lcicsICgpID0+IHtcbiAqICAgcmV0dXJuIChjc3MsIHJlc3VsdCkgPT4ge1xuICogICAgIHJlc3VsdC5yb290ID0gcG9zdGNzcy5yb290KCk7XG4gKiAgIH07XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEFzIGEgY29udmVuaWVuY2UsIHBsdWdpbnMgYWxzbyBleHBvc2UgYSBgcHJvY2Vzc2AgbWV0aG9kIHNvIHRoYXQgeW91IGNhbiB1c2VcbiAqIHRoZW0gYXMgc3RhbmRhbG9uZSB0b29scy5cbiAqXG4gKiBgYGBqc1xuICogY2xlYW5lci5wcm9jZXNzKGNzcywgb3B0aW9ucyk7XG4gKiAvLyBUaGlzIGlzIGVxdWl2YWxlbnQgdG86XG4gKiBwb3N0Y3NzKFsgY2xlYW5lcihvcHRpb25zKSBdKS5wcm9jZXNzKGNzcyk7XG4gKiBgYGBcbiAqXG4gKiBBc3luY2hyb25vdXMgcGx1Z2lucyBzaG91bGQgcmV0dXJuIGEgYFByb21pc2VgIGluc3RhbmNlLlxuICpcbiAqIGBgYGpzXG4gKiBwb3N0Y3NzLnBsdWdpbigncG9zdGNzcy1pbXBvcnQnLCAoKSA9PiB7XG4gKiAgIHJldHVybiAoY3NzLCByZXN1bHQpID0+IHtcbiAqICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAqICAgICAgIGZzLnJlYWRGaWxlKCdiYXNlLmNzcycsIChiYXNlKSA9PiB7XG4gKiAgICAgICAgIGNzcy5wcmVwZW5kKGJhc2UpO1xuICogICAgICAgICByZXNvbHZlKCk7XG4gKiAgICAgICB9KTtcbiAqICAgICB9KTtcbiAqICAgfTtcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQWRkIHdhcm5pbmdzIHVzaW5nIHRoZSB7QGxpbmsgTm9kZSN3YXJufSBtZXRob2QuXG4gKiBTZW5kIGRhdGEgdG8gb3RoZXIgcGx1Z2lucyB1c2luZyB0aGUge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30gYXJyYXkuXG4gKlxuICogYGBganNcbiAqIHBvc3Rjc3MucGx1Z2luKCdwb3N0Y3NzLWNhbml1c2UtdGVzdCcsICgpID0+IHtcbiAqICAgcmV0dXJuIChjc3MsIHJlc3VsdCkgPT4ge1xuICogICAgIGNzcy53YWxrRGVjbHMoZGVjbCA9PiB7XG4gKiAgICAgICBpZiAoICFjYW5pdXNlLnN1cHBvcnQoZGVjbC5wcm9wKSApIHtcbiAqICAgICAgICAgZGVjbC53YXJuKHJlc3VsdCwgJ1NvbWUgYnJvd3NlcnMgZG8gbm90IHN1cHBvcnQgJyArIGRlY2wucHJvcCk7XG4gKiAgICAgICB9XG4gKiAgICAgfSk7XG4gKiAgIH07XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICAgICAgICAgIC0gUG9zdENTUyBwbHVnaW4gbmFtZS4gU2FtZSBhcyBpbiBgbmFtZWBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgaW4gYHBhY2thZ2UuanNvbmAuIEl0IHdpbGwgYmUgc2F2ZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gYHBsdWdpbi5wb3N0Y3NzUGx1Z2luYCBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGluaXRpYWxpemVyIC0gd2lsbCByZWNlaXZlIHBsdWdpbiBvcHRpb25zXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBzaG91bGQgcmV0dXJuIHtAbGluayBwbHVnaW5GdW5jdGlvbn1cbiAqXG4gKiBAcmV0dXJuIHtQbHVnaW59IFBvc3RDU1MgcGx1Z2luXG4gKi9cbnBvc3Rjc3MucGx1Z2luID0gZnVuY3Rpb24gcGx1Z2luKG5hbWUsIGluaXRpYWxpemVyKSB7XG4gICAgbGV0IGNyZWF0b3IgPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBsZXQgdHJhbnNmb3JtZXIgPSBpbml0aWFsaXplciguLi5hcmdzKTtcbiAgICAgICAgdHJhbnNmb3JtZXIucG9zdGNzc1BsdWdpbiAgPSBuYW1lO1xuICAgICAgICB0cmFuc2Zvcm1lci5wb3N0Y3NzVmVyc2lvbiA9IChuZXcgUHJvY2Vzc29yKCkpLnZlcnNpb247XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgICB9O1xuXG4gICAgbGV0IGNhY2hlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdG9yLCAncG9zdGNzcycsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgaWYgKCAhY2FjaGUgKSBjYWNoZSA9IGNyZWF0b3IoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3JlYXRvci5wcm9jZXNzID0gZnVuY3Rpb24gKGNzcywgb3B0cykge1xuICAgICAgICByZXR1cm4gcG9zdGNzcyhbIGNyZWF0b3Iob3B0cykgXSkucHJvY2Vzcyhjc3MsIG9wdHMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gY3JlYXRvcjtcbn07XG5cbi8qKlxuICogRGVmYXVsdCBmdW5jdGlvbiB0byBjb252ZXJ0IGEgbm9kZSB0cmVlIGludG8gYSBDU1Mgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgICAgICAtIHN0YXJ0IG5vZGUgZm9yIHN0cmluZ2lmaW5nLiBVc3VhbGx5IHtAbGluayBSb290fS5cbiAqIEBwYXJhbSB7YnVpbGRlcn0gYnVpbGRlciAtIGZ1bmN0aW9uIHRvIGNvbmNhdGVuYXRlIENTUyBmcm9tIG5vZGXigJlzIHBhcnRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBnZW5lcmF0ZSBzdHJpbmcgYW5kIHNvdXJjZSBtYXBcbiAqXG4gKiBAcmV0dXJuIHt2b2lkfVxuICpcbiAqIEBmdW5jdGlvblxuICovXG5wb3N0Y3NzLnN0cmluZ2lmeSA9IHN0cmluZ2lmeTtcblxuLyoqXG4gKiBQYXJzZXMgc291cmNlIGNzcyBhbmQgcmV0dXJucyBhIG5ldyB7QGxpbmsgUm9vdH0gbm9kZSxcbiAqIHdoaWNoIGNvbnRhaW5zIHRoZSBzb3VyY2UgQ1NTIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHRvU3RyaW5nfSBjc3MgICAtIHN0cmluZyB3aXRoIGlucHV0IENTUyBvciBhbnkgb2JqZWN0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRvU3RyaW5nKCkgbWV0aG9kLCBsaWtlIGEgQnVmZmVyXG4gKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBbb3B0c10gLSBvcHRpb25zIHdpdGggb25seSBgZnJvbWAgYW5kIGBtYXBgIGtleXNcbiAqXG4gKiBAcmV0dXJuIHtSb290fSBQb3N0Q1NTIEFTVFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBTaW1wbGUgQ1NTIGNvbmNhdGVuYXRpb24gd2l0aCBzb3VyY2UgbWFwIHN1cHBvcnRcbiAqIGNvbnN0IHJvb3QxID0gcG9zdGNzcy5wYXJzZShjc3MxLCB7IGZyb206IGZpbGUxIH0pO1xuICogY29uc3Qgcm9vdDIgPSBwb3N0Y3NzLnBhcnNlKGNzczIsIHsgZnJvbTogZmlsZTIgfSk7XG4gKiByb290MS5hcHBlbmQocm9vdDIpLnRvUmVzdWx0KCkuY3NzO1xuICpcbiAqIEBmdW5jdGlvblxuICovXG5wb3N0Y3NzLnBhcnNlID0gcGFyc2U7XG5cbi8qKlxuICogQG1lbWJlciB7dmVuZG9yfSAtIENvbnRhaW5zIHRoZSB7QGxpbmsgdmVuZG9yfSBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHBvc3Rjc3MudmVuZG9yLnVucHJlZml4ZWQoJy1tb3otdGFiJykgLy89PiBbJ3RhYiddXG4gKi9cbnBvc3Rjc3MudmVuZG9yID0gdmVuZG9yO1xuXG4vKipcbiAqIEBtZW1iZXIge2xpc3R9IC0gQ29udGFpbnMgdGhlIHtAbGluayBsaXN0fSBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHBvc3Rjc3MubGlzdC5zcGFjZSgnNXB4IGNhbGMoMTAlICsgNXB4KScpIC8vPT4gWyc1cHgnLCAnY2FsYygxMCUgKyA1cHgpJ11cbiAqL1xucG9zdGNzcy5saXN0ID0gbGlzdDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHtAbGluayBDb21tZW50fSBub2RlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVmYXVsdHNdIC0gcHJvcGVydGllcyBmb3IgdGhlIG5ldyBub2RlLlxuICpcbiAqIEByZXR1cm4ge0NvbW1lbnR9IG5ldyBDb21tZW50IG5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcy5jb21tZW50KHsgdGV4dDogJ3Rlc3QnIH0pXG4gKi9cbnBvc3Rjc3MuY29tbWVudCA9IGRlZmF1bHRzID0+IG5ldyBDb21tZW50KGRlZmF1bHRzKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHtAbGluayBBdFJ1bGV9IG5vZGUuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IFtkZWZhdWx0c10gLSBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IG5vZGUuXG4gKlxuICogQHJldHVybiB7QXRSdWxlfSBuZXcgQXRSdWxlIG5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcy5hdFJ1bGUoeyBuYW1lOiAnY2hhcnNldCcgfSkudG9TdHJpbmcoKSAvLz0+IFwiQGNoYXJzZXRcIlxuICovXG5wb3N0Y3NzLmF0UnVsZSA9IGRlZmF1bHRzID0+IG5ldyBBdFJ1bGUoZGVmYXVsdHMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcge0BsaW5rIERlY2xhcmF0aW9ufSBub2RlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVmYXVsdHNdIC0gcHJvcGVydGllcyBmb3IgdGhlIG5ldyBub2RlLlxuICpcbiAqIEByZXR1cm4ge0RlY2xhcmF0aW9ufSBuZXcgRGVjbGFyYXRpb24gbm9kZVxuICpcbiAqIEBleGFtcGxlXG4gKiBwb3N0Y3NzLmRlY2woeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ3JlZCcgfSkudG9TdHJpbmcoKSAvLz0+IFwiY29sb3I6IHJlZFwiXG4gKi9cbnBvc3Rjc3MuZGVjbCA9IGRlZmF1bHRzID0+IG5ldyBEZWNsYXJhdGlvbihkZWZhdWx0cyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB7QGxpbmsgUnVsZX0gbm9kZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gW2RlZmF1bHRzXSAtIHByb3BlcnRpZXMgZm9yIHRoZSBuZXcgbm9kZS5cbiAqXG4gKiBAcmV0dXJuIHtBdFJ1bGV9IG5ldyBSdWxlIG5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcy5ydWxlKHsgc2VsZWN0b3I6ICdhJyB9KS50b1N0cmluZygpIC8vPT4gXCJhIHtcXG59XCJcbiAqL1xucG9zdGNzcy5ydWxlID0gZGVmYXVsdHMgPT4gbmV3IFJ1bGUoZGVmYXVsdHMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcge0BsaW5rIFJvb3R9IG5vZGUuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IFtkZWZhdWx0c10gLSBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IG5vZGUuXG4gKlxuICogQHJldHVybiB7Um9vdH0gbmV3IFJvb3Qgbm9kZVxuICpcbiAqIEBleGFtcGxlXG4gKiBwb3N0Y3NzLnJvb3QoeyBhZnRlcjogJ1xcbicgfSkudG9TdHJpbmcoKSAvLz0+IFwiXFxuXCJcbiAqL1xucG9zdGNzcy5yb290ID0gZGVmYXVsdHMgPT4gbmV3IFJvb3QoZGVmYXVsdHMpO1xuXG5leHBvcnQgZGVmYXVsdCBwb3N0Y3NzO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
