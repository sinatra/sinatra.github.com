'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function cleanSource(nodes) {
    return nodes.map(function (i) {
        if (i.nodes) i.nodes = cleanSource(i.nodes);
        delete i.source;
        return i;
    });
}

/**
 * @callback childCondition
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @param {Node[]} nodes - all container children
 * @return {boolean}
 */

/**
 * @callback childIterator
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @return {false|undefined} returning `false` will break iteration
 */

/**
 * The {@link Root}, {@link AtRule}, and {@link Rule} container nodes
 * inherit some common methods to help work with their children.
 *
 * Note that all containers can store any content. If you write a rule inside
 * a rule, PostCSS will parse it.
 *
 * @extends Node
 * @abstract
 * @ignore
 */

var Container = function (_Node) {
    _inherits(Container, _Node);

    function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, _Node.apply(this, arguments));
    }

    Container.prototype.push = function push(child) {
        child.parent = this;
        this.nodes.push(child);
        return this;
    };

    /**
     * Iterates through the container’s immediate children,
     * calling `callback` for each child.
     *
     * Returning `false` in the callback will break iteration.
     *
     * This method only iterates through the container’s immediate children.
     * If you need to recursively iterate through all the container’s descendant
     * nodes, use {@link Container#walk}.
     *
     * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
     * if you are mutating the array of child nodes during iteration.
     * PostCSS will adjust the current index to match the mutations.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * const root = postcss.parse('a { color: black; z-index: 1 }');
     * const rule = root.first;
     *
     * for ( let decl of rule.nodes ) {
     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
     *     // Cycle will be infinite, because cloneBefore moves the current node
     *     // to the next index
     * }
     *
     * rule.each(decl => {
     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
     *     // Will be executed only for color and z-index
     * });
     */


    Container.prototype.each = function each(callback) {
        if (!this.lastEach) this.lastEach = 0;
        if (!this.indexes) this.indexes = {};

        this.lastEach += 1;
        var id = this.lastEach;
        this.indexes[id] = 0;

        if (!this.nodes) return undefined;

        var index = void 0,
            result = void 0;
        while (this.indexes[id] < this.nodes.length) {
            index = this.indexes[id];
            result = callback(this.nodes[index], index);
            if (result === false) break;

            this.indexes[id] += 1;
        }

        delete this.indexes[id];

        return result;
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each node.
     *
     * Like container.each(), this method is safe to use
     * if you are mutating arrays during iteration.
     *
     * If you only need to iterate through the container’s immediate children,
     * use {@link Container#each}.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walk(node => {
     *   // Traverses all descendant nodes.
     * });
     */


    Container.prototype.walk = function walk(callback) {
        return this.each(function (child, i) {
            var result = callback(child, i);
            if (result !== false && child.walk) {
                result = child.walk(callback);
            }
            return result;
        });
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each declaration node.
     *
     * If you pass a filter, iteration will only happen over declarations
     * with matching properties.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [prop]   - string or regular expression
     *                                   to filter declarations by property name
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkDecls(decl => {
     *   checkPropertySupport(decl.prop);
     * });
     *
     * root.walkDecls('border-radius', decl => {
     *   decl.remove();
     * });
     *
     * root.walkDecls(/^background/, decl => {
     *   decl.value = takeFirstColorFromGradient(decl.value);
     * });
     */


    Container.prototype.walkDecls = function walkDecls(prop, callback) {
        if (!callback) {
            callback = prop;
            return this.walk(function (child, i) {
                if (child.type === 'decl') {
                    return callback(child, i);
                }
            });
        } else if (prop instanceof RegExp) {
            return this.walk(function (child, i) {
                if (child.type === 'decl' && prop.test(child.prop)) {
                    return callback(child, i);
                }
            });
        } else {
            return this.walk(function (child, i) {
                if (child.type === 'decl' && child.prop === prop) {
                    return callback(child, i);
                }
            });
        }
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each rule node.
     *
     * If you pass a filter, iteration will only happen over rules
     * with matching selectors.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [selector] - string or regular expression
     *                                     to filter rules by selector
     * @param {childIterator} callback   - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * const selectors = [];
     * root.walkRules(rule => {
     *   selectors.push(rule.selector);
     * });
     * console.log(`Your CSS uses ${selectors.length} selectors');
     */


    Container.prototype.walkRules = function walkRules(selector, callback) {
        if (!callback) {
            callback = selector;

            return this.walk(function (child, i) {
                if (child.type === 'rule') {
                    return callback(child, i);
                }
            });
        } else if (selector instanceof RegExp) {
            return this.walk(function (child, i) {
                if (child.type === 'rule' && selector.test(child.selector)) {
                    return callback(child, i);
                }
            });
        } else {
            return this.walk(function (child, i) {
                if (child.type === 'rule' && child.selector === selector) {
                    return callback(child, i);
                }
            });
        }
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each at-rule node.
     *
     * If you pass a filter, iteration will only happen over at-rules
     * that have matching names.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [name]   - string or regular expression
     *                                   to filter at-rules by name
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkAtRules(rule => {
     *   if ( isOld(rule.name) ) rule.remove();
     * });
     *
     * let first = false;
     * root.walkAtRules('charset', rule => {
     *   if ( !first ) {
     *     first = true;
     *   } else {
     *     rule.remove();
     *   }
     * });
     */


    Container.prototype.walkAtRules = function walkAtRules(name, callback) {
        if (!callback) {
            callback = name;
            return this.walk(function (child, i) {
                if (child.type === 'atrule') {
                    return callback(child, i);
                }
            });
        } else if (name instanceof RegExp) {
            return this.walk(function (child, i) {
                if (child.type === 'atrule' && name.test(child.name)) {
                    return callback(child, i);
                }
            });
        } else {
            return this.walk(function (child, i) {
                if (child.type === 'atrule' && child.name === name) {
                    return callback(child, i);
                }
            });
        }
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each comment node.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkComments(comment => {
     *   comment.remove();
     * });
     */


    Container.prototype.walkComments = function walkComments(callback) {
        return this.walk(function (child, i) {
            if (child.type === 'comment') {
                return callback(child, i);
            }
        });
    };

    /**
     * Inserts new nodes to the start of the container.
     *
     * @param {...(Node|object|string|Node[])} children - new nodes
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
     * rule.append(decl1, decl2);
     *
     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
     * root.append({ selector: 'a' });                       // rule
     * rule.append({ prop: 'color', value: 'black' });       // declaration
     * rule.append({ text: 'Comment' })                      // comment
     *
     * root.append('a {}');
     * root.first.append('color: black; z-index: 1');
     */


    Container.prototype.append = function append() {
        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
            children[_key] = arguments[_key];
        }

        for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var child = _ref;

            var nodes = this.normalize(child, this.last);
            for (var _iterator2 = nodes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var node = _ref2;
                this.nodes.push(node);
            }
        }
        return this;
    };

    /**
     * Inserts new nodes to the end of the container.
     *
     * @param {...(Node|object|string|Node[])} children - new nodes
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
     * rule.prepend(decl1, decl2);
     *
     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
     * root.append({ selector: 'a' });                       // rule
     * rule.append({ prop: 'color', value: 'black' });       // declaration
     * rule.append({ text: 'Comment' })                      // comment
     *
     * root.append('a {}');
     * root.first.append('color: black; z-index: 1');
     */


    Container.prototype.prepend = function prepend() {
        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            children[_key2] = arguments[_key2];
        }

        children = children.reverse();
        for (var _iterator3 = children, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
            }

            var child = _ref3;

            var nodes = this.normalize(child, this.first, 'prepend').reverse();
            for (var _iterator4 = nodes, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                var _ref4;

                if (_isArray4) {
                    if (_i4 >= _iterator4.length) break;
                    _ref4 = _iterator4[_i4++];
                } else {
                    _i4 = _iterator4.next();
                    if (_i4.done) break;
                    _ref4 = _i4.value;
                }

                var node = _ref4;
                this.nodes.unshift(node);
            }for (var id in this.indexes) {
                this.indexes[id] = this.indexes[id] + nodes.length;
            }
        }
        return this;
    };

    Container.prototype.cleanRaws = function cleanRaws(keepBetween) {
        _Node.prototype.cleanRaws.call(this, keepBetween);
        if (this.nodes) {
            for (var _iterator5 = this.nodes, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                var _ref5;

                if (_isArray5) {
                    if (_i5 >= _iterator5.length) break;
                    _ref5 = _iterator5[_i5++];
                } else {
                    _i5 = _iterator5.next();
                    if (_i5.done) break;
                    _ref5 = _i5.value;
                }

                var node = _ref5;
                node.cleanRaws(keepBetween);
            }
        }
    };

    /**
     * Insert new node before old node within the container.
     *
     * @param {Node|number} exist             - child or child’s index.
     * @param {Node|object|string|Node[]} add - new node
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }));
     */


    Container.prototype.insertBefore = function insertBefore(exist, add) {
        exist = this.index(exist);

        var type = exist === 0 ? 'prepend' : false;
        var nodes = this.normalize(add, this.nodes[exist], type).reverse();
        for (var _iterator6 = nodes, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
            var _ref6;

            if (_isArray6) {
                if (_i6 >= _iterator6.length) break;
                _ref6 = _iterator6[_i6++];
            } else {
                _i6 = _iterator6.next();
                if (_i6.done) break;
                _ref6 = _i6.value;
            }

            var node = _ref6;
            this.nodes.splice(exist, 0, node);
        }var index = void 0;
        for (var id in this.indexes) {
            index = this.indexes[id];
            if (exist <= index) {
                this.indexes[id] = index + nodes.length;
            }
        }

        return this;
    };

    /**
     * Insert new node after old node within the container.
     *
     * @param {Node|number} exist             - child or child’s index
     * @param {Node|object|string|Node[]} add - new node
     *
     * @return {Node} this node for methods chain
     */


    Container.prototype.insertAfter = function insertAfter(exist, add) {
        exist = this.index(exist);

        var nodes = this.normalize(add, this.nodes[exist]).reverse();
        for (var _iterator7 = nodes, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
            var _ref7;

            if (_isArray7) {
                if (_i7 >= _iterator7.length) break;
                _ref7 = _iterator7[_i7++];
            } else {
                _i7 = _iterator7.next();
                if (_i7.done) break;
                _ref7 = _i7.value;
            }

            var node = _ref7;
            this.nodes.splice(exist + 1, 0, node);
        }var index = void 0;
        for (var id in this.indexes) {
            index = this.indexes[id];
            if (exist < index) {
                this.indexes[id] = index + nodes.length;
            }
        }

        return this;
    };

    Container.prototype.remove = function remove(child) {
        if (typeof child !== 'undefined') {
            (0, _warnOnce2.default)('Container#remove is deprecated. ' + 'Use Container#removeChild');
            this.removeChild(child);
        } else {
            _Node.prototype.remove.call(this);
        }
        return this;
    };

    /**
     * Removes node from the container and cleans the parent properties
     * from the node and its children.
     *
     * @param {Node|number} child - child or child’s index
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.nodes.length  //=> 5
     * rule.removeChild(decl);
     * rule.nodes.length  //=> 4
     * decl.parent        //=> undefined
     */


    Container.prototype.removeChild = function removeChild(child) {
        child = this.index(child);
        this.nodes[child].parent = undefined;
        this.nodes.splice(child, 1);

        var index = void 0;
        for (var id in this.indexes) {
            index = this.indexes[id];
            if (index >= child) {
                this.indexes[id] = index - 1;
            }
        }

        return this;
    };

    /**
     * Removes all children from the container
     * and cleans their parent properties.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.removeAll();
     * rule.nodes.length //=> 0
     */


    Container.prototype.removeAll = function removeAll() {
        for (var _iterator8 = this.nodes, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
            var _ref8;

            if (_isArray8) {
                if (_i8 >= _iterator8.length) break;
                _ref8 = _iterator8[_i8++];
            } else {
                _i8 = _iterator8.next();
                if (_i8.done) break;
                _ref8 = _i8.value;
            }

            var node = _ref8;
            node.parent = undefined;
        }this.nodes = [];
        return this;
    };

    /**
     * Passes all declaration values within the container that match pattern
     * through callback, replacing those values with the returned result
     * of callback.
     *
     * This method is useful if you are using a custom unit or function
     * and need to iterate through all values.
     *
     * @param {string|RegExp} pattern    - replace pattern
     * @param {object} opts              - options to speed up the search
     * @param {string} opts.prop         - an array of property names
     * @param {string} opts.fast         - string that’s used
     *                                     to narrow down values and speed up
     *                                     the regexp search
     * @param {function|string} callback - string to replace pattern
     *                                     or callback that returns a new value.
     *                                     The callback will receive
     *                                     the same arguments as those passed
     *                                     to a function parameter
     *                                     of `String#replace`.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
     *   return 15 * parseInt(string) + 'px';
     * });
     */


    Container.prototype.replaceValues = function replaceValues(pattern, opts, callback) {
        if (!callback) {
            callback = opts;
            opts = {};
        }

        this.walkDecls(function (decl) {
            if (opts.props && opts.props.indexOf(decl.prop) === -1) return;
            if (opts.fast && decl.value.indexOf(opts.fast) === -1) return;

            decl.value = decl.value.replace(pattern, callback);
        });

        return this;
    };

    /**
     * Returns `true` if callback returns `true`
     * for all of the container’s children.
     *
     * @param {childCondition} condition - iterator returns true or false.
     *
     * @return {boolean} is every child pass condition
     *
     * @example
     * const noPrefixes = rule.every(i => i.prop[0] !== '-');
     */


    Container.prototype.every = function every(condition) {
        return this.nodes.every(condition);
    };

    /**
     * Returns `true` if callback returns `true` for (at least) one
     * of the container’s children.
     *
     * @param {childCondition} condition - iterator returns true or false.
     *
     * @return {boolean} is every child pass condition
     *
     * @example
     * const hasPrefix = rule.every(i => i.prop[0] === '-');
     */


    Container.prototype.some = function some(condition) {
        return this.nodes.some(condition);
    };

    /**
     * Returns a `child`’s index within the {@link Container#nodes} array.
     *
     * @param {Node} child - child of the current container.
     *
     * @return {number} child index
     *
     * @example
     * rule.index( rule.nodes[2] ) //=> 2
     */


    Container.prototype.index = function index(child) {
        if (typeof child === 'number') {
            return child;
        } else {
            return this.nodes.indexOf(child);
        }
    };

    /**
     * The container’s first child.
     *
     * @type {Node}
     *
     * @example
     * rule.first == rules.nodes[0];
     */


    Container.prototype.normalize = function normalize(nodes, sample) {
        var _this2 = this;

        if (typeof nodes === 'string') {
            var parse = require('./parse');
            nodes = cleanSource(parse(nodes).nodes);
        } else if (!Array.isArray(nodes)) {
            if (nodes.type === 'root') {
                nodes = nodes.nodes;
            } else if (nodes.type) {
                nodes = [nodes];
            } else if (nodes.prop) {
                if (typeof nodes.value === 'undefined') {
                    throw new Error('Value field is missed in node creation');
                } else if (typeof nodes.value !== 'string') {
                    nodes.value = String(nodes.value);
                }
                nodes = [new _declaration2.default(nodes)];
            } else if (nodes.selector) {
                var Rule = require('./rule');
                nodes = [new Rule(nodes)];
            } else if (nodes.name) {
                var AtRule = require('./at-rule');
                nodes = [new AtRule(nodes)];
            } else if (nodes.text) {
                nodes = [new _comment2.default(nodes)];
            } else {
                throw new Error('Unknown node type in node creation');
            }
        }

        var processed = nodes.map(function (i) {
            if (typeof i.raws === 'undefined') i = _this2.rebuild(i);

            if (i.parent) i = i.clone();
            if (typeof i.raws.before === 'undefined') {
                if (sample && typeof sample.raws.before !== 'undefined') {
                    i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
                }
            }
            i.parent = _this2;
            return i;
        });

        return processed;
    };

    Container.prototype.rebuild = function rebuild(node, parent) {
        var _this3 = this;

        var fix = void 0;
        if (node.type === 'root') {
            var Root = require('./root');
            fix = new Root();
        } else if (node.type === 'atrule') {
            var AtRule = require('./at-rule');
            fix = new AtRule();
        } else if (node.type === 'rule') {
            var Rule = require('./rule');
            fix = new Rule();
        } else if (node.type === 'decl') {
            fix = new _declaration2.default();
        } else if (node.type === 'comment') {
            fix = new _comment2.default();
        }

        for (var i in node) {
            if (i === 'nodes') {
                fix.nodes = node.nodes.map(function (j) {
                    return _this3.rebuild(j, fix);
                });
            } else if (i === 'parent' && parent) {
                fix.parent = parent;
            } else if (node.hasOwnProperty(i)) {
                fix[i] = node[i];
            }
        }

        return fix;
    };

    Container.prototype.eachInside = function eachInside(callback) {
        (0, _warnOnce2.default)('Container#eachInside is deprecated. ' + 'Use Container#walk instead.');
        return this.walk(callback);
    };

    Container.prototype.eachDecl = function eachDecl(prop, callback) {
        (0, _warnOnce2.default)('Container#eachDecl is deprecated. ' + 'Use Container#walkDecls instead.');
        return this.walkDecls(prop, callback);
    };

    Container.prototype.eachRule = function eachRule(selector, callback) {
        (0, _warnOnce2.default)('Container#eachRule is deprecated. ' + 'Use Container#walkRules instead.');
        return this.walkRules(selector, callback);
    };

    Container.prototype.eachAtRule = function eachAtRule(name, callback) {
        (0, _warnOnce2.default)('Container#eachAtRule is deprecated. ' + 'Use Container#walkAtRules instead.');
        return this.walkAtRules(name, callback);
    };

    Container.prototype.eachComment = function eachComment(callback) {
        (0, _warnOnce2.default)('Container#eachComment is deprecated. ' + 'Use Container#walkComments instead.');
        return this.walkComments(callback);
    };

    _createClass(Container, [{
        key: 'first',
        get: function get() {
            if (!this.nodes) return undefined;
            return this.nodes[0];
        }

        /**
         * The container’s last child.
         *
         * @type {Node}
         *
         * @example
         * rule.last == rule.nodes[rule.nodes.length - 1];
         */

    }, {
        key: 'last',
        get: function get() {
            if (!this.nodes) return undefined;
            return this.nodes[this.nodes.length - 1];
        }
    }, {
        key: 'semicolon',
        get: function get() {
            (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
            return this.raws.semicolon;
        },
        set: function set(val) {
            (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
            this.raws.semicolon = val;
        }
    }, {
        key: 'after',
        get: function get() {
            (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
            return this.raws.after;
        },
        set: function set(val) {
            (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
            this.raws.after = val;
        }

        /**
         * @memberof Container#
         * @member {Node[]} nodes - an array containing the container’s children
         *
         * @example
         * const root = postcss.parse('a { color: black }');
         * root.nodes.length           //=> 1
         * root.nodes[0].selector      //=> 'a'
         * root.nodes[0].nodes[0].prop //=> 'color'
         */

    }]);

    return Container;
}(_node2.default);

exports.default = Container;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LFEsRUFBVTtBQUN2QixnQ0FBUyx5Q0FDQSxvQ0FEVDtBQUVBLGVBQU8sS0FBSyxXQUFMLENBQWlCLElBQWpCLEVBQXVCLFFBQXZCLENBQVA7QUFDSCxLOzt3QkFFRCxXLHdCQUFZLFEsRUFBVTtBQUNsQixnQ0FBUywwQ0FDQSxxQ0FEVDtBQUVBLGVBQU8sS0FBSyxZQUFMLENBQWtCLFFBQWxCLENBQVA7QUFDSCxLOzs7OzRCQXpIVztBQUNSLGdCQUFLLENBQUMsS0FBSyxLQUFYLEVBQW1CLE9BQU8sU0FBUDtBQUNuQixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDSDs7Ozs7Ozs7Ozs7Ozs0QkFVVTtBQUNQLGdCQUFLLENBQUMsS0FBSyxLQUFYLEVBQW1CLE9BQU8sU0FBUDtBQUNuQixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLENBQS9CLENBQVA7QUFDSDs7OzRCQTJHZTtBQUNaLG9DQUFTLHVEQUFUO0FBQ0EsbUJBQU8sS0FBSyxJQUFMLENBQVUsU0FBakI7QUFDSCxTOzBCQUVhLEcsRUFBSztBQUNmLG9DQUFTLHVEQUFUO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFNBQVYsR0FBc0IsR0FBdEI7QUFDSDs7OzRCQUVXO0FBQ1Isb0NBQVMsK0NBQVQ7QUFDQSxtQkFBTyxLQUFLLElBQUwsQ0FBVSxLQUFqQjtBQUNILFM7MEJBRVMsRyxFQUFLO0FBQ1gsb0NBQVMsK0NBQVQ7QUFDQSxpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixHQUFsQjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBZVUsUyIsImZpbGUiOiJjb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVjbGFyYXRpb24gZnJvbSAnLi9kZWNsYXJhdGlvbic7XG5pbXBvcnQgd2Fybk9uY2UgICAgZnJvbSAnLi93YXJuLW9uY2UnO1xuaW1wb3J0IENvbW1lbnQgICAgIGZyb20gJy4vY29tbWVudCc7XG5pbXBvcnQgTm9kZSAgICAgICAgZnJvbSAnLi9ub2RlJztcblxuZnVuY3Rpb24gY2xlYW5Tb3VyY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gbm9kZXMubWFwKCBpID0+IHtcbiAgICAgICAgaWYgKCBpLm5vZGVzICkgaS5ub2RlcyA9IGNsZWFuU291cmNlKGkubm9kZXMpO1xuICAgICAgICBkZWxldGUgaS5zb3VyY2U7XG4gICAgICAgIHJldHVybiBpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEBjYWxsYmFjayBjaGlsZENvbmRpdGlvblxuICogQHBhcmFtIHtOb2RlfSBub2RlICAgIC0gY29udGFpbmVyIGNoaWxkXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBjaGlsZCBpbmRleFxuICogQHBhcmFtIHtOb2RlW119IG5vZGVzIC0gYWxsIGNvbnRhaW5lciBjaGlsZHJlblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuXG4gLyoqXG4gICogQGNhbGxiYWNrIGNoaWxkSXRlcmF0b3JcbiAgKiBAcGFyYW0ge05vZGV9IG5vZGUgICAgLSBjb250YWluZXIgY2hpbGRcbiAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBjaGlsZCBpbmRleFxuICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJuaW5nIGBmYWxzZWAgd2lsbCBicmVhayBpdGVyYXRpb25cbiAgKi9cblxuLyoqXG4gKiBUaGUge0BsaW5rIFJvb3R9LCB7QGxpbmsgQXRSdWxlfSwgYW5kIHtAbGluayBSdWxlfSBjb250YWluZXIgbm9kZXNcbiAqIGluaGVyaXQgc29tZSBjb21tb24gbWV0aG9kcyB0byBoZWxwIHdvcmsgd2l0aCB0aGVpciBjaGlsZHJlbi5cbiAqXG4gKiBOb3RlIHRoYXQgYWxsIGNvbnRhaW5lcnMgY2FuIHN0b3JlIGFueSBjb250ZW50LiBJZiB5b3Ugd3JpdGUgYSBydWxlIGluc2lkZVxuICogYSBydWxlLCBQb3N0Q1NTIHdpbGwgcGFyc2UgaXQuXG4gKlxuICogQGV4dGVuZHMgTm9kZVxuICogQGFic3RyYWN0XG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIENvbnRhaW5lciBleHRlbmRzIE5vZGUge1xuXG4gICAgcHVzaChjaGlsZCkge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLm5vZGVzLnB1c2goY2hpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBjb250YWluZXLigJlzIGltbWVkaWF0ZSBjaGlsZHJlbixcbiAgICAgKiBjYWxsaW5nIGBjYWxsYmFja2AgZm9yIGVhY2ggY2hpbGQuXG4gICAgICpcbiAgICAgKiBSZXR1cm5pbmcgYGZhbHNlYCBpbiB0aGUgY2FsbGJhY2sgd2lsbCBicmVhayBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBvbmx5IGl0ZXJhdGVzIHRocm91Z2ggdGhlIGNvbnRhaW5lcuKAmXMgaW1tZWRpYXRlIGNoaWxkcmVuLlxuICAgICAqIElmIHlvdSBuZWVkIHRvIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgdGhyb3VnaCBhbGwgdGhlIGNvbnRhaW5lcuKAmXMgZGVzY2VuZGFudFxuICAgICAqIG5vZGVzLCB1c2Uge0BsaW5rIENvbnRhaW5lciN3YWxrfS5cbiAgICAgKlxuICAgICAqIFVubGlrZSB0aGUgZm9yIGB7fWAtY3ljbGUgb3IgYEFycmF5I2ZvckVhY2hgIHRoaXMgaXRlcmF0b3IgaXMgc2FmZVxuICAgICAqIGlmIHlvdSBhcmUgbXV0YXRpbmcgdGhlIGFycmF5IG9mIGNoaWxkIG5vZGVzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICogUG9zdENTUyB3aWxsIGFkanVzdCB0aGUgY3VycmVudCBpbmRleCB0byBtYXRjaCB0aGUgbXV0YXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtjaGlsZEl0ZXJhdG9yfSBjYWxsYmFjayAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2EgeyBjb2xvcjogYmxhY2s7IHotaW5kZXg6IDEgfScpO1xuICAgICAqIGNvbnN0IHJ1bGUgPSByb290LmZpcnN0O1xuICAgICAqXG4gICAgICogZm9yICggbGV0IGRlY2wgb2YgcnVsZS5ub2RlcyApIHtcbiAgICAgKiAgICAgZGVjbC5jbG9uZUJlZm9yZSh7IHByb3A6ICctd2Via2l0LScgKyBkZWNsLnByb3AgfSk7XG4gICAgICogICAgIC8vIEN5Y2xlIHdpbGwgYmUgaW5maW5pdGUsIGJlY2F1c2UgY2xvbmVCZWZvcmUgbW92ZXMgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAqICAgICAvLyB0byB0aGUgbmV4dCBpbmRleFxuICAgICAqIH1cbiAgICAgKlxuICAgICAqIHJ1bGUuZWFjaChkZWNsID0+IHtcbiAgICAgKiAgICAgZGVjbC5jbG9uZUJlZm9yZSh7IHByb3A6ICctd2Via2l0LScgKyBkZWNsLnByb3AgfSk7XG4gICAgICogICAgIC8vIFdpbGwgYmUgZXhlY3V0ZWQgb25seSBmb3IgY29sb3IgYW5kIHotaW5kZXhcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBlYWNoKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICggIXRoaXMubGFzdEVhY2ggKSB0aGlzLmxhc3RFYWNoID0gMDtcbiAgICAgICAgaWYgKCAhdGhpcy5pbmRleGVzICkgdGhpcy5pbmRleGVzID0geyB9O1xuXG4gICAgICAgIHRoaXMubGFzdEVhY2ggKz0gMTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5sYXN0RWFjaDtcbiAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IDA7XG5cbiAgICAgICAgaWYgKCAhdGhpcy5ub2RlcyApIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgbGV0IGluZGV4LCByZXN1bHQ7XG4gICAgICAgIHdoaWxlICggdGhpcy5pbmRleGVzW2lkXSA8IHRoaXMubm9kZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgaW5kZXggID0gdGhpcy5pbmRleGVzW2lkXTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHRoaXMubm9kZXNbaW5kZXhdLCBpbmRleCk7XG4gICAgICAgICAgICBpZiAoIHJlc3VsdCA9PT0gZmFsc2UgKSBicmVhaztcblxuICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIHRoaXMuaW5kZXhlc1tpZF07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmF2ZXJzZXMgdGhlIGNvbnRhaW5lcuKAmXMgZGVzY2VuZGFudCBub2RlcywgY2FsbGluZyBjYWxsYmFja1xuICAgICAqIGZvciBlYWNoIG5vZGUuXG4gICAgICpcbiAgICAgKiBMaWtlIGNvbnRhaW5lci5lYWNoKCksIHRoaXMgbWV0aG9kIGlzIHNhZmUgdG8gdXNlXG4gICAgICogaWYgeW91IGFyZSBtdXRhdGluZyBhcnJheXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIElmIHlvdSBvbmx5IG5lZWQgdG8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBjb250YWluZXLigJlzIGltbWVkaWF0ZSBjaGlsZHJlbixcbiAgICAgKiB1c2Uge0BsaW5rIENvbnRhaW5lciNlYWNofS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Y2hpbGRJdGVyYXRvcn0gY2FsbGJhY2sgLSBpdGVyYXRvciByZWNlaXZlcyBlYWNoIG5vZGUgYW5kIGluZGV4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtmYWxzZXx1bmRlZmluZWR9IHJldHVybnMgYGZhbHNlYCBpZiBpdGVyYXRpb24gd2FzIGJyb2tlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAgKiAgIC8vIFRyYXZlcnNlcyBhbGwgZGVzY2VuZGFudCBub2Rlcy5cbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YWxrKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgIGlmICggcmVzdWx0ICE9PSBmYWxzZSAmJiBjaGlsZC53YWxrICkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNoaWxkLndhbGsoY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2VzIHRoZSBjb250YWluZXLigJlzIGRlc2NlbmRhbnQgbm9kZXMsIGNhbGxpbmcgY2FsbGJhY2tcbiAgICAgKiBmb3IgZWFjaCBkZWNsYXJhdGlvbiBub2RlLlxuICAgICAqXG4gICAgICogSWYgeW91IHBhc3MgYSBmaWx0ZXIsIGl0ZXJhdGlvbiB3aWxsIG9ubHkgaGFwcGVuIG92ZXIgZGVjbGFyYXRpb25zXG4gICAgICogd2l0aCBtYXRjaGluZyBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogTGlrZSB7QGxpbmsgQ29udGFpbmVyI2VhY2h9LCB0aGlzIG1ldGhvZCBpcyBzYWZlXG4gICAgICogdG8gdXNlIGlmIHlvdSBhcmUgbXV0YXRpbmcgYXJyYXlzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IFtwcm9wXSAgIC0gc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBmaWx0ZXIgZGVjbGFyYXRpb25zIGJ5IHByb3BlcnR5IG5hbWVcbiAgICAgKiBAcGFyYW0ge2NoaWxkSXRlcmF0b3J9IGNhbGxiYWNrIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb290LndhbGtEZWNscyhkZWNsID0+IHtcbiAgICAgKiAgIGNoZWNrUHJvcGVydHlTdXBwb3J0KGRlY2wucHJvcCk7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiByb290LndhbGtEZWNscygnYm9yZGVyLXJhZGl1cycsIGRlY2wgPT4ge1xuICAgICAqICAgZGVjbC5yZW1vdmUoKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIHJvb3Qud2Fsa0RlY2xzKC9eYmFja2dyb3VuZC8sIGRlY2wgPT4ge1xuICAgICAqICAgZGVjbC52YWx1ZSA9IHRha2VGaXJzdENvbG9yRnJvbUdyYWRpZW50KGRlY2wudmFsdWUpO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHdhbGtEZWNscyhwcm9wLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoICFjYWxsYmFjayApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gcHJvcDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2RlY2wnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCBwcm9wIGluc3RhbmNlb2YgUmVnRXhwICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnZGVjbCcgJiYgcHJvcC50ZXN0KGNoaWxkLnByb3ApICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnZGVjbCcgJiYgY2hpbGQucHJvcCA9PT0gcHJvcCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggcnVsZSBub2RlLlxuICAgICAqXG4gICAgICogSWYgeW91IHBhc3MgYSBmaWx0ZXIsIGl0ZXJhdGlvbiB3aWxsIG9ubHkgaGFwcGVuIG92ZXIgcnVsZXNcbiAgICAgKiB3aXRoIG1hdGNoaW5nIHNlbGVjdG9ycy5cbiAgICAgKlxuICAgICAqIExpa2Uge0BsaW5rIENvbnRhaW5lciNlYWNofSwgdGhpcyBtZXRob2QgaXMgc2FmZVxuICAgICAqIHRvIHVzZSBpZiB5b3UgYXJlIG11dGF0aW5nIGFycmF5cyBkdXJpbmcgaXRlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBbc2VsZWN0b3JdIC0gc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGZpbHRlciBydWxlcyBieSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7Y2hpbGRJdGVyYXRvcn0gY2FsbGJhY2sgICAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgc2VsZWN0b3JzID0gW107XG4gICAgICogcm9vdC53YWxrUnVsZXMocnVsZSA9PiB7XG4gICAgICogICBzZWxlY3RvcnMucHVzaChydWxlLnNlbGVjdG9yKTtcbiAgICAgKiB9KTtcbiAgICAgKiBjb25zb2xlLmxvZyhgWW91ciBDU1MgdXNlcyAke3NlbGVjdG9ycy5sZW5ndGh9IHNlbGVjdG9ycycpO1xuICAgICAqL1xuICAgIHdhbGtSdWxlcyhzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCAhY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHNlbGVjdG9yO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdydWxlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICggc2VsZWN0b3IgaW5zdGFuY2VvZiBSZWdFeHAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdydWxlJyAmJiBzZWxlY3Rvci50ZXN0KGNoaWxkLnNlbGVjdG9yKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ3J1bGUnICYmIGNoaWxkLnNlbGVjdG9yID09PSBzZWxlY3RvciApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggYXQtcnVsZSBub2RlLlxuICAgICAqXG4gICAgICogSWYgeW91IHBhc3MgYSBmaWx0ZXIsIGl0ZXJhdGlvbiB3aWxsIG9ubHkgaGFwcGVuIG92ZXIgYXQtcnVsZXNcbiAgICAgKiB0aGF0IGhhdmUgbWF0Y2hpbmcgbmFtZXMuXG4gICAgICpcbiAgICAgKiBMaWtlIHtAbGluayBDb250YWluZXIjZWFjaH0sIHRoaXMgbWV0aG9kIGlzIHNhZmVcbiAgICAgKiB0byB1c2UgaWYgeW91IGFyZSBtdXRhdGluZyBhcnJheXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gW25hbWVdICAgLSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGZpbHRlciBhdC1ydWxlcyBieSBuYW1lXG4gICAgICogQHBhcmFtIHtjaGlsZEl0ZXJhdG9yfSBjYWxsYmFjayAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9vdC53YWxrQXRSdWxlcyhydWxlID0+IHtcbiAgICAgKiAgIGlmICggaXNPbGQocnVsZS5uYW1lKSApIHJ1bGUucmVtb3ZlKCk7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBsZXQgZmlyc3QgPSBmYWxzZTtcbiAgICAgKiByb290LndhbGtBdFJ1bGVzKCdjaGFyc2V0JywgcnVsZSA9PiB7XG4gICAgICogICBpZiAoICFmaXJzdCApIHtcbiAgICAgKiAgICAgZmlyc3QgPSB0cnVlO1xuICAgICAqICAgfSBlbHNlIHtcbiAgICAgKiAgICAgcnVsZS5yZW1vdmUoKTtcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YWxrQXRSdWxlcyhuYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoICFjYWxsYmFjayApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gbmFtZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhjaGlsZCwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIG5hbWUgaW5zdGFuY2VvZiBSZWdFeHAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdhdHJ1bGUnICYmIG5hbWUudGVzdChjaGlsZC5uYW1lKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScgJiYgY2hpbGQubmFtZSA9PT0gbmFtZSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggY29tbWVudCBub2RlLlxuICAgICAqXG4gICAgICogTGlrZSB7QGxpbmsgQ29udGFpbmVyI2VhY2h9LCB0aGlzIG1ldGhvZCBpcyBzYWZlXG4gICAgICogdG8gdXNlIGlmIHlvdSBhcmUgbXV0YXRpbmcgYXJyYXlzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2NoaWxkSXRlcmF0b3J9IGNhbGxiYWNrIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb290LndhbGtDb21tZW50cyhjb21tZW50ID0+IHtcbiAgICAgKiAgIGNvbW1lbnQucmVtb3ZlKCk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgd2Fsa0NvbW1lbnRzKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnY29tbWVudCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBuZXcgbm9kZXMgdG8gdGhlIHN0YXJ0IG9mIHRoZSBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gey4uLihOb2RlfG9iamVjdHxzdHJpbmd8Tm9kZVtdKX0gY2hpbGRyZW4gLSBuZXcgbm9kZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBkZWNsMSA9IHBvc3Rjc3MuZGVjbCh7IHByb3A6ICdjb2xvcicsIHZhbHVlOiAnYmxhY2snIH0pO1xuICAgICAqIGNvbnN0IGRlY2wyID0gcG9zdGNzcy5kZWNsKHsgcHJvcDogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogJ3doaXRlJyB9KTtcbiAgICAgKiBydWxlLmFwcGVuZChkZWNsMSwgZGVjbDIpO1xuICAgICAqXG4gICAgICogcm9vdC5hcHBlbmQoeyBuYW1lOiAnY2hhcnNldCcsIHBhcmFtczogJ1wiVVRGLThcIicgfSk7ICAvLyBhdC1ydWxlXG4gICAgICogcm9vdC5hcHBlbmQoeyBzZWxlY3RvcjogJ2EnIH0pOyAgICAgICAgICAgICAgICAgICAgICAgLy8gcnVsZVxuICAgICAqIHJ1bGUuYXBwZW5kKHsgcHJvcDogJ2NvbG9yJywgdmFsdWU6ICdibGFjaycgfSk7ICAgICAgIC8vIGRlY2xhcmF0aW9uXG4gICAgICogcnVsZS5hcHBlbmQoeyB0ZXh0OiAnQ29tbWVudCcgfSkgICAgICAgICAgICAgICAgICAgICAgLy8gY29tbWVudFxuICAgICAqXG4gICAgICogcm9vdC5hcHBlbmQoJ2Ege30nKTtcbiAgICAgKiByb290LmZpcnN0LmFwcGVuZCgnY29sb3I6IGJsYWNrOyB6LWluZGV4OiAxJyk7XG4gICAgICovXG4gICAgYXBwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgICAgIGZvciAoIGxldCBjaGlsZCBvZiBjaGlsZHJlbiApIHtcbiAgICAgICAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGNoaWxkLCB0aGlzLmxhc3QpO1xuICAgICAgICAgICAgZm9yICggbGV0IG5vZGUgb2Ygbm9kZXMgKSB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBuZXcgbm9kZXMgdG8gdGhlIGVuZCBvZiB0aGUgY29udGFpbmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsuLi4oTm9kZXxvYmplY3R8c3RyaW5nfE5vZGVbXSl9IGNoaWxkcmVuIC0gbmV3IG5vZGVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgZGVjbDEgPSBwb3N0Y3NzLmRlY2woeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ2JsYWNrJyB9KTtcbiAgICAgKiBjb25zdCBkZWNsMiA9IHBvc3Rjc3MuZGVjbCh7IHByb3A6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6ICd3aGl0ZScgfSk7XG4gICAgICogcnVsZS5wcmVwZW5kKGRlY2wxLCBkZWNsMik7XG4gICAgICpcbiAgICAgKiByb290LmFwcGVuZCh7IG5hbWU6ICdjaGFyc2V0JywgcGFyYW1zOiAnXCJVVEYtOFwiJyB9KTsgIC8vIGF0LXJ1bGVcbiAgICAgKiByb290LmFwcGVuZCh7IHNlbGVjdG9yOiAnYScgfSk7ICAgICAgICAgICAgICAgICAgICAgICAvLyBydWxlXG4gICAgICogcnVsZS5hcHBlbmQoeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ2JsYWNrJyB9KTsgICAgICAgLy8gZGVjbGFyYXRpb25cbiAgICAgKiBydWxlLmFwcGVuZCh7IHRleHQ6ICdDb21tZW50JyB9KSAgICAgICAgICAgICAgICAgICAgICAvLyBjb21tZW50XG4gICAgICpcbiAgICAgKiByb290LmFwcGVuZCgnYSB7fScpO1xuICAgICAqIHJvb3QuZmlyc3QuYXBwZW5kKCdjb2xvcjogYmxhY2s7IHotaW5kZXg6IDEnKTtcbiAgICAgKi9cbiAgICBwcmVwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4ucmV2ZXJzZSgpO1xuICAgICAgICBmb3IgKCBsZXQgY2hpbGQgb2YgY2hpbGRyZW4gKSB7XG4gICAgICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLm5vcm1hbGl6ZShjaGlsZCwgdGhpcy5maXJzdCwgJ3ByZXBlbmQnKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICBmb3IgKCBsZXQgbm9kZSBvZiBub2RlcyApIHRoaXMubm9kZXMudW5zaGlmdChub2RlKTtcbiAgICAgICAgICAgIGZvciAoIGxldCBpZCBpbiB0aGlzLmluZGV4ZXMgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IHRoaXMuaW5kZXhlc1tpZF0gKyBub2Rlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xlYW5SYXdzKGtlZXBCZXR3ZWVuKSB7XG4gICAgICAgIHN1cGVyLmNsZWFuUmF3cyhrZWVwQmV0d2Vlbik7XG4gICAgICAgIGlmICggdGhpcy5ub2RlcyApIHtcbiAgICAgICAgICAgIGZvciAoIGxldCBub2RlIG9mIHRoaXMubm9kZXMgKSBub2RlLmNsZWFuUmF3cyhrZWVwQmV0d2Vlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgbmV3IG5vZGUgYmVmb3JlIG9sZCBub2RlIHdpdGhpbiB0aGUgY29udGFpbmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOb2RlfG51bWJlcn0gZXhpc3QgICAgICAgICAgICAgLSBjaGlsZCBvciBjaGlsZOKAmXMgaW5kZXguXG4gICAgICogQHBhcmFtIHtOb2RlfG9iamVjdHxzdHJpbmd8Tm9kZVtdfSBhZGQgLSBuZXcgbm9kZVxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gdGhpcyBub2RlIGZvciBtZXRob2RzIGNoYWluXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJ1bGUuaW5zZXJ0QmVmb3JlKGRlY2wsIGRlY2wuY2xvbmUoeyBwcm9wOiAnLXdlYmtpdC0nICsgZGVjbC5wcm9wIH0pKTtcbiAgICAgKi9cbiAgICBpbnNlcnRCZWZvcmUoZXhpc3QsIGFkZCkge1xuICAgICAgICBleGlzdCA9IHRoaXMuaW5kZXgoZXhpc3QpO1xuXG4gICAgICAgIGxldCB0eXBlICA9IGV4aXN0ID09PSAwID8gJ3ByZXBlbmQnIDogZmFsc2U7XG4gICAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGFkZCwgdGhpcy5ub2Rlc1tleGlzdF0sIHR5cGUpLnJldmVyc2UoKTtcbiAgICAgICAgZm9yICggbGV0IG5vZGUgb2Ygbm9kZXMgKSB0aGlzLm5vZGVzLnNwbGljZShleGlzdCwgMCwgbm9kZSk7XG5cbiAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICBmb3IgKCBsZXQgaWQgaW4gdGhpcy5pbmRleGVzICkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4ZXNbaWRdO1xuICAgICAgICAgICAgaWYgKCBleGlzdCA8PSBpbmRleCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gaW5kZXggKyBub2Rlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgbmV3IG5vZGUgYWZ0ZXIgb2xkIG5vZGUgd2l0aGluIHRoZSBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge05vZGV8bnVtYmVyfSBleGlzdCAgICAgICAgICAgICAtIGNoaWxkIG9yIGNoaWxk4oCZcyBpbmRleFxuICAgICAqIEBwYXJhbSB7Tm9kZXxvYmplY3R8c3RyaW5nfE5vZGVbXX0gYWRkIC0gbmV3IG5vZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqL1xuICAgIGluc2VydEFmdGVyKGV4aXN0LCBhZGQpIHtcbiAgICAgICAgZXhpc3QgPSB0aGlzLmluZGV4KGV4aXN0KTtcblxuICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLm5vcm1hbGl6ZShhZGQsIHRoaXMubm9kZXNbZXhpc3RdKS5yZXZlcnNlKCk7XG4gICAgICAgIGZvciAoIGxldCBub2RlIG9mIG5vZGVzICkgdGhpcy5ub2Rlcy5zcGxpY2UoZXhpc3QgKyAxLCAwLCBub2RlKTtcblxuICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgIGZvciAoIGxldCBpZCBpbiB0aGlzLmluZGV4ZXMgKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXhlc1tpZF07XG4gICAgICAgICAgICBpZiAoIGV4aXN0IDwgaW5kZXggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IGluZGV4ICsgbm9kZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGNoaWxkKSB7XG4gICAgICAgIGlmICggdHlwZW9mIGNoaWxkICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjcmVtb3ZlIGlzIGRlcHJlY2F0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgJ1VzZSBDb250YWluZXIjcmVtb3ZlQ2hpbGQnKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBub2RlIGZyb20gdGhlIGNvbnRhaW5lciBhbmQgY2xlYW5zIHRoZSBwYXJlbnQgcHJvcGVydGllc1xuICAgICAqIGZyb20gdGhlIG5vZGUgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Tm9kZXxudW1iZXJ9IGNoaWxkIC0gY2hpbGQgb3IgY2hpbGTigJlzIGluZGV4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcnVsZS5ub2Rlcy5sZW5ndGggIC8vPT4gNVxuICAgICAqIHJ1bGUucmVtb3ZlQ2hpbGQoZGVjbCk7XG4gICAgICogcnVsZS5ub2Rlcy5sZW5ndGggIC8vPT4gNFxuICAgICAqIGRlY2wucGFyZW50ICAgICAgICAvLz0+IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkID0gdGhpcy5pbmRleChjaGlsZCk7XG4gICAgICAgIHRoaXMubm9kZXNbY2hpbGRdLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoY2hpbGQsIDEpO1xuXG4gICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgZm9yICggbGV0IGlkIGluIHRoaXMuaW5kZXhlcyApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5pbmRleGVzW2lkXTtcbiAgICAgICAgICAgIGlmICggaW5kZXggPj0gY2hpbGQgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IGluZGV4IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gdGhlIGNvbnRhaW5lclxuICAgICAqIGFuZCBjbGVhbnMgdGhlaXIgcGFyZW50IHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcnVsZS5yZW1vdmVBbGwoKTtcbiAgICAgKiBydWxlLm5vZGVzLmxlbmd0aCAvLz0+IDBcbiAgICAgKi9cbiAgICByZW1vdmVBbGwoKSB7XG4gICAgICAgIGZvciAoIGxldCBub2RlIG9mIHRoaXMubm9kZXMgKSBub2RlLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXNzZXMgYWxsIGRlY2xhcmF0aW9uIHZhbHVlcyB3aXRoaW4gdGhlIGNvbnRhaW5lciB0aGF0IG1hdGNoIHBhdHRlcm5cbiAgICAgKiB0aHJvdWdoIGNhbGxiYWNrLCByZXBsYWNpbmcgdGhvc2UgdmFsdWVzIHdpdGggdGhlIHJldHVybmVkIHJlc3VsdFxuICAgICAqIG9mIGNhbGxiYWNrLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIGlmIHlvdSBhcmUgdXNpbmcgYSBjdXN0b20gdW5pdCBvciBmdW5jdGlvblxuICAgICAqIGFuZCBuZWVkIHRvIGl0ZXJhdGUgdGhyb3VnaCBhbGwgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBwYXR0ZXJuICAgIC0gcmVwbGFjZSBwYXR0ZXJuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgICAgICAgICAgICAgIC0gb3B0aW9ucyB0byBzcGVlZCB1cCB0aGUgc2VhcmNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMucHJvcCAgICAgICAgIC0gYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5mYXN0ICAgICAgICAgLSBzdHJpbmcgdGhhdOKAmXMgdXNlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIG5hcnJvdyBkb3duIHZhbHVlcyBhbmQgc3BlZWQgdXBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVnZXhwIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb258c3RyaW5nfSBjYWxsYmFjayAtIHN0cmluZyB0byByZXBsYWNlIHBhdHRlcm5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBjYWxsYmFjayB0aGF0IHJldHVybnMgYSBuZXcgdmFsdWUuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIHdpbGwgcmVjZWl2ZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aG9zZSBwYXNzZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIGZ1bmN0aW9uIHBhcmFtZXRlclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIGBTdHJpbmcjcmVwbGFjZWAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9vdC5yZXBsYWNlVmFsdWVzKC9cXGQrcmVtLywgeyBmYXN0OiAncmVtJyB9LCBzdHJpbmcgPT4ge1xuICAgICAqICAgcmV0dXJuIDE1ICogcGFyc2VJbnQoc3RyaW5nKSArICdweCc7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgcmVwbGFjZVZhbHVlcyhwYXR0ZXJuLCBvcHRzLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoICFjYWxsYmFjayApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICAgICAgICAgIG9wdHMgPSB7IH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndhbGtEZWNscyggZGVjbCA9PiB7XG4gICAgICAgICAgICBpZiAoIG9wdHMucHJvcHMgJiYgb3B0cy5wcm9wcy5pbmRleE9mKGRlY2wucHJvcCkgPT09IC0xICkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKCBvcHRzLmZhc3QgICYmIGRlY2wudmFsdWUuaW5kZXhPZihvcHRzLmZhc3QpID09PSAtMSApIHJldHVybjtcblxuICAgICAgICAgICAgZGVjbC52YWx1ZSA9IGRlY2wudmFsdWUucmVwbGFjZShwYXR0ZXJuLCBjYWxsYmFjayk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGNhbGxiYWNrIHJldHVybnMgYHRydWVgXG4gICAgICogZm9yIGFsbCBvZiB0aGUgY29udGFpbmVy4oCZcyBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Y2hpbGRDb25kaXRpb259IGNvbmRpdGlvbiAtIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSBvciBmYWxzZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIGV2ZXJ5IGNoaWxkIHBhc3MgY29uZGl0aW9uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IG5vUHJlZml4ZXMgPSBydWxlLmV2ZXJ5KGkgPT4gaS5wcm9wWzBdICE9PSAnLScpO1xuICAgICAqL1xuICAgIGV2ZXJ5KGNvbmRpdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2Rlcy5ldmVyeShjb25kaXRpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGNhbGxiYWNrIHJldHVybnMgYHRydWVgIGZvciAoYXQgbGVhc3QpIG9uZVxuICAgICAqIG9mIHRoZSBjb250YWluZXLigJlzIGNoaWxkcmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtjaGlsZENvbmRpdGlvbn0gY29uZGl0aW9uIC0gaXRlcmF0b3IgcmV0dXJucyB0cnVlIG9yIGZhbHNlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gaXMgZXZlcnkgY2hpbGQgcGFzcyBjb25kaXRpb25cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgaGFzUHJlZml4ID0gcnVsZS5ldmVyeShpID0+IGkucHJvcFswXSA9PT0gJy0nKTtcbiAgICAgKi9cbiAgICBzb21lKGNvbmRpdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2Rlcy5zb21lKGNvbmRpdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGBjaGlsZGDigJlzIGluZGV4IHdpdGhpbiB0aGUge0BsaW5rIENvbnRhaW5lciNub2Rlc30gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge05vZGV9IGNoaWxkIC0gY2hpbGQgb2YgdGhlIGN1cnJlbnQgY29udGFpbmVyLlxuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBjaGlsZCBpbmRleFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBydWxlLmluZGV4KCBydWxlLm5vZGVzWzJdICkgLy89PiAyXG4gICAgICovXG4gICAgaW5kZXgoY2hpbGQpIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgY2hpbGQgPT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZXMuaW5kZXhPZihjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVy4oCZcyBmaXJzdCBjaGlsZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBydWxlLmZpcnN0ID09IHJ1bGVzLm5vZGVzWzBdO1xuICAgICAqL1xuICAgIGdldCBmaXJzdCgpIHtcbiAgICAgICAgaWYgKCAhdGhpcy5ub2RlcyApIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzWzBdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250YWluZXLigJlzIGxhc3QgY2hpbGQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcnVsZS5sYXN0ID09IHJ1bGUubm9kZXNbcnVsZS5ub2Rlcy5sZW5ndGggLSAxXTtcbiAgICAgKi9cbiAgICBnZXQgbGFzdCgpIHtcbiAgICAgICAgaWYgKCAhdGhpcy5ub2RlcyApIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzW3RoaXMubm9kZXMubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKG5vZGVzLCBzYW1wbGUpIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygbm9kZXMgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgbGV0IHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xuICAgICAgICAgICAgbm9kZXMgPSBjbGVhblNvdXJjZShwYXJzZShub2Rlcykubm9kZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKCAhQXJyYXkuaXNBcnJheShub2RlcykgKSB7XG4gICAgICAgICAgICBpZiAoIG5vZGVzLnR5cGUgPT09ICdyb290JyApIHtcbiAgICAgICAgICAgICAgICBub2RlcyA9IG5vZGVzLm5vZGVzO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggbm9kZXMudHlwZSApIHtcbiAgICAgICAgICAgICAgICBub2RlcyA9IFtub2Rlc107XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2Rlcy5wcm9wICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIG5vZGVzLnZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBmaWVsZCBpcyBtaXNzZWQgaW4gbm9kZSBjcmVhdGlvbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBub2Rlcy52YWx1ZSAhPT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnZhbHVlID0gU3RyaW5nKG5vZGVzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbbmV3IERlY2xhcmF0aW9uKG5vZGVzKV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2Rlcy5zZWxlY3RvciApIHtcbiAgICAgICAgICAgICAgICBsZXQgUnVsZSA9IHJlcXVpcmUoJy4vcnVsZScpO1xuICAgICAgICAgICAgICAgIG5vZGVzID0gW25ldyBSdWxlKG5vZGVzKV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2Rlcy5uYW1lICkge1xuICAgICAgICAgICAgICAgIGxldCBBdFJ1bGUgPSByZXF1aXJlKCcuL2F0LXJ1bGUnKTtcbiAgICAgICAgICAgICAgICBub2RlcyA9IFtuZXcgQXRSdWxlKG5vZGVzKV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2Rlcy50ZXh0ICkge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gW25ldyBDb21tZW50KG5vZGVzKV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBub2RlIHR5cGUgaW4gbm9kZSBjcmVhdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByb2Nlc3NlZCA9IG5vZGVzLm1hcCggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MgPT09ICd1bmRlZmluZWQnICkgaSA9IHRoaXMucmVidWlsZChpKTtcblxuICAgICAgICAgICAgaWYgKCBpLnBhcmVudCApIGkgPSBpLmNsb25lKCk7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYmVmb3JlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNhbXBsZSAmJiB0eXBlb2Ygc2FtcGxlLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgaS5yYXdzLmJlZm9yZSA9IHNhbXBsZS5yYXdzLmJlZm9yZS5yZXBsYWNlKC9bXlxcc10vZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvY2Vzc2VkO1xuICAgIH1cblxuICAgIHJlYnVpbGQobm9kZSwgcGFyZW50KSB7XG4gICAgICAgIGxldCBmaXg7XG4gICAgICAgIGlmICggbm9kZS50eXBlID09PSAncm9vdCcgKSB7XG4gICAgICAgICAgICBsZXQgUm9vdCA9IHJlcXVpcmUoJy4vcm9vdCcpO1xuICAgICAgICAgICAgZml4ID0gbmV3IFJvb3QoKTtcbiAgICAgICAgfSBlbHNlIGlmICggbm9kZS50eXBlID09PSAnYXRydWxlJyApIHtcbiAgICAgICAgICAgIGxldCBBdFJ1bGUgPSByZXF1aXJlKCcuL2F0LXJ1bGUnKTtcbiAgICAgICAgICAgIGZpeCA9IG5ldyBBdFJ1bGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICggbm9kZS50eXBlID09PSAncnVsZScgKSB7XG4gICAgICAgICAgICBsZXQgUnVsZSA9IHJlcXVpcmUoJy4vcnVsZScpO1xuICAgICAgICAgICAgZml4ID0gbmV3IFJ1bGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICggbm9kZS50eXBlID09PSAnZGVjbCcgKSB7XG4gICAgICAgICAgICBmaXggPSBuZXcgRGVjbGFyYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmICggbm9kZS50eXBlID09PSAnY29tbWVudCcgKSB7XG4gICAgICAgICAgICBmaXggPSBuZXcgQ29tbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IGkgaW4gbm9kZSApIHtcbiAgICAgICAgICAgIGlmICggaSA9PT0gJ25vZGVzJyApIHtcbiAgICAgICAgICAgICAgICBmaXgubm9kZXMgPSBub2RlLm5vZGVzLm1hcCggaiA9PiB0aGlzLnJlYnVpbGQoaiwgZml4KSApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggaSA9PT0gJ3BhcmVudCcgJiYgcGFyZW50ICkge1xuICAgICAgICAgICAgICAgIGZpeC5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2RlLmhhc093blByb3BlcnR5KGkpICkge1xuICAgICAgICAgICAgICAgIGZpeFtpXSA9IG5vZGVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZml4O1xuICAgIH1cblxuICAgIGVhY2hJbnNpZGUoY2FsbGJhY2spIHtcbiAgICAgICAgd2Fybk9uY2UoJ0NvbnRhaW5lciNlYWNoSW5zaWRlIGlzIGRlcHJlY2F0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAnVXNlIENvbnRhaW5lciN3YWxrIGluc3RlYWQuJyk7XG4gICAgICAgIHJldHVybiB0aGlzLndhbGsoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGVhY2hEZWNsKHByb3AsIGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaERlY2wgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGtEZWNscyBpbnN0ZWFkLicpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWxrRGVjbHMocHJvcCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGVhY2hSdWxlKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB3YXJuT25jZSgnQ29udGFpbmVyI2VhY2hSdWxlIGlzIGRlcHJlY2F0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAnVXNlIENvbnRhaW5lciN3YWxrUnVsZXMgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Fsa1J1bGVzKHNlbGVjdG9yLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZWFjaEF0UnVsZShuYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB3YXJuT25jZSgnQ29udGFpbmVyI2VhY2hBdFJ1bGUgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGtBdFJ1bGVzIGluc3RlYWQuJyk7XG4gICAgICAgIHJldHVybiB0aGlzLndhbGtBdFJ1bGVzKG5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBlYWNoQ29tbWVudChjYWxsYmFjaykge1xuICAgICAgICB3YXJuT25jZSgnQ29udGFpbmVyI2VhY2hDb21tZW50IGlzIGRlcHJlY2F0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAnVXNlIENvbnRhaW5lciN3YWxrQ29tbWVudHMgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Fsa0NvbW1lbnRzKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBnZXQgc2VtaWNvbG9uKCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNzZW1pY29sb24gaXMgZGVwcmVjYXRlZC4gVXNlIE5vZGUjcmF3cy5zZW1pY29sb24nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5zZW1pY29sb247XG4gICAgfVxuXG4gICAgc2V0IHNlbWljb2xvbih2YWwpIHtcbiAgICAgICAgd2Fybk9uY2UoJ05vZGUjc2VtaWNvbG9uIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3Muc2VtaWNvbG9uJyk7XG4gICAgICAgIHRoaXMucmF3cy5zZW1pY29sb24gPSB2YWw7XG4gICAgfVxuXG4gICAgZ2V0IGFmdGVyKCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNhZnRlciBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLmFmdGVyJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJhd3MuYWZ0ZXI7XG4gICAgfVxuXG4gICAgc2V0IGFmdGVyKHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNhZnRlciBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLmFmdGVyJyk7XG4gICAgICAgIHRoaXMucmF3cy5hZnRlciA9IHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgQ29udGFpbmVyI1xuICAgICAqIEBtZW1iZXIge05vZGVbXX0gbm9kZXMgLSBhbiBhcnJheSBjb250YWluaW5nIHRoZSBjb250YWluZXLigJlzIGNoaWxkcmVuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdhIHsgY29sb3I6IGJsYWNrIH0nKTtcbiAgICAgKiByb290Lm5vZGVzLmxlbmd0aCAgICAgICAgICAgLy89PiAxXG4gICAgICogcm9vdC5ub2Rlc1swXS5zZWxlY3RvciAgICAgIC8vPT4gJ2EnXG4gICAgICogcm9vdC5ub2Rlc1swXS5ub2Rlc1swXS5wcm9wIC8vPT4gJ2NvbG9yJ1xuICAgICAqL1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRhaW5lcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
