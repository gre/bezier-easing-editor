"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _BezierComponent2 = require("./BezierComponent");

var _BezierComponent3 = _interopRequireDefault(_BezierComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Curve = function (_BezierComponent) {
  _inherits(Curve, _BezierComponent);

  function Curve() {
    _classCallCheck(this, Curve);

    return _possibleConstructorReturn(this, (Curve.__proto__ || Object.getPrototypeOf(Curve)).apply(this, arguments));
  }

  _createClass(Curve, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (_get(Curve.prototype.__proto__ || Object.getPrototypeOf(Curve.prototype), "shouldComponentUpdate", this).call(this, nextProps)) return true;
      var _props = this.props,
          curveColor = _props.curveColor,
          curveWidth = _props.curveWidth,
          value = _props.value;

      return nextProps.curveColor !== curveColor || nextProps.curveWidth !== curveWidth || nextProps.value !== value;
    }
  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          curveColor = _props2.curveColor,
          curveWidth = _props2.curveWidth,
          value = _props2.value;
      var x = this.x,
          y = this.y;

      var sx = x(0);
      var sy = y(0);
      var ex = x(1);
      var ey = y(1);
      var cx1 = x(value[0]);
      var cy1 = y(value[1]);
      var cx2 = x(value[2]);
      var cy2 = y(value[3]);
      var curve = "M" + sx + "," + sy + " C" + cx1 + "," + cy1 + " " + cx2 + "," + cy2 + " " + ex + "," + ey;

      return _react2.default.createElement("path", {
        fill: "none",
        stroke: curveColor,
        strokeWidth: curveWidth,
        d: curve });
    }
  }]);

  return Curve;
}(_BezierComponent3.default);

exports.default = Curve;