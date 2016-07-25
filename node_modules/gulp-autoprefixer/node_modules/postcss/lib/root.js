'use strict';

exports.__esModule = true;

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a CSS file and contains all its parsed nodes.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('a{color:black} b{z-index:2}');
 * root.type         //=> 'root'
 * root.nodes.length //=> 2
 */

var Root = function (_Container) {
    _inherits(Root, _Container);

    function Root(defaults) {
        _classCallCheck(this, Root);

        var _this = _possibleConstructorReturn(this, _Container.call(this, defaults));

        _this.type = 'root';
        if (!_this.nodes) _this.nodes = [];
        return _this;
    }

    Root.prototype.removeChild = function removeChild(child) {
        child = this.index(child);

        if (child === 0 && this.nodes.length > 1) {
            this.nodes[1].raws.before = this.nodes[child].raws.before;
        }

        return _Container.prototype.removeChild.call(this, child);
    };

    Root.prototype.normalize = function normalize(child, sample, type) {
        var nodes = _Container.prototype.normalize.call(this, child);

        if (sample) {
            if (type === 'prepend') {
                if (this.nodes.length > 1) {
                    sample.raws.before = this.nodes[1].raws.before;
                } else {
                    delete sample.raws.before;
                }
            } else if (this.first !== sample) {
                for (var _iterator = nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var node = _ref;

                    node.raws.before = sample.raws.before;
                }
            }
        }

        return nodes;
    };

    /**
     * Returns a {@link Result} instance representing the root’s CSS.
     *
     * @param {processOptions} [opts] - options with only `to` and `map` keys
     *
     * @return {Result} result with current root’s CSS
     *
     * @example
     * const root1 = postcss.parse(css1, { from: 'a.css' });
     * const root2 = postcss.parse(css2, { from: 'b.css' });
     * root1.append(root2);
     * const result = root1.toResult({ to: 'all.css', map: true });
     */


    Root.prototype.toResult = function toResult() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var LazyResult = require('./lazy-result');
        var Processor = require('./processor');

        var lazy = new LazyResult(new Processor(), this, opts);
        return lazy.stringify();
    };

    Root.prototype.remove = function remove(child) {
        (0, _warnOnce2.default)('Root#remove is deprecated. Use Root#removeChild');
        this.removeChild(child);
    };

    Root.prototype.prevMap = function prevMap() {
        (0, _warnOnce2.default)('Root#prevMap is deprecated. Use Root#source.input.map');
        return this.source.input.map;
    };

    /**
     * @memberof Root#
     * @member {object} raws - Information to generate byte-to-byte equal
     *                         node string as it was in the origin input.
     *
     * Every parser saves its own properties,
     * but the default CSS parser uses:
     *
     * * `after`: the space symbols after the last child to the end of file.
     * * `semicolon`: is the last child has an (optional) semicolon.
     *
     * @example
     * postcss.parse('a {}\n').raws //=> { after: '\n' }
     * postcss.parse('a {}').raws   //=> { after: '' }
     */

    return Root;
}(_container2.default);

exports.default = Root;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvb3QuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVlNLEk7OztBQUVGLGtCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFBQSxxREFDbEIsc0JBQU0sUUFBTixDQURrQjs7QUFFbEIsY0FBSyxJQUFMLEdBQVksTUFBWjtBQUNBLFlBQUssQ0FBQyxNQUFLLEtBQVgsRUFBbUIsTUFBSyxLQUFMLEdBQWEsRUFBYjtBQUhEO0FBSXJCOzttQkFFRCxXLHdCQUFZLEssRUFBTztBQUNmLGdCQUFRLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBUjs7QUFFQSxZQUFLLFVBQVUsQ0FBVixJQUFlLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsQ0FBeEMsRUFBNEM7QUFDeEMsaUJBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxJQUFkLENBQW1CLE1BQW5CLEdBQTRCLEtBQUssS0FBTCxDQUFXLEtBQVgsRUFBa0IsSUFBbEIsQ0FBdUIsTUFBbkQ7QUFDSDs7QUFFRCxlQUFPLHFCQUFNLFdBQU4sWUFBa0IsS0FBbEIsQ0FBUDtBQUNILEs7O21CQUVELFMsc0JBQVUsSyxFQUFPLE0sRUFBUSxJLEVBQU07QUFDM0IsWUFBSSxRQUFRLHFCQUFNLFNBQU4sWUFBZ0IsS0FBaEIsQ0FBWjs7QUFFQSxZQUFLLE1BQUwsRUFBYztBQUNWLGdCQUFLLFNBQVMsU0FBZCxFQUEwQjtBQUN0QixvQkFBSyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLENBQXpCLEVBQTZCO0FBQ3pCLDJCQUFPLElBQVAsQ0FBWSxNQUFaLEdBQXFCLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxJQUFkLENBQW1CLE1BQXhDO0FBQ0gsaUJBRkQsTUFFTztBQUNILDJCQUFPLE9BQU8sSUFBUCxDQUFZLE1BQW5CO0FBQ0g7QUFDSixhQU5ELE1BTU8sSUFBSyxLQUFLLEtBQUwsS0FBZSxNQUFwQixFQUE2QjtBQUNoQyxxQ0FBa0IsS0FBbEIsa0hBQTBCO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSx3QkFBaEIsSUFBZ0I7O0FBQ3RCLHlCQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLE9BQU8sSUFBUCxDQUFZLE1BQS9CO0FBQ0g7QUFDSjtBQUNKOztBQUVELGVBQU8sS0FBUDtBQUNILEs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQWVELFEsdUJBQXFCO0FBQUEsWUFBWixJQUFZLHlEQUFMLEVBQUs7O0FBQ2pCLFlBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7QUFDQSxZQUFJLFlBQWEsUUFBUSxhQUFSLENBQWpCOztBQUVBLFlBQUksT0FBTyxJQUFJLFVBQUosQ0FBZSxJQUFJLFNBQUosRUFBZixFQUFnQyxJQUFoQyxFQUFzQyxJQUF0QyxDQUFYO0FBQ0EsZUFBTyxLQUFLLFNBQUwsRUFBUDtBQUNILEs7O21CQUVELE0sbUJBQU8sSyxFQUFPO0FBQ1YsZ0NBQVMsaURBQVQ7QUFDQSxhQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDSCxLOzttQkFFRCxPLHNCQUFVO0FBQ04sZ0NBQVMsdURBQVQ7QUFDQSxlQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsR0FBekI7QUFDSCxLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBb0JVLEkiLCJmaWxlIjoicm9vdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb250YWluZXIgZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHdhcm5PbmNlICBmcm9tICcuL3dhcm4tb25jZSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENTUyBmaWxlIGFuZCBjb250YWlucyBhbGwgaXRzIHBhcnNlZCBub2Rlcy5cbiAqXG4gKiBAZXh0ZW5kcyBDb250YWluZXJcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2F7Y29sb3I6YmxhY2t9IGJ7ei1pbmRleDoyfScpO1xuICogcm9vdC50eXBlICAgICAgICAgLy89PiAncm9vdCdcbiAqIHJvb3Qubm9kZXMubGVuZ3RoIC8vPT4gMlxuICovXG5jbGFzcyBSb290IGV4dGVuZHMgQ29udGFpbmVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGRlZmF1bHRzKSB7XG4gICAgICAgIHN1cGVyKGRlZmF1bHRzKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3Jvb3QnO1xuICAgICAgICBpZiAoICF0aGlzLm5vZGVzICkgdGhpcy5ub2RlcyA9IFtdO1xuICAgIH1cblxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkID0gdGhpcy5pbmRleChjaGlsZCk7XG5cbiAgICAgICAgaWYgKCBjaGlsZCA9PT0gMCAmJiB0aGlzLm5vZGVzLmxlbmd0aCA+IDEgKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVzWzFdLnJhd3MuYmVmb3JlID0gdGhpcy5ub2Rlc1tjaGlsZF0ucmF3cy5iZWZvcmU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwZXIucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZShjaGlsZCwgc2FtcGxlLCB0eXBlKSB7XG4gICAgICAgIGxldCBub2RlcyA9IHN1cGVyLm5vcm1hbGl6ZShjaGlsZCk7XG5cbiAgICAgICAgaWYgKCBzYW1wbGUgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdwcmVwZW5kJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMubm9kZXMubGVuZ3RoID4gMSApIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlLnJhd3MuYmVmb3JlID0gdGhpcy5ub2Rlc1sxXS5yYXdzLmJlZm9yZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2FtcGxlLnJhd3MuYmVmb3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuZmlyc3QgIT09IHNhbXBsZSApIHtcbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgbm9kZSBvZiBub2RlcyApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSA9IHNhbXBsZS5yYXdzLmJlZm9yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHtAbGluayBSZXN1bHR9IGluc3RhbmNlIHJlcHJlc2VudGluZyB0aGUgcm9vdOKAmXMgQ1NTLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtwcm9jZXNzT3B0aW9uc30gW29wdHNdIC0gb3B0aW9ucyB3aXRoIG9ubHkgYHRvYCBhbmQgYG1hcGAga2V5c1xuICAgICAqXG4gICAgICogQHJldHVybiB7UmVzdWx0fSByZXN1bHQgd2l0aCBjdXJyZW50IHJvb3TigJlzIENTU1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290MSA9IHBvc3Rjc3MucGFyc2UoY3NzMSwgeyBmcm9tOiAnYS5jc3MnIH0pO1xuICAgICAqIGNvbnN0IHJvb3QyID0gcG9zdGNzcy5wYXJzZShjc3MyLCB7IGZyb206ICdiLmNzcycgfSk7XG4gICAgICogcm9vdDEuYXBwZW5kKHJvb3QyKTtcbiAgICAgKiBjb25zdCByZXN1bHQgPSByb290MS50b1Jlc3VsdCh7IHRvOiAnYWxsLmNzcycsIG1hcDogdHJ1ZSB9KTtcbiAgICAgKi9cbiAgICB0b1Jlc3VsdChvcHRzID0geyB9KSB7XG4gICAgICAgIGxldCBMYXp5UmVzdWx0ID0gcmVxdWlyZSgnLi9sYXp5LXJlc3VsdCcpO1xuICAgICAgICBsZXQgUHJvY2Vzc29yICA9IHJlcXVpcmUoJy4vcHJvY2Vzc29yJyk7XG5cbiAgICAgICAgbGV0IGxhenkgPSBuZXcgTGF6eVJlc3VsdChuZXcgUHJvY2Vzc29yKCksIHRoaXMsIG9wdHMpO1xuICAgICAgICByZXR1cm4gbGF6eS5zdHJpbmdpZnkoKTtcbiAgICB9XG5cbiAgICByZW1vdmUoY2hpbGQpIHtcbiAgICAgICAgd2Fybk9uY2UoJ1Jvb3QjcmVtb3ZlIGlzIGRlcHJlY2F0ZWQuIFVzZSBSb290I3JlbW92ZUNoaWxkJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIHByZXZNYXAoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdSb290I3ByZXZNYXAgaXMgZGVwcmVjYXRlZC4gVXNlIFJvb3Qjc291cmNlLmlucHV0Lm1hcCcpO1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UuaW5wdXQubWFwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBSb290I1xuICAgICAqIEBtZW1iZXIge29iamVjdH0gcmF3cyAtIEluZm9ybWF0aW9uIHRvIGdlbmVyYXRlIGJ5dGUtdG8tYnl0ZSBlcXVhbFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgc3RyaW5nIGFzIGl0IHdhcyBpbiB0aGUgb3JpZ2luIGlucHV0LlxuICAgICAqXG4gICAgICogRXZlcnkgcGFyc2VyIHNhdmVzIGl0cyBvd24gcHJvcGVydGllcyxcbiAgICAgKiBidXQgdGhlIGRlZmF1bHQgQ1NTIHBhcnNlciB1c2VzOlxuICAgICAqXG4gICAgICogKiBgYWZ0ZXJgOiB0aGUgc3BhY2Ugc3ltYm9scyBhZnRlciB0aGUgbGFzdCBjaGlsZCB0byB0aGUgZW5kIG9mIGZpbGUuXG4gICAgICogKiBgc2VtaWNvbG9uYDogaXMgdGhlIGxhc3QgY2hpbGQgaGFzIGFuIChvcHRpb25hbCkgc2VtaWNvbG9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwb3N0Y3NzLnBhcnNlKCdhIHt9XFxuJykucmF3cyAvLz0+IHsgYWZ0ZXI6ICdcXG4nIH1cbiAgICAgKiBwb3N0Y3NzLnBhcnNlKCdhIHt9JykucmF3cyAgIC8vPT4geyBhZnRlcjogJycgfVxuICAgICAqL1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJvb3Q7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
