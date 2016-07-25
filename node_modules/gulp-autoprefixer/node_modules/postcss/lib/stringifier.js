'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable valid-jsdoc */

var defaultRaw = {
    colon: ': ',
    indent: '    ',
    beforeDecl: '\n',
    beforeRule: '\n',
    beforeOpen: ' ',
    beforeClose: '\n',
    beforeComment: '\n',
    after: '\n',
    emptyBody: '',
    commentLeft: ' ',
    commentRight: ' '
};

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

var Stringifier = function () {
    function Stringifier(builder) {
        _classCallCheck(this, Stringifier);

        this.builder = builder;
    }

    Stringifier.prototype.stringify = function stringify(node, semicolon) {
        this[node.type](node, semicolon);
    };

    Stringifier.prototype.root = function root(node) {
        this.body(node);
        if (node.raws.after) this.builder(node.raws.after);
    };

    Stringifier.prototype.comment = function comment(node) {
        var left = this.raw(node, 'left', 'commentLeft');
        var right = this.raw(node, 'right', 'commentRight');
        this.builder('/*' + left + node.text + right + '*/', node);
    };

    Stringifier.prototype.decl = function decl(node, semicolon) {
        var between = this.raw(node, 'between', 'colon');
        var string = node.prop + between + this.rawValue(node, 'value');

        if (node.important) {
            string += node.raws.important || ' !important';
        }

        if (semicolon) string += ';';
        this.builder(string, node);
    };

    Stringifier.prototype.rule = function rule(node) {
        this.block(node, this.rawValue(node, 'selector'));
    };

    Stringifier.prototype.atrule = function atrule(node, semicolon) {
        var name = '@' + node.name;
        var params = node.params ? this.rawValue(node, 'params') : '';

        if (typeof node.raws.afterName !== 'undefined') {
            name += node.raws.afterName;
        } else if (params) {
            name += ' ';
        }

        if (node.nodes) {
            this.block(node, name + params);
        } else {
            var end = (node.raws.between || '') + (semicolon ? ';' : '');
            this.builder(name + params + end, node);
        }
    };

    Stringifier.prototype.body = function body(node) {
        var last = node.nodes.length - 1;
        while (last > 0) {
            if (node.nodes[last].type !== 'comment') break;
            last -= 1;
        }

        var semicolon = this.raw(node, 'semicolon');
        for (var i = 0; i < node.nodes.length; i++) {
            var child = node.nodes[i];
            var before = this.raw(child, 'before');
            if (before) this.builder(before);
            this.stringify(child, last !== i || semicolon);
        }
    };

    Stringifier.prototype.block = function block(node, start) {
        var between = this.raw(node, 'between', 'beforeOpen');
        this.builder(start + between + '{', node, 'start');

        var after = void 0;
        if (node.nodes && node.nodes.length) {
            this.body(node);
            after = this.raw(node, 'after');
        } else {
            after = this.raw(node, 'after', 'emptyBody');
        }

        if (after) this.builder(after);
        this.builder('}', node, 'end');
    };

    Stringifier.prototype.raw = function raw(node, own, detect) {
        var value = void 0;
        if (!detect) detect = own;

        // Already had
        if (own) {
            value = node.raws[own];
            if (typeof value !== 'undefined') return value;
        }

        var parent = node.parent;

        // Hack for first rule in CSS
        if (detect === 'before') {
            if (!parent || parent.type === 'root' && parent.first === node) {
                return '';
            }
        }

        // Floating child without parent
        if (!parent) return defaultRaw[detect];

        // Detect style by other nodes
        var root = node.root();
        if (!root.rawCache) root.rawCache = {};
        if (typeof root.rawCache[detect] !== 'undefined') {
            return root.rawCache[detect];
        }

        if (detect === 'before' || detect === 'after') {
            return this.beforeAfter(node, detect);
        } else {
            var method = 'raw' + capitalize(detect);
            if (this[method]) {
                value = this[method](root, node);
            } else {
                root.walk(function (i) {
                    value = i.raws[own];
                    if (typeof value !== 'undefined') return false;
                });
            }
        }

        if (typeof value === 'undefined') value = defaultRaw[detect];

        root.rawCache[detect] = value;
        return value;
    };

    Stringifier.prototype.rawSemicolon = function rawSemicolon(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && i.nodes.length && i.last.type === 'decl') {
                value = i.raws.semicolon;
                if (typeof value !== 'undefined') return false;
            }
        });
        return value;
    };

    Stringifier.prototype.rawEmptyBody = function rawEmptyBody(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && i.nodes.length === 0) {
                value = i.raws.after;
                if (typeof value !== 'undefined') return false;
            }
        });
        return value;
    };

    Stringifier.prototype.rawIndent = function rawIndent(root) {
        if (root.raws.indent) return root.raws.indent;
        var value = void 0;
        root.walk(function (i) {
            var p = i.parent;
            if (p && p !== root && p.parent && p.parent === root) {
                if (typeof i.raws.before !== 'undefined') {
                    var parts = i.raws.before.split('\n');
                    value = parts[parts.length - 1];
                    value = value.replace(/[^\s]/g, '');
                    return false;
                }
            }
        });
        return value;
    };

    Stringifier.prototype.rawBeforeComment = function rawBeforeComment(root, node) {
        var value = void 0;
        root.walkComments(function (i) {
            if (typeof i.raws.before !== 'undefined') {
                value = i.raws.before;
                if (value.indexOf('\n') !== -1) {
                    value = value.replace(/[^\n]+$/, '');
                }
                return false;
            }
        });
        if (typeof value === 'undefined') {
            value = this.raw(node, null, 'beforeDecl');
        }
        return value;
    };

    Stringifier.prototype.rawBeforeDecl = function rawBeforeDecl(root, node) {
        var value = void 0;
        root.walkDecls(function (i) {
            if (typeof i.raws.before !== 'undefined') {
                value = i.raws.before;
                if (value.indexOf('\n') !== -1) {
                    value = value.replace(/[^\n]+$/, '');
                }
                return false;
            }
        });
        if (typeof value === 'undefined') {
            value = this.raw(node, null, 'beforeRule');
        }
        return value;
    };

    Stringifier.prototype.rawBeforeRule = function rawBeforeRule(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && (i.parent !== root || root.first !== i)) {
                if (typeof i.raws.before !== 'undefined') {
                    value = i.raws.before;
                    if (value.indexOf('\n') !== -1) {
                        value = value.replace(/[^\n]+$/, '');
                    }
                    return false;
                }
            }
        });
        return value;
    };

    Stringifier.prototype.rawBeforeClose = function rawBeforeClose(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.nodes && i.nodes.length > 0) {
                if (typeof i.raws.after !== 'undefined') {
                    value = i.raws.after;
                    if (value.indexOf('\n') !== -1) {
                        value = value.replace(/[^\n]+$/, '');
                    }
                    return false;
                }
            }
        });
        return value;
    };

    Stringifier.prototype.rawBeforeOpen = function rawBeforeOpen(root) {
        var value = void 0;
        root.walk(function (i) {
            if (i.type !== 'decl') {
                value = i.raws.between;
                if (typeof value !== 'undefined') return false;
            }
        });
        return value;
    };

    Stringifier.prototype.rawColon = function rawColon(root) {
        var value = void 0;
        root.walkDecls(function (i) {
            if (typeof i.raws.between !== 'undefined') {
                value = i.raws.between.replace(/[^\s:]/g, '');
                return false;
            }
        });
        return value;
    };

    Stringifier.prototype.beforeAfter = function beforeAfter(node, detect) {
        var value = void 0;
        if (node.type === 'decl') {
            value = this.raw(node, null, 'beforeDecl');
        } else if (node.type === 'comment') {
            value = this.raw(node, null, 'beforeComment');
        } else if (detect === 'before') {
            value = this.raw(node, null, 'beforeRule');
        } else {
            value = this.raw(node, null, 'beforeClose');
        }

        var buf = node.parent;
        var depth = 0;
        while (buf && buf.type !== 'root') {
            depth += 1;
            buf = buf.parent;
        }

        if (value.indexOf('\n') !== -1) {
            var indent = this.raw(node, null, 'indent');
            if (indent.length) {
                for (var step = 0; step < depth; step++) {
                    value += indent;
                }
            }
        }

        return value;
    };

    Stringifier.prototype.rawValue = function rawValue(node, prop) {
        var value = node[prop];
        var raw = node.raws[prop];
        if (raw && raw.value === value) {
            return raw.raw;
        } else {
            return value;
        }
    };

    return Stringifier;
}();

exports.default = Stringifier;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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Q0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixlQUFyQixDQUFSO0FBQ0gsU0FGTSxNQUVBLElBQUssV0FBVyxRQUFoQixFQUEyQjtBQUM5QixvQkFBUSxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixZQUFyQixDQUFSO0FBQ0gsU0FGTSxNQUVBO0FBQ0gsb0JBQVEsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsYUFBckIsQ0FBUjtBQUNIOztBQUVELFlBQUksTUFBUSxLQUFLLE1BQWpCO0FBQ0EsWUFBSSxRQUFRLENBQVo7QUFDQSxlQUFRLE9BQU8sSUFBSSxJQUFKLEtBQWEsTUFBNUIsRUFBcUM7QUFDakMscUJBQVMsQ0FBVDtBQUNBLGtCQUFNLElBQUksTUFBVjtBQUNIOztBQUVELFlBQUssTUFBTSxPQUFOLENBQWMsSUFBZCxNQUF3QixDQUFDLENBQTlCLEVBQWtDO0FBQzlCLGdCQUFJLFNBQVMsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsUUFBckIsQ0FBYjtBQUNBLGdCQUFLLE9BQU8sTUFBWixFQUFxQjtBQUNqQixxQkFBTSxJQUFJLE9BQU8sQ0FBakIsRUFBb0IsT0FBTyxLQUEzQixFQUFrQyxNQUFsQztBQUEyQyw2QkFBUyxNQUFUO0FBQTNDO0FBQ0g7QUFDSjs7QUFFRCxlQUFPLEtBQVA7QUFDSCxLOzswQkFFRCxRLHFCQUFTLEksRUFBTSxJLEVBQU07QUFDakIsWUFBSSxRQUFRLEtBQUssSUFBTCxDQUFaO0FBQ0EsWUFBSSxNQUFRLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBWjtBQUNBLFlBQUssT0FBTyxJQUFJLEtBQUosS0FBYyxLQUExQixFQUFrQztBQUM5QixtQkFBTyxJQUFJLEdBQVg7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxLQUFQO0FBQ0g7QUFDSixLOzs7OztrQkFJVSxXIiwiZmlsZSI6InN0cmluZ2lmaWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cblxuY29uc3QgZGVmYXVsdFJhdyA9IHtcbiAgICBjb2xvbjogICAgICAgICAnOiAnLFxuICAgIGluZGVudDogICAgICAgICcgICAgJyxcbiAgICBiZWZvcmVEZWNsOiAgICAnXFxuJyxcbiAgICBiZWZvcmVSdWxlOiAgICAnXFxuJyxcbiAgICBiZWZvcmVPcGVuOiAgICAnICcsXG4gICAgYmVmb3JlQ2xvc2U6ICAgJ1xcbicsXG4gICAgYmVmb3JlQ29tbWVudDogJ1xcbicsXG4gICAgYWZ0ZXI6ICAgICAgICAgJ1xcbicsXG4gICAgZW1wdHlCb2R5OiAgICAgJycsXG4gICAgY29tbWVudExlZnQ6ICAgJyAnLFxuICAgIGNvbW1lbnRSaWdodDogICcgJ1xufTtcblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5cbmNsYXNzIFN0cmluZ2lmaWVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGJ1aWxkZXIpIHtcbiAgICAgICAgdGhpcy5idWlsZGVyID0gYnVpbGRlcjtcbiAgICB9XG5cbiAgICBzdHJpbmdpZnkobm9kZSwgc2VtaWNvbG9uKSB7XG4gICAgICAgIHRoaXNbbm9kZS50eXBlXShub2RlLCBzZW1pY29sb24pO1xuICAgIH1cblxuICAgIHJvb3Qobm9kZSkge1xuICAgICAgICB0aGlzLmJvZHkobm9kZSk7XG4gICAgICAgIGlmICggbm9kZS5yYXdzLmFmdGVyICkgdGhpcy5idWlsZGVyKG5vZGUucmF3cy5hZnRlcik7XG4gICAgfVxuXG4gICAgY29tbWVudChub2RlKSB7XG4gICAgICAgIGxldCBsZWZ0ICA9IHRoaXMucmF3KG5vZGUsICdsZWZ0JywgICdjb21tZW50TGVmdCcpO1xuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLnJhdyhub2RlLCAncmlnaHQnLCAnY29tbWVudFJpZ2h0Jyk7XG4gICAgICAgIHRoaXMuYnVpbGRlcignLyonICsgbGVmdCArIG5vZGUudGV4dCArIHJpZ2h0ICsgJyovJywgbm9kZSk7XG4gICAgfVxuXG4gICAgZGVjbChub2RlLCBzZW1pY29sb24pIHtcbiAgICAgICAgbGV0IGJldHdlZW4gPSB0aGlzLnJhdyhub2RlLCAnYmV0d2VlbicsICdjb2xvbicpO1xuICAgICAgICBsZXQgc3RyaW5nICA9IG5vZGUucHJvcCArIGJldHdlZW4gKyB0aGlzLnJhd1ZhbHVlKG5vZGUsICd2YWx1ZScpO1xuXG4gICAgICAgIGlmICggbm9kZS5pbXBvcnRhbnQgKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gbm9kZS5yYXdzLmltcG9ydGFudCB8fCAnICFpbXBvcnRhbnQnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBzZW1pY29sb24gKSBzdHJpbmcgKz0gJzsnO1xuICAgICAgICB0aGlzLmJ1aWxkZXIoc3RyaW5nLCBub2RlKTtcbiAgICB9XG5cbiAgICBydWxlKG5vZGUpIHtcbiAgICAgICAgdGhpcy5ibG9jayhub2RlLCB0aGlzLnJhd1ZhbHVlKG5vZGUsICdzZWxlY3RvcicpKTtcbiAgICB9XG5cbiAgICBhdHJ1bGUobm9kZSwgc2VtaWNvbG9uKSB7XG4gICAgICAgIGxldCBuYW1lICAgPSAnQCcgKyBub2RlLm5hbWU7XG4gICAgICAgIGxldCBwYXJhbXMgPSBub2RlLnBhcmFtcyA/IHRoaXMucmF3VmFsdWUobm9kZSwgJ3BhcmFtcycpIDogJyc7XG5cbiAgICAgICAgaWYgKCB0eXBlb2Ygbm9kZS5yYXdzLmFmdGVyTmFtZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICBuYW1lICs9IG5vZGUucmF3cy5hZnRlck5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIHBhcmFtcyApIHtcbiAgICAgICAgICAgIG5hbWUgKz0gJyAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBub2RlLm5vZGVzICkge1xuICAgICAgICAgICAgdGhpcy5ibG9jayhub2RlLCBuYW1lICsgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBlbmQgPSAobm9kZS5yYXdzLmJldHdlZW4gfHwgJycpICsgKHNlbWljb2xvbiA/ICc7JyA6ICcnKTtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRlcihuYW1lICsgcGFyYW1zICsgZW5kLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJvZHkobm9kZSkge1xuICAgICAgICBsZXQgbGFzdCA9IG5vZGUubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKCBsYXN0ID4gMCApIHtcbiAgICAgICAgICAgIGlmICggbm9kZS5ub2Rlc1tsYXN0XS50eXBlICE9PSAnY29tbWVudCcgKSBicmVhaztcbiAgICAgICAgICAgIGxhc3QgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZW1pY29sb24gPSB0aGlzLnJhdyhub2RlLCAnc2VtaWNvbG9uJyk7XG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IG5vZGUubm9kZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgID0gbm9kZS5ub2Rlc1tpXTtcbiAgICAgICAgICAgIGxldCBiZWZvcmUgPSB0aGlzLnJhdyhjaGlsZCwgJ2JlZm9yZScpO1xuICAgICAgICAgICAgaWYgKCBiZWZvcmUgKSB0aGlzLmJ1aWxkZXIoYmVmb3JlKTtcbiAgICAgICAgICAgIHRoaXMuc3RyaW5naWZ5KGNoaWxkLCBsYXN0ICE9PSBpIHx8IHNlbWljb2xvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBibG9jayhub2RlLCBzdGFydCkge1xuICAgICAgICBsZXQgYmV0d2VlbiA9IHRoaXMucmF3KG5vZGUsICdiZXR3ZWVuJywgJ2JlZm9yZU9wZW4nKTtcbiAgICAgICAgdGhpcy5idWlsZGVyKHN0YXJ0ICsgYmV0d2VlbiArICd7Jywgbm9kZSwgJ3N0YXJ0Jyk7XG5cbiAgICAgICAgbGV0IGFmdGVyO1xuICAgICAgICBpZiAoIG5vZGUubm9kZXMgJiYgbm9kZS5ub2Rlcy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHkobm9kZSk7XG4gICAgICAgICAgICBhZnRlciA9IHRoaXMucmF3KG5vZGUsICdhZnRlcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWZ0ZXIgPSB0aGlzLnJhdyhub2RlLCAnYWZ0ZXInLCAnZW1wdHlCb2R5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGFmdGVyICkgdGhpcy5idWlsZGVyKGFmdGVyKTtcbiAgICAgICAgdGhpcy5idWlsZGVyKCd9Jywgbm9kZSwgJ2VuZCcpO1xuICAgIH1cblxuICAgIHJhdyhub2RlLCBvd24sIGRldGVjdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGlmICggIWRldGVjdCApIGRldGVjdCA9IG93bjtcblxuICAgICAgICAvLyBBbHJlYWR5IGhhZFxuICAgICAgICBpZiAoIG93biApIHtcbiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5yYXdzW293bl07XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgICAgICAgLy8gSGFjayBmb3IgZmlyc3QgcnVsZSBpbiBDU1NcbiAgICAgICAgaWYgKCBkZXRlY3QgPT09ICdiZWZvcmUnICkge1xuICAgICAgICAgICAgaWYgKCAhcGFyZW50IHx8IHBhcmVudC50eXBlID09PSAncm9vdCcgJiYgcGFyZW50LmZpcnN0ID09PSBub2RlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZsb2F0aW5nIGNoaWxkIHdpdGhvdXQgcGFyZW50XG4gICAgICAgIGlmICggIXBhcmVudCApIHJldHVybiBkZWZhdWx0UmF3W2RldGVjdF07XG5cbiAgICAgICAgLy8gRGV0ZWN0IHN0eWxlIGJ5IG90aGVyIG5vZGVzXG4gICAgICAgIGxldCByb290ID0gbm9kZS5yb290KCk7XG4gICAgICAgIGlmICggIXJvb3QucmF3Q2FjaGUgKSByb290LnJhd0NhY2hlID0geyB9O1xuICAgICAgICBpZiAoIHR5cGVvZiByb290LnJhd0NhY2hlW2RldGVjdF0gIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3QucmF3Q2FjaGVbZGV0ZWN0XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZGV0ZWN0ID09PSAnYmVmb3JlJyB8fCBkZXRlY3QgPT09ICdhZnRlcicgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iZWZvcmVBZnRlcihub2RlLCBkZXRlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1ldGhvZCA9ICdyYXcnICsgY2FwaXRhbGl6ZShkZXRlY3QpO1xuICAgICAgICAgICAgaWYgKCB0aGlzW21ldGhvZF0gKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzW21ldGhvZF0ocm9vdCwgbm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzW293bl07XG4gICAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHZhbHVlID0gZGVmYXVsdFJhd1tkZXRlY3RdO1xuXG4gICAgICAgIHJvb3QucmF3Q2FjaGVbZGV0ZWN0XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3U2VtaWNvbG9uKHJvb3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCBpLm5vZGVzICYmIGkubm9kZXMubGVuZ3RoICYmIGkubGFzdC50eXBlID09PSAnZGVjbCcgKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3Muc2VtaWNvbG9uO1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdFbXB0eUJvZHkocm9vdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIGkubm9kZXMgJiYgaS5ub2Rlcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYWZ0ZXI7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0luZGVudChyb290KSB7XG4gICAgICAgIGlmICggcm9vdC5yYXdzLmluZGVudCApIHJldHVybiByb290LnJhd3MuaW5kZW50O1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICBsZXQgcCA9IGkucGFyZW50O1xuICAgICAgICAgICAgaWYgKCBwICYmIHAgIT09IHJvb3QgJiYgcC5wYXJlbnQgJiYgcC5wYXJlbnQgPT09IHJvb3QgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgaS5yYXdzLmJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJ0cyA9IGkucmF3cy5iZWZvcmUuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxzXS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3QmVmb3JlQ29tbWVudChyb290LCBub2RlKSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrQ29tbWVudHMoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgaS5yYXdzLmJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmVmb3JlO1xuICAgICAgICAgICAgICAgIGlmICggdmFsdWUuaW5kZXhPZignXFxuJykgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxuXSskLywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVEZWNsJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0JlZm9yZURlY2wocm9vdCwgbm9kZSkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2Fsa0RlY2xzKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZWZvcmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmJlZm9yZTtcbiAgICAgICAgICAgICAgICBpZiAoIHZhbHVlLmluZGV4T2YoJ1xcbicpICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9bXlxcbl0rJC8sICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlUnVsZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdCZWZvcmVSdWxlKHJvb3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCBpLm5vZGVzICYmIChpLnBhcmVudCAhPT0gcm9vdCB8fCByb290LmZpcnN0ICE9PSBpKSApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmVmb3JlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHZhbHVlLmluZGV4T2YoJ1xcbicpICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXG5dKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdCZWZvcmVDbG9zZShyb290KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggaS5ub2RlcyAmJiBpLm5vZGVzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgaS5yYXdzLmFmdGVyICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYWZ0ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUuaW5kZXhPZignXFxuJykgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9bXlxcbl0rJC8sICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0JlZm9yZU9wZW4ocm9vdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIGkudHlwZSAhPT0gJ2RlY2wnICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmJldHdlZW47XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0NvbG9uKHJvb3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGtEZWNscyggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYmV0d2VlbiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmV0d2Vlbi5yZXBsYWNlKC9bXlxcczpdL2csICcnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgYmVmb3JlQWZ0ZXIobm9kZSwgZGV0ZWN0KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgaWYgKCBub2RlLnR5cGUgPT09ICdkZWNsJyApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2JlZm9yZURlY2wnKTtcbiAgICAgICAgfSBlbHNlIGlmICggbm9kZS50eXBlID09PSAnY29tbWVudCcgKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVDb21tZW50Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGRldGVjdCA9PT0gJ2JlZm9yZScgKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVSdWxlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVDbG9zZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJ1ZiAgID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIGxldCBkZXB0aCA9IDA7XG4gICAgICAgIHdoaWxlICggYnVmICYmIGJ1Zi50eXBlICE9PSAncm9vdCcgKSB7XG4gICAgICAgICAgICBkZXB0aCArPSAxO1xuICAgICAgICAgICAgYnVmID0gYnVmLnBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdmFsdWUuaW5kZXhPZignXFxuJykgIT09IC0xICkge1xuICAgICAgICAgICAgbGV0IGluZGVudCA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdpbmRlbnQnKTtcbiAgICAgICAgICAgIGlmICggaW5kZW50Lmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgc3RlcCA9IDA7IHN0ZXAgPCBkZXB0aDsgc3RlcCsrICkgdmFsdWUgKz0gaW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd1ZhbHVlKG5vZGUsIHByb3ApIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbm9kZVtwcm9wXTtcbiAgICAgICAgbGV0IHJhdyAgID0gbm9kZS5yYXdzW3Byb3BdO1xuICAgICAgICBpZiAoIHJhdyAmJiByYXcudmFsdWUgPT09IHZhbHVlICkge1xuICAgICAgICAgICAgcmV0dXJuIHJhdy5yYXc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RyaW5naWZpZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
