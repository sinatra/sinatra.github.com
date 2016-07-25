'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _supportsColor = require('supports-color');

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The CSS parser throws this error for broken CSS.
 *
 * Custom parsers can throw this error for broken custom syntax using
 * the {@link Node#error} method.
 *
 * PostCSS will use the input source map to detect the original error location.
 * If you wrote a Sass file, compiled it to CSS and then parsed it with PostCSS,
 * PostCSS will show the original position in the Sass file.
 *
 * If you need the position in the PostCSS input
 * (e.g., to debug the previous compiler), use `error.input.file`.
 *
 * @example
 * // Catching and checking syntax error
 * try {
 *   postcss.parse('a{')
 * } catch (error) {
 *   if ( error.name === 'CssSyntaxError' ) {
 *     error //=> CssSyntaxError
 *   }
 * }
 *
 * @example
 * // Raising error from plugin
 * throw node.error('Unknown variable', { plugin: 'postcss-vars' });
 */

var CssSyntaxError = function () {

    /**
     * @param {string} message  - error message
     * @param {number} [line]   - source line of the error
     * @param {number} [column] - source column of the error
     * @param {string} [source] - source code of the broken file
     * @param {string} [file]   - absolute path to the broken file
     * @param {string} [plugin] - PostCSS plugin name, if error came from plugin
     */

    function CssSyntaxError(message, line, column, source, file, plugin) {
        _classCallCheck(this, CssSyntaxError);

        /**
         * @member {string} - Always equal to `'CssSyntaxError'`. You should
         *                    always check error type
         *                    by `error.name === 'CssSyntaxError'` instead of
         *                    `error instanceof CssSyntaxError`, because
         *                    npm could have several PostCSS versions.
         *
         * @example
         * if ( error.name === 'CssSyntaxError' ) {
         *   error //=> CssSyntaxError
         * }
         */
        this.name = 'CssSyntaxError';
        /**
         * @member {string} - Error message.
         *
         * @example
         * error.message //=> 'Unclosed block'
         */
        this.reason = message;

        if (file) {
            /**
             * @member {string} - Absolute path to the broken file.
             *
             * @example
             * error.file       //=> 'a.sass'
             * error.input.file //=> 'a.css'
             */
            this.file = file;
        }
        if (source) {
            /**
             * @member {string} - Source code of the broken file.
             *
             * @example
             * error.source       //=> 'a { b {} }'
             * error.input.column //=> 'a b { }'
             */
            this.source = source;
        }
        if (plugin) {
            /**
             * @member {string} - Plugin name, if error came from plugin.
             *
             * @example
             * error.plugin //=> 'postcss-vars'
             */
            this.plugin = plugin;
        }
        if (typeof line !== 'undefined' && typeof column !== 'undefined') {
            /**
             * @member {number} - Source line of the error.
             *
             * @example
             * error.line       //=> 2
             * error.input.line //=> 4
             */
            this.line = line;
            /**
             * @member {number} - Source column of the error.
             *
             * @example
             * error.column       //=> 1
             * error.input.column //=> 4
             */
            this.column = column;
        }

        this.setMessage();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CssSyntaxError);
        }
    }

    CssSyntaxError.prototype.setMessage = function setMessage() {
        /**
         * @member {string} - Full error text in the GNU error format
         *                    with plugin, file, line and column.
         *
         * @example
         * error.message //=> 'a.css:1:1: Unclosed block'
         */
        this.message = this.plugin ? this.plugin + ': ' : '';
        this.message += this.file ? this.file : '<css input>';
        if (typeof this.line !== 'undefined') {
            this.message += ':' + this.line + ':' + this.column;
        }
        this.message += ': ' + this.reason;
    };

    /**
     * Returns a few lines of CSS source that caused the error.
     *
     * If the CSS has an input source map without `sourceContent`,
     * this method will return an empty string.
     *
     * @param {boolean} [color] whether arrow will be colored red by terminal
     *                          color codes. By default, PostCSS will detect
     *                          color support by `process.stdout.isTTY`
     *                          and `process.env.NODE_DISABLE_COLORS`.
     *
     * @example
     * error.showSourceCode() //=> "a {
     *                        //      bad
     *                        //      ^
     *                        //    }"
     *
     * @return {string} few lines of CSS source that caused the error
     */


    CssSyntaxError.prototype.showSourceCode = function showSourceCode(color) {
        if (!this.source) return '';

        var num = this.line - 1;
        var lines = this.source.split('\n');

        var prev = num > 0 ? lines[num - 1] + '\n' : '';
        var broken = lines[num];
        var next = num < lines.length - 1 ? '\n' + lines[num + 1] : '';

        var mark = '\n';
        for (var i = 0; i < this.column - 1; i++) {
            mark += ' ';
        }

        if (typeof color === 'undefined') color = _supportsColor2.default;
        if (color) {
            mark += '\x1B[1;31m^\x1B[0m';
        } else {
            mark += '^';
        }

        return '\n' + prev + broken + mark + next;
    };

    /**
     * Returns error position, message and source code of the broken part.
     *
     * @example
     * error.toString() //=> "CssSyntaxError: app.css:1:1: Unclosed block
     *                  //    a {
     *                  //    ^"
     *
     * @return {string} error position, message and source code
     */


    CssSyntaxError.prototype.toString = function toString() {
        return this.name + ': ' + this.message + this.showSourceCode();
    };

    _createClass(CssSyntaxError, [{
        key: 'generated',
        get: function get() {
            (0, _warnOnce2.default)('CssSyntaxError#generated is depreacted. Use input instead.');
            return this.input;
        }

        /**
         * @memberof CssSyntaxError#
         * @member {Input} input - Input object with PostCSS internal information
         *                         about input file. If input has source map
         *                         from previous tool, PostCSS will use origin
         *                         (for example, Sass) source. You can use this
         *                         object to get PostCSS input source.
         *
         * @example
         * error.input.file //=> 'a.css'
         * error.file       //=> 'a.sass'
         */

    }]);

    return CssSyntaxError;
}();

exports.default = CssSyntaxError;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNzcy1zeW50YXgtZXJyb3IuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZCTSxjOzs7Ozs7Ozs7OztBQVVGLDRCQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsTUFBM0IsRUFBbUMsTUFBbkMsRUFBMkMsSUFBM0MsRUFBaUQsTUFBakQsRUFBeUQ7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFhckQsYUFBSyxJQUFMLEdBQWMsZ0JBQWQ7Ozs7Ozs7QUFPQSxhQUFLLE1BQUwsR0FBYyxPQUFkOztBQUVBLFlBQUssSUFBTCxFQUFZOzs7Ozs7OztBQVFSLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0g7QUFDRCxZQUFLLE1BQUwsRUFBYzs7Ozs7Ozs7QUFRVixpQkFBSyxNQUFMLEdBQWMsTUFBZDtBQUNIO0FBQ0QsWUFBSyxNQUFMLEVBQWM7Ozs7Ozs7QUFPVixpQkFBSyxNQUFMLEdBQWMsTUFBZDtBQUNIO0FBQ0QsWUFBSyxPQUFPLElBQVAsS0FBZ0IsV0FBaEIsSUFBK0IsT0FBTyxNQUFQLEtBQWtCLFdBQXRELEVBQW9FOzs7Ozs7OztBQVFoRSxpQkFBSyxJQUFMLEdBQWMsSUFBZDs7Ozs7Ozs7QUFRQSxpQkFBSyxNQUFMLEdBQWMsTUFBZDtBQUNIOztBQUVELGFBQUssVUFBTDs7QUFFQSxZQUFLLE1BQU0saUJBQVgsRUFBK0I7QUFDM0Isa0JBQU0saUJBQU4sQ0FBd0IsSUFBeEIsRUFBOEIsY0FBOUI7QUFDSDtBQUNKOzs2QkFFRCxVLHlCQUFhOzs7Ozs7OztBQVFULGFBQUssT0FBTCxHQUFnQixLQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsR0FBYyxJQUE1QixHQUFtQyxFQUFuRDtBQUNBLGFBQUssT0FBTCxJQUFnQixLQUFLLElBQUwsR0FBWSxLQUFLLElBQWpCLEdBQXdCLGFBQXhDO0FBQ0EsWUFBSyxPQUFPLEtBQUssSUFBWixLQUFxQixXQUExQixFQUF3QztBQUNwQyxpQkFBSyxPQUFMLElBQWdCLE1BQU0sS0FBSyxJQUFYLEdBQWtCLEdBQWxCLEdBQXdCLEtBQUssTUFBN0M7QUFDSDtBQUNELGFBQUssT0FBTCxJQUFnQixPQUFPLEtBQUssTUFBNUI7QUFDSCxLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFxQkQsYywyQkFBZSxLLEVBQU87QUFDbEIsWUFBSyxDQUFDLEtBQUssTUFBWCxFQUFvQixPQUFPLEVBQVA7O0FBRXBCLFlBQUksTUFBUSxLQUFLLElBQUwsR0FBWSxDQUF4QjtBQUNBLFlBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLElBQWxCLENBQVo7O0FBRUEsWUFBSSxPQUFTLE1BQU0sQ0FBTixHQUFVLE1BQU0sTUFBTSxDQUFaLElBQWlCLElBQTNCLEdBQWtDLEVBQS9DO0FBQ0EsWUFBSSxTQUFTLE1BQU0sR0FBTixDQUFiO0FBQ0EsWUFBSSxPQUFTLE1BQU0sTUFBTSxNQUFOLEdBQWUsQ0FBckIsR0FBeUIsT0FBTyxNQUFNLE1BQU0sQ0FBWixDQUFoQyxHQUFpRCxFQUE5RDs7QUFFQSxZQUFJLE9BQU8sSUFBWDtBQUNBLGFBQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxLQUFLLE1BQUwsR0FBYyxDQUFuQyxFQUFzQyxHQUF0QyxFQUE0QztBQUN4QyxvQkFBUSxHQUFSO0FBQ0g7O0FBRUQsWUFBSyxPQUFPLEtBQVAsS0FBaUIsV0FBdEIsRUFBb0M7QUFDcEMsWUFBSyxLQUFMLEVBQWE7QUFDVCxvQkFBUSxvQkFBUjtBQUNILFNBRkQsTUFFTztBQUNILG9CQUFRLEdBQVI7QUFDSDs7QUFFRCxlQUFPLE9BQU8sSUFBUCxHQUFjLE1BQWQsR0FBdUIsSUFBdkIsR0FBOEIsSUFBckM7QUFDSCxLOzs7Ozs7Ozs7Ozs7Ozs2QkFZRCxRLHVCQUFXO0FBQ1AsZUFBTyxLQUFLLElBQUwsR0FBWSxJQUFaLEdBQW1CLEtBQUssT0FBeEIsR0FBa0MsS0FBSyxjQUFMLEVBQXpDO0FBQ0gsSzs7Ozs0QkFFZTtBQUNaLG9DQUFTLDREQUFUO0FBQ0EsbUJBQU8sS0FBSyxLQUFaO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQWlCVSxjIiwiZmlsZSI6ImNzcy1zeW50YXgtZXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3VwcG9ydHNDb2xvciBmcm9tICdzdXBwb3J0cy1jb2xvcic7XG5cbmltcG9ydCB3YXJuT25jZSBmcm9tICcuL3dhcm4tb25jZSc7XG5cbi8qKlxuICogVGhlIENTUyBwYXJzZXIgdGhyb3dzIHRoaXMgZXJyb3IgZm9yIGJyb2tlbiBDU1MuXG4gKlxuICogQ3VzdG9tIHBhcnNlcnMgY2FuIHRocm93IHRoaXMgZXJyb3IgZm9yIGJyb2tlbiBjdXN0b20gc3ludGF4IHVzaW5nXG4gKiB0aGUge0BsaW5rIE5vZGUjZXJyb3J9IG1ldGhvZC5cbiAqXG4gKiBQb3N0Q1NTIHdpbGwgdXNlIHRoZSBpbnB1dCBzb3VyY2UgbWFwIHRvIGRldGVjdCB0aGUgb3JpZ2luYWwgZXJyb3IgbG9jYXRpb24uXG4gKiBJZiB5b3Ugd3JvdGUgYSBTYXNzIGZpbGUsIGNvbXBpbGVkIGl0IHRvIENTUyBhbmQgdGhlbiBwYXJzZWQgaXQgd2l0aCBQb3N0Q1NTLFxuICogUG9zdENTUyB3aWxsIHNob3cgdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGluIHRoZSBTYXNzIGZpbGUuXG4gKlxuICogSWYgeW91IG5lZWQgdGhlIHBvc2l0aW9uIGluIHRoZSBQb3N0Q1NTIGlucHV0XG4gKiAoZS5nLiwgdG8gZGVidWcgdGhlIHByZXZpb3VzIGNvbXBpbGVyKSwgdXNlIGBlcnJvci5pbnB1dC5maWxlYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2F0Y2hpbmcgYW5kIGNoZWNraW5nIHN5bnRheCBlcnJvclxuICogdHJ5IHtcbiAqICAgcG9zdGNzcy5wYXJzZSgnYXsnKVxuICogfSBjYXRjaCAoZXJyb3IpIHtcbiAqICAgaWYgKCBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICkge1xuICogICAgIGVycm9yIC8vPT4gQ3NzU3ludGF4RXJyb3JcbiAqICAgfVxuICogfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSYWlzaW5nIGVycm9yIGZyb20gcGx1Z2luXG4gKiB0aHJvdyBub2RlLmVycm9yKCdVbmtub3duIHZhcmlhYmxlJywgeyBwbHVnaW46ICdwb3N0Y3NzLXZhcnMnIH0pO1xuICovXG5jbGFzcyBDc3NTeW50YXhFcnJvciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAgLSBlcnJvciBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtsaW5lXSAgIC0gc291cmNlIGxpbmUgb2YgdGhlIGVycm9yXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjb2x1bW5dIC0gc291cmNlIGNvbHVtbiBvZiB0aGUgZXJyb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NvdXJjZV0gLSBzb3VyY2UgY29kZSBvZiB0aGUgYnJva2VuIGZpbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2ZpbGVdICAgLSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBicm9rZW4gZmlsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcGx1Z2luXSAtIFBvc3RDU1MgcGx1Z2luIG5hbWUsIGlmIGVycm9yIGNhbWUgZnJvbSBwbHVnaW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBsaW5lLCBjb2x1bW4sIHNvdXJjZSwgZmlsZSwgcGx1Z2luKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQWx3YXlzIGVxdWFsIHRvIGAnQ3NzU3ludGF4RXJyb3InYC4gWW91IHNob3VsZFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgYWx3YXlzIGNoZWNrIGVycm9yIHR5cGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGJ5IGBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InYCBpbnN0ZWFkIG9mXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBgZXJyb3IgaW5zdGFuY2VvZiBDc3NTeW50YXhFcnJvcmAsIGJlY2F1c2VcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIG5wbSBjb3VsZCBoYXZlIHNldmVyYWwgUG9zdENTUyB2ZXJzaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogaWYgKCBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICkge1xuICAgICAgICAgKiAgIGVycm9yIC8vPT4gQ3NzU3ludGF4RXJyb3JcbiAgICAgICAgICogfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lICAgPSAnQ3NzU3ludGF4RXJyb3InO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEVycm9yIG1lc3NhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGVycm9yLm1lc3NhZ2UgLy89PiAnVW5jbG9zZWQgYmxvY2snXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlYXNvbiA9IG1lc3NhZ2U7XG5cbiAgICAgICAgaWYgKCBmaWxlICkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQWJzb2x1dGUgcGF0aCB0byB0aGUgYnJva2VuIGZpbGUuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLmZpbGUgICAgICAgLy89PiAnYS5zYXNzJ1xuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQuZmlsZSAvLz0+ICdhLmNzcydcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHNvdXJjZSApIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIFNvdXJjZSBjb2RlIG9mIHRoZSBicm9rZW4gZmlsZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogZXJyb3Iuc291cmNlICAgICAgIC8vPT4gJ2EgeyBiIHt9IH0nXG4gICAgICAgICAgICAgKiBlcnJvci5pbnB1dC5jb2x1bW4gLy89PiAnYSBiIHsgfSdcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBwbHVnaW4gKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBQbHVnaW4gbmFtZSwgaWYgZXJyb3IgY2FtZSBmcm9tIHBsdWdpbi5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogZXJyb3IucGx1Z2luIC8vPT4gJ3Bvc3Rjc3MtdmFycydcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2YgbGluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbHVtbiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gLSBTb3VyY2UgbGluZSBvZiB0aGUgZXJyb3IuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLmxpbmUgICAgICAgLy89PiAyXG4gICAgICAgICAgICAgKiBlcnJvci5pbnB1dC5saW5lIC8vPT4gNFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmxpbmUgICA9IGxpbmU7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gLSBTb3VyY2UgY29sdW1uIG9mIHRoZSBlcnJvci5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogZXJyb3IuY29sdW1uICAgICAgIC8vPT4gMVxuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQuY29sdW1uIC8vPT4gNFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TWVzc2FnZSgpO1xuXG4gICAgICAgIGlmICggRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgKSB7XG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDc3NTeW50YXhFcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEZ1bGwgZXJyb3IgdGV4dCBpbiB0aGUgR05VIGVycm9yIGZvcm1hdFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgd2l0aCBwbHVnaW4sIGZpbGUsIGxpbmUgYW5kIGNvbHVtbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogZXJyb3IubWVzc2FnZSAvLz0+ICdhLmNzczoxOjE6IFVuY2xvc2VkIGJsb2NrJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tZXNzYWdlICA9IHRoaXMucGx1Z2luID8gdGhpcy5wbHVnaW4gKyAnOiAnIDogJyc7XG4gICAgICAgIHRoaXMubWVzc2FnZSArPSB0aGlzLmZpbGUgPyB0aGlzLmZpbGUgOiAnPGNzcyBpbnB1dD4nO1xuICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLmxpbmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlICs9ICc6JyArIHRoaXMubGluZSArICc6JyArIHRoaXMuY29sdW1uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVzc2FnZSArPSAnOiAnICsgdGhpcy5yZWFzb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZldyBsaW5lcyBvZiBDU1Mgc291cmNlIHRoYXQgY2F1c2VkIHRoZSBlcnJvci5cbiAgICAgKlxuICAgICAqIElmIHRoZSBDU1MgaGFzIGFuIGlucHV0IHNvdXJjZSBtYXAgd2l0aG91dCBgc291cmNlQ29udGVudGAsXG4gICAgICogdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY29sb3JdIHdoZXRoZXIgYXJyb3cgd2lsbCBiZSBjb2xvcmVkIHJlZCBieSB0ZXJtaW5hbFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciBjb2Rlcy4gQnkgZGVmYXVsdCwgUG9zdENTUyB3aWxsIGRldGVjdFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciBzdXBwb3J0IGJ5IGBwcm9jZXNzLnN0ZG91dC5pc1RUWWBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGBwcm9jZXNzLmVudi5OT0RFX0RJU0FCTEVfQ09MT1JTYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXJyb3Iuc2hvd1NvdXJjZUNvZGUoKSAvLz0+IFwiYSB7XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIGJhZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICBeXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB9XCJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gZmV3IGxpbmVzIG9mIENTUyBzb3VyY2UgdGhhdCBjYXVzZWQgdGhlIGVycm9yXG4gICAgICovXG4gICAgc2hvd1NvdXJjZUNvZGUoY29sb3IpIHtcbiAgICAgICAgaWYgKCAhdGhpcy5zb3VyY2UgKSByZXR1cm4gJyc7XG5cbiAgICAgICAgbGV0IG51bSAgID0gdGhpcy5saW5lIC0gMTtcbiAgICAgICAgbGV0IGxpbmVzID0gdGhpcy5zb3VyY2Uuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGxldCBwcmV2ICAgPSBudW0gPiAwID8gbGluZXNbbnVtIC0gMV0gKyAnXFxuJyA6ICcnO1xuICAgICAgICBsZXQgYnJva2VuID0gbGluZXNbbnVtXTtcbiAgICAgICAgbGV0IG5leHQgICA9IG51bSA8IGxpbmVzLmxlbmd0aCAtIDEgPyAnXFxuJyArIGxpbmVzW251bSArIDFdIDogJyc7XG5cbiAgICAgICAgbGV0IG1hcmsgPSAnXFxuJztcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW4gLSAxOyBpKysgKSB7XG4gICAgICAgICAgICBtYXJrICs9ICcgJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdHlwZW9mIGNvbG9yID09PSAndW5kZWZpbmVkJyApIGNvbG9yID0gc3VwcG9ydHNDb2xvcjtcbiAgICAgICAgaWYgKCBjb2xvciApIHtcbiAgICAgICAgICAgIG1hcmsgKz0gJ1xceDFCWzE7MzFtXlxceDFCWzBtJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hcmsgKz0gJ14nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICdcXG4nICsgcHJldiArIGJyb2tlbiArIG1hcmsgKyBuZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZXJyb3IgcG9zaXRpb24sIG1lc3NhZ2UgYW5kIHNvdXJjZSBjb2RlIG9mIHRoZSBicm9rZW4gcGFydC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXJyb3IudG9TdHJpbmcoKSAvLz0+IFwiQ3NzU3ludGF4RXJyb3I6IGFwcC5jc3M6MToxOiBVbmNsb3NlZCBibG9ja1xuICAgICAqICAgICAgICAgICAgICAgICAgLy8gICAgYSB7XG4gICAgICogICAgICAgICAgICAgICAgICAvLyAgICBeXCJcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gZXJyb3IgcG9zaXRpb24sIG1lc3NhZ2UgYW5kIHNvdXJjZSBjb2RlXG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyAnOiAnICsgdGhpcy5tZXNzYWdlICsgdGhpcy5zaG93U291cmNlQ29kZSgpO1xuICAgIH1cblxuICAgIGdldCBnZW5lcmF0ZWQoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDc3NTeW50YXhFcnJvciNnZW5lcmF0ZWQgaXMgZGVwcmVhY3RlZC4gVXNlIGlucHV0IGluc3RlYWQuJyk7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBDc3NTeW50YXhFcnJvciNcbiAgICAgKiBAbWVtYmVyIHtJbnB1dH0gaW5wdXQgLSBJbnB1dCBvYmplY3Qgd2l0aCBQb3N0Q1NTIGludGVybmFsIGluZm9ybWF0aW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgYWJvdXQgaW5wdXQgZmlsZS4gSWYgaW5wdXQgaGFzIHNvdXJjZSBtYXBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIHByZXZpb3VzIHRvb2wsIFBvc3RDU1Mgd2lsbCB1c2Ugb3JpZ2luXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgKGZvciBleGFtcGxlLCBTYXNzKSBzb3VyY2UuIFlvdSBjYW4gdXNlIHRoaXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgdG8gZ2V0IFBvc3RDU1MgaW5wdXQgc291cmNlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBlcnJvci5pbnB1dC5maWxlIC8vPT4gJ2EuY3NzJ1xuICAgICAqIGVycm9yLmZpbGUgICAgICAgLy89PiAnYS5zYXNzJ1xuICAgICAqL1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENzc1N5bnRheEVycm9yO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
