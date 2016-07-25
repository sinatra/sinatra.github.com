'use strict';

exports.__esModule = true;
/**
 * Contains helpers for working with vendor prefixes.
 *
 * @example
 * const vendor = postcss.vendor;
 *
 * @namespace vendor
 */
var vendor = {

    /**
     * Returns the vendor prefix extracted from an input string.
     *
     * @param {string} prop - string with or without vendor prefix
     *
     * @return {string} vendor prefix or empty string
     *
     * @example
     * postcss.vendor.prefix('-moz-tab-size') //=> '-moz-'
     * postcss.vendor.prefix('tab-size')      //=> ''
     */

    prefix: function prefix(prop) {
        if (prop[0] === '-') {
            var sep = prop.indexOf('-', 1);
            return prop.substr(0, sep + 1);
        } else {
            return '';
        }
    },


    /**
     * Returns the input string stripped of its vendor prefix.
     *
     * @param {string} prop - string with or without vendor prefix
     *
     * @return {string} string name without vendor prefixes
     *
     * @example
     * postcss.vendor.unprefixed('-moz-tab-size') //=> 'tab-size'
     */
    unprefixed: function unprefixed(prop) {
        if (prop[0] === '-') {
            var sep = prop.indexOf('-', 1);
            return prop.substr(sep + 1);
        } else {
            return prop;
        }
    }
};

exports.default = vendor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbmRvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxJQUFJLFNBQVM7Ozs7Ozs7Ozs7Ozs7O0FBYVQsVUFiUyxrQkFhRixJQWJFLEVBYUk7QUFDVCxZQUFLLEtBQUssQ0FBTCxNQUFZLEdBQWpCLEVBQXVCO0FBQ25CLGdCQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixDQUFsQixDQUFWO0FBQ0EsbUJBQU8sS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLE1BQU0sQ0FBckIsQ0FBUDtBQUNILFNBSEQsTUFHTztBQUNILG1CQUFPLEVBQVA7QUFDSDtBQUNKLEtBcEJROzs7Ozs7Ozs7Ozs7O0FBZ0NULGNBaENTLHNCQWdDRSxJQWhDRixFQWdDUTtBQUNiLFlBQUssS0FBSyxDQUFMLE1BQVksR0FBakIsRUFBdUI7QUFDbkIsZ0JBQUksTUFBTSxLQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQWtCLENBQWxCLENBQVY7QUFDQSxtQkFBTyxLQUFLLE1BQUwsQ0FBWSxNQUFNLENBQWxCLENBQVA7QUFDSCxTQUhELE1BR087QUFDSCxtQkFBTyxJQUFQO0FBQ0g7QUFDSjtBQXZDUSxDQUFiOztrQkEyQ2UsTSIsImZpbGUiOiJ2ZW5kb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnRhaW5zIGhlbHBlcnMgZm9yIHdvcmtpbmcgd2l0aCB2ZW5kb3IgcHJlZml4ZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHZlbmRvciA9IHBvc3Rjc3MudmVuZG9yO1xuICpcbiAqIEBuYW1lc3BhY2UgdmVuZG9yXG4gKi9cbmxldCB2ZW5kb3IgPSB7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2ZW5kb3IgcHJlZml4IGV4dHJhY3RlZCBmcm9tIGFuIGlucHV0IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gc3RyaW5nIHdpdGggb3Igd2l0aG91dCB2ZW5kb3IgcHJlZml4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHZlbmRvciBwcmVmaXggb3IgZW1wdHkgc3RyaW5nXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MudmVuZG9yLnByZWZpeCgnLW1vei10YWItc2l6ZScpIC8vPT4gJy1tb3otJ1xuICAgICAqIHBvc3Rjc3MudmVuZG9yLnByZWZpeCgndGFiLXNpemUnKSAgICAgIC8vPT4gJydcbiAgICAgKi9cbiAgICBwcmVmaXgocHJvcCkge1xuICAgICAgICBpZiAoIHByb3BbMF0gPT09ICctJyApIHtcbiAgICAgICAgICAgIGxldCBzZXAgPSBwcm9wLmluZGV4T2YoJy0nLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9wLnN1YnN0cigwLCBzZXAgKyAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnB1dCBzdHJpbmcgc3RyaXBwZWQgb2YgaXRzIHZlbmRvciBwcmVmaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIHN0cmluZyB3aXRoIG9yIHdpdGhvdXQgdmVuZG9yIHByZWZpeFxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmcgbmFtZSB3aXRob3V0IHZlbmRvciBwcmVmaXhlc1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwb3N0Y3NzLnZlbmRvci51bnByZWZpeGVkKCctbW96LXRhYi1zaXplJykgLy89PiAndGFiLXNpemUnXG4gICAgICovXG4gICAgdW5wcmVmaXhlZChwcm9wKSB7XG4gICAgICAgIGlmICggcHJvcFswXSA9PT0gJy0nICkge1xuICAgICAgICAgICAgbGV0IHNlcCA9IHByb3AuaW5kZXhPZignLScsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHByb3Auc3Vic3RyKHNlcCArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHByb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlbmRvcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
