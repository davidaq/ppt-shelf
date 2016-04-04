'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Spinner = function Spinner(props) {
  var color = props.color;
  var only = props.only;

  var spinnerClasses = {
    'spinner-layer': true
  };
  if (only) {
    spinnerClasses['spinner-' + color + '-only'] = true;
  } else {
    spinnerClasses['spinner-' + color] = true;
  }
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)(spinnerClasses) },
    _react2.default.createElement(
      'div',
      { className: 'circle-clipper left' },
      _react2.default.createElement('div', { className: 'circle' })
    ),
    _react2.default.createElement(
      'div',
      { className: 'gap-patch' },
      _react2.default.createElement('div', { className: 'circle' })
    ),
    _react2.default.createElement(
      'div',
      { className: 'circle-clipper right' },
      _react2.default.createElement('div', { className: 'circle' })
    )
  );
};

Spinner.defaultProps = {
  only: true
};

var colors = ['blue', 'red', 'yellow', 'green'];

var Preloader = function (_React$Component) {
  _inherits(Preloader, _React$Component);

  function Preloader() {
    _classCallCheck(this, Preloader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Preloader).apply(this, arguments));
  }

  _createClass(Preloader, [{
    key: 'render',
    value: function render() {
      var classes = {
        'preloader-wrapper': true,
        active: this.props.active
      };

      if (this.props.size) {
        classes[this.props.size] = true;
      }

      var spinners = undefined;
      if (this.props.flashing) {
        spinners = [];
        colors.map(function (color) {
          spinners.push(_react2.default.createElement(Spinner, { color: color, only: false, key: color }));
        });
      } else {
        spinners = _react2.default.createElement(Spinner, { color: this.props.color });
      }
      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(this.props.className, classes) },
        spinners
      );
    }
  }]);

  return Preloader;
}(_react2.default.Component);

Preloader.propTypes = {
  /**
   * The scale of the circle
   * @default 'medium'
   */
  size: _react2.default.PropTypes.oneOf(['big', 'small', 'medium']),
  /**
   * Whether to spin
   * @default true
   */
  active: _react2.default.PropTypes.bool,
  /**
   * The color of the circle, if not flashing
   * @default 'blue'
   */
  color: _react2.default.PropTypes.oneOf(['blue', 'red', 'yellow', 'green']),
  /**
   * Wheter to circle four different colors
   * @default false
   */
  flashing: _react2.default.PropTypes.bool
};

Preloader.defaultProps = {
  active: true,
  flashing: false,
  color: 'blue'
};

exports.default = Preloader;