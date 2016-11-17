"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function interp(a, b, x) {
  return a * (1 - x) + b * x;
}

var BezierComponent = function (_React$Component) {
  _inherits(BezierComponent, _React$Component);

  function BezierComponent(props) {
    _classCallCheck(this, BezierComponent);

    var _this = _possibleConstructorReturn(this, (BezierComponent.__proto__ || Object.getPrototypeOf(BezierComponent)).call(this, props));

    _this.x = _this.x.bind(_this);
    _this.y = _this.y.bind(_this);
    return _this;
  }

  _createClass(BezierComponent, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _props = this.props,
          xFrom = _props.xFrom,
          yFrom = _props.yFrom,
          xTo = _props.xTo,
          yTo = _props.yTo;

      return nextProps.xFrom !== xFrom || nextProps.yFrom !== yFrom || nextProps.xTo !== xTo || nextProps.yTo !== yTo;
    }
  }, {
    key: "x",
    value: function x(value) {
      return Math.round(interp(this.props.xFrom, this.props.xTo, value));
    }
  }, {
    key: "y",
    value: function y(value) {
      return Math.round(interp(this.props.yFrom, this.props.yTo, value));
    }
  }]);

  return BezierComponent;
}(_react2.default.Component);

exports.default = BezierComponent;