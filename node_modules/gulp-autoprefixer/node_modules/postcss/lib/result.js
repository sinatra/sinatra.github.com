'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warning = require('./warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef  {object} Message
 * @property {string} type   - message type
 * @property {string} plugin - source PostCSS plugin name
 */

/**
 * Provides the result of the PostCSS transformations.
 *
 * A Result instance is returned by {@link LazyResult#then}
 * or {@link Root#toResult} methods.
 *
 * @example
 * postcss([cssnext]).process(css).then(function (result) {
 *    console.log(result.css);
 * });
 *
 * @example
 * var result2 = postcss.parse(css).toResult();
 */

var Result = function () {

  /**
   * @param {Processor} processor - processor used for this transformation.
   * @param {Root}      root      - Root node after all transformations.
   * @param {processOptions} opts - options from the {@link Processor#process}
   *                                or {@link Root#toResult}
   */

  function Result(processor, root, opts) {
    _classCallCheck(this, Result);

    /**
     * @member {Processor} - The Processor instance used
     *                       for this transformation.
     *
     * @example
     * for ( let plugin of result.processor.plugins) {
     *   if ( plugin.postcssPlugin === 'postcss-bad' ) {
     *     throw 'postcss-good is incompatible with postcss-bad';
     *   }
     * });
     */
    this.processor = processor;
    /**
     * @member {Message[]} - Contains messages from plugins
     *                       (e.g., warnings or custom messages).
     *                       Each message should have type
     *                       and plugin properties.
     *
     * @example
     * postcss.plugin('postcss-min-browser', () => {
     *   return (css, result) => {
     *     var browsers = detectMinBrowsersByCanIUse(css);
     *     result.messages.push({
     *       type:    'min-browser',
     *       plugin:  'postcss-min-browser',
     *       browsers: browsers
     *     });
     *   };
     * });
     */
    this.messages = [];
    /**
     * @member {Root} - Root node after all transformations.
     *
     * @example
     * root.toResult().root == root;
     */
    this.root = root;
    /**
     * @member {processOptions} - Options from the {@link Processor#process}
     *                            or {@link Root#toResult} call
     *                            that produced this Result instance.
     *
     * @example
     * root.toResult(opts).opts == opts;
     */
    this.opts = opts;
    /**
     * @member {string} - A CSS string representing of {@link Result#root}.
     *
     * @example
     * postcss.parse('a{}').toResult().css //=> "a{}"
     */
    this.css = undefined;
    /**
     * @member {SourceMapGenerator} - An instance of `SourceMapGenerator`
     *                                class from the `source-map` library,
     *                                representing changes
     *                                to the {@link Result#root} instance.
     *
     * @example
     * result.map.toJSON() //=> { version: 3, file: 'a.css', … }
     *
     * @example
     * if ( result.map ) {
     *   fs.writeFileSync(result.opts.to + '.map', result.map.toString());
     * }
     */
    this.map = undefined;
  }

  /**
   * Returns for @{link Result#css} content.
   *
   * @example
   * result + '' === result.css
   *
   * @return {string} string representing of {@link Result#root}
   */


  Result.prototype.toString = function toString() {
    return this.css;
  };

  /**
   * Creates an instance of {@link Warning} and adds it
   * to {@link Result#messages}.
   *
   * @param {string} text        - warning message
   * @param {Object} [opts]      - warning options
   * @param {Node}   opts.node   - CSS node that caused the warning
   * @param {string} opts.word   - word in CSS source that caused the warning
   * @param {number} opts.index  - index in CSS node string that caused
   *                               the warning
   * @param {string} opts.plugin - name of the plugin that created
   *                               this warning. {@link Result#warn} fills
   *                               this property automatically.
   *
   * @return {Warning} created warning
   */


  Result.prototype.warn = function warn(text) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }

    var warning = new _warning2.default(text, opts);
    this.messages.push(warning);

    return warning;
  };

  /**
   * Returns warnings from plugins. Filters {@link Warning} instances
   * from {@link Result#messages}.
   *
   * @example
   * result.warnings().forEach(warn => {
   *   console.warn(warn.toString());
   * });
   *
   * @return {Warning[]} warnings from plugins
   */


  Result.prototype.warnings = function warnings() {
    return this.messages.filter(function (i) {
      return i.type === 'warning';
    });
  };

  /**
   * An alias for the {@link Result#css} property.
   * Use it with syntaxes that generate non-CSS output.
   * @type {string}
   *
   * @example
   * result.css === result.content;
   */


  _createClass(Result, [{
    key: 'content',
    get: function get() {
      return this.css;
    }
  }]);

  return Result;
}();

exports.default = Result;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3VsdC5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JNLE07Ozs7Ozs7OztBQVFGLGtCQUFZLFNBQVosRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBbUM7QUFBQTs7Ozs7Ozs7Ozs7OztBQVkvQixTQUFLLFNBQUwsR0FBaUIsU0FBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsU0FBSyxRQUFMLEdBQWdCLEVBQWhCOzs7Ozs7O0FBT0EsU0FBSyxJQUFMLEdBQVksSUFBWjs7Ozs7Ozs7O0FBU0EsU0FBSyxJQUFMLEdBQVksSUFBWjs7Ozs7OztBQU9BLFNBQUssR0FBTCxHQUFXLFNBQVg7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQUssR0FBTCxHQUFXLFNBQVg7QUFDSDs7Ozs7Ozs7Ozs7O21CQVVELFEsdUJBQVc7QUFDUCxXQUFPLEtBQUssR0FBWjtBQUNILEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQWtCRCxJLGlCQUFLLEksRUFBa0I7QUFBQSxRQUFaLElBQVkseURBQUwsRUFBSzs7QUFDbkIsUUFBSyxDQUFDLEtBQUssTUFBWCxFQUFvQjtBQUNoQixVQUFLLEtBQUssVUFBTCxJQUFtQixLQUFLLFVBQUwsQ0FBZ0IsYUFBeEMsRUFBd0Q7QUFDcEQsYUFBSyxNQUFMLEdBQWMsS0FBSyxVQUFMLENBQWdCLGFBQTlCO0FBQ0g7QUFDSjs7QUFFRCxRQUFJLFVBQVUsc0JBQVksSUFBWixFQUFrQixJQUFsQixDQUFkO0FBQ0EsU0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixPQUFuQjs7QUFFQSxXQUFPLE9BQVA7QUFDSCxHOzs7Ozs7Ozs7Ozs7Ozs7bUJBYUQsUSx1QkFBVztBQUNQLFdBQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFzQjtBQUFBLGFBQUssRUFBRSxJQUFGLEtBQVcsU0FBaEI7QUFBQSxLQUF0QixDQUFQO0FBQ0gsRzs7Ozs7Ozs7Ozs7Ozs7d0JBVWE7QUFDVixhQUFPLEtBQUssR0FBWjtBQUNIOzs7Ozs7a0JBSVUsTSIsImZpbGUiOiJyZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV2FybmluZyBmcm9tICcuL3dhcm5pbmcnO1xuXG4vKipcbiAqIEB0eXBlZGVmICB7b2JqZWN0fSBNZXNzYWdlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSAgIC0gbWVzc2FnZSB0eXBlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGx1Z2luIC0gc291cmNlIFBvc3RDU1MgcGx1Z2luIG5hbWVcbiAqL1xuXG4vKipcbiAqIFByb3ZpZGVzIHRoZSByZXN1bHQgb2YgdGhlIFBvc3RDU1MgdHJhbnNmb3JtYXRpb25zLlxuICpcbiAqIEEgUmVzdWx0IGluc3RhbmNlIGlzIHJldHVybmVkIGJ5IHtAbGluayBMYXp5UmVzdWx0I3RoZW59XG4gKiBvciB7QGxpbmsgUm9vdCN0b1Jlc3VsdH0gbWV0aG9kcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcyhbY3NzbmV4dF0pLnByb2Nlc3MoY3NzKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAqICAgIGNvbnNvbGUubG9nKHJlc3VsdC5jc3MpO1xuICogfSk7XG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciByZXN1bHQyID0gcG9zdGNzcy5wYXJzZShjc3MpLnRvUmVzdWx0KCk7XG4gKi9cbmNsYXNzIFJlc3VsdCB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1Byb2Nlc3Nvcn0gcHJvY2Vzc29yIC0gcHJvY2Vzc29yIHVzZWQgZm9yIHRoaXMgdHJhbnNmb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb290fSAgICAgIHJvb3QgICAgICAtIFJvb3Qgbm9kZSBhZnRlciBhbGwgdHJhbnNmb3JtYXRpb25zLlxuICAgICAqIEBwYXJhbSB7cHJvY2Vzc09wdGlvbnN9IG9wdHMgLSBvcHRpb25zIGZyb20gdGhlIHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc31cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Ige0BsaW5rIFJvb3QjdG9SZXN1bHR9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJvY2Vzc29yLCByb290LCBvcHRzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQcm9jZXNzb3J9IC0gVGhlIFByb2Nlc3NvciBpbnN0YW5jZSB1c2VkXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICBmb3IgdGhpcyB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogZm9yICggbGV0IHBsdWdpbiBvZiByZXN1bHQucHJvY2Vzc29yLnBsdWdpbnMpIHtcbiAgICAgICAgICogICBpZiAoIHBsdWdpbi5wb3N0Y3NzUGx1Z2luID09PSAncG9zdGNzcy1iYWQnICkge1xuICAgICAgICAgKiAgICAgdGhyb3cgJ3Bvc3Rjc3MtZ29vZCBpcyBpbmNvbXBhdGlibGUgd2l0aCBwb3N0Y3NzLWJhZCc7XG4gICAgICAgICAqICAgfVxuICAgICAgICAgKiB9KTtcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJvY2Vzc29yID0gcHJvY2Vzc29yO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7TWVzc2FnZVtdfSAtIENvbnRhaW5zIG1lc3NhZ2VzIGZyb20gcGx1Z2luc1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgKGUuZy4sIHdhcm5pbmdzIG9yIGN1c3RvbSBtZXNzYWdlcykuXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICBFYWNoIG1lc3NhZ2Ugc2hvdWxkIGhhdmUgdHlwZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYW5kIHBsdWdpbiBwcm9wZXJ0aWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBwb3N0Y3NzLnBsdWdpbigncG9zdGNzcy1taW4tYnJvd3NlcicsICgpID0+IHtcbiAgICAgICAgICogICByZXR1cm4gKGNzcywgcmVzdWx0KSA9PiB7XG4gICAgICAgICAqICAgICB2YXIgYnJvd3NlcnMgPSBkZXRlY3RNaW5Ccm93c2Vyc0J5Q2FuSVVzZShjc3MpO1xuICAgICAgICAgKiAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgKiAgICAgICB0eXBlOiAgICAnbWluLWJyb3dzZXInLFxuICAgICAgICAgKiAgICAgICBwbHVnaW46ICAncG9zdGNzcy1taW4tYnJvd3NlcicsXG4gICAgICAgICAqICAgICAgIGJyb3dzZXJzOiBicm93c2Vyc1xuICAgICAgICAgKiAgICAgfSk7XG4gICAgICAgICAqICAgfTtcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtSb290fSAtIFJvb3Qgbm9kZSBhZnRlciBhbGwgdHJhbnNmb3JtYXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiByb290LnRvUmVzdWx0KCkucm9vdCA9PSByb290O1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3Byb2Nlc3NPcHRpb25zfSAtIE9wdGlvbnMgZnJvbSB0aGUge0BsaW5rIFByb2Nlc3NvciNwcm9jZXNzfVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciB7QGxpbmsgUm9vdCN0b1Jlc3VsdH0gY2FsbFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IHByb2R1Y2VkIHRoaXMgUmVzdWx0IGluc3RhbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiByb290LnRvUmVzdWx0KG9wdHMpLm9wdHMgPT0gb3B0cztcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub3B0cyA9IG9wdHM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQSBDU1Mgc3RyaW5nIHJlcHJlc2VudGluZyBvZiB7QGxpbmsgUmVzdWx0I3Jvb3R9LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBwb3N0Y3NzLnBhcnNlKCdhe30nKS50b1Jlc3VsdCgpLmNzcyAvLz0+IFwiYXt9XCJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3NzID0gdW5kZWZpbmVkO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7U291cmNlTWFwR2VuZXJhdG9yfSAtIEFuIGluc3RhbmNlIG9mIGBTb3VyY2VNYXBHZW5lcmF0b3JgXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyBmcm9tIHRoZSBgc291cmNlLW1hcGAgbGlicmFyeSxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcHJlc2VudGluZyBjaGFuZ2VzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byB0aGUge0BsaW5rIFJlc3VsdCNyb290fSBpbnN0YW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcmVzdWx0Lm1hcC50b0pTT04oKSAvLz0+IHsgdmVyc2lvbjogMywgZmlsZTogJ2EuY3NzJywg4oCmIH1cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogaWYgKCByZXN1bHQubWFwICkge1xuICAgICAgICAgKiAgIGZzLndyaXRlRmlsZVN5bmMocmVzdWx0Lm9wdHMudG8gKyAnLm1hcCcsIHJlc3VsdC5tYXAudG9TdHJpbmcoKSk7XG4gICAgICAgICAqIH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubWFwID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZm9yIEB7bGluayBSZXN1bHQjY3NzfSBjb250ZW50LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByZXN1bHQgKyAnJyA9PT0gcmVzdWx0LmNzc1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50aW5nIG9mIHtAbGluayBSZXN1bHQjcm9vdH1cbiAgICAgKi9cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3NzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIFdhcm5pbmd9IGFuZCBhZGRzIGl0XG4gICAgICogdG8ge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAgICAgICAgLSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHNdICAgICAgLSB3YXJuaW5nIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge05vZGV9ICAgb3B0cy5ub2RlICAgLSBDU1Mgbm9kZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLndvcmQgICAtIHdvcmQgaW4gQ1NTIHNvdXJjZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRzLmluZGV4ICAtIGluZGV4IGluIENTUyBub2RlIHN0cmluZyB0aGF0IGNhdXNlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB3YXJuaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMucGx1Z2luIC0gbmFtZSBvZiB0aGUgcGx1Z2luIHRoYXQgY3JlYXRlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgd2FybmluZy4ge0BsaW5rIFJlc3VsdCN3YXJufSBmaWxsc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgcHJvcGVydHkgYXV0b21hdGljYWxseS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dhcm5pbmd9IGNyZWF0ZWQgd2FybmluZ1xuICAgICAqL1xuICAgIHdhcm4odGV4dCwgb3B0cyA9IHsgfSkge1xuICAgICAgICBpZiAoICFvcHRzLnBsdWdpbiApIHtcbiAgICAgICAgICAgIGlmICggdGhpcy5sYXN0UGx1Z2luICYmIHRoaXMubGFzdFBsdWdpbi5wb3N0Y3NzUGx1Z2luICkge1xuICAgICAgICAgICAgICAgIG9wdHMucGx1Z2luID0gdGhpcy5sYXN0UGx1Z2luLnBvc3Rjc3NQbHVnaW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd2FybmluZyA9IG5ldyBXYXJuaW5nKHRleHQsIG9wdHMpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2god2FybmluZyk7XG5cbiAgICAgICAgcmV0dXJuIHdhcm5pbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3YXJuaW5ncyBmcm9tIHBsdWdpbnMuIEZpbHRlcnMge0BsaW5rIFdhcm5pbmd9IGluc3RhbmNlc1xuICAgICAqIGZyb20ge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJlc3VsdC53YXJuaW5ncygpLmZvckVhY2god2FybiA9PiB7XG4gICAgICogICBjb25zb2xlLndhcm4od2Fybi50b1N0cmluZygpKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dhcm5pbmdbXX0gd2FybmluZ3MgZnJvbSBwbHVnaW5zXG4gICAgICovXG4gICAgd2FybmluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzLmZpbHRlciggaSA9PiBpLnR5cGUgPT09ICd3YXJuaW5nJyApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGFsaWFzIGZvciB0aGUge0BsaW5rIFJlc3VsdCNjc3N9IHByb3BlcnR5LlxuICAgICAqIFVzZSBpdCB3aXRoIHN5bnRheGVzIHRoYXQgZ2VuZXJhdGUgbm9uLUNTUyBvdXRwdXQuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcmVzdWx0LmNzcyA9PT0gcmVzdWx0LmNvbnRlbnQ7XG4gICAgICovXG4gICAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNzcztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzdWx0O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
