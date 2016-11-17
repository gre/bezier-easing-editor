"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _bezierEasing = require("bezier-easing");

var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

var _BezierComponent2 = require("./BezierComponent");

var _BezierComponent3 = _interopRequireDefault(_BezierComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Progress = function (_BezierComponent) {
  _inherits(Progress, _BezierComponent);

  function Progress(props) {
    _classCallCheck(this, Progress);

    var _this = _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).call(this, props));

    _this.genEasing(props.value);
    return _this;
  }

  _createClass(Progress, [{
    key: "genEasing",
    value: function genEasing(value) {
      this.easing = _bezierEasing2.default.apply(null, value);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (_get(Progress.prototype.__proto__ || Object.getPrototypeOf(Progress.prototype), "shouldComponentUpdate", this).call(this, nextProps)) return true;
      var _props = this.props,
          value = _props.value,
          progress = _props.progress,
          progressColor = _props.progressColor;

      return nextProps.progress !== progress || nextProps.progressColor !== progressColor || nextProps.value !== value;
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(props) {
      if (this.props.value !== props.value) {
        this.genEasing(props.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          progress = _props2.progress,
          progressColor = _props2.progressColor;

      if (!progress) return _react2.default.createElement("path", null);
      var sx = this.x(0);
      var sy = this.y(0);
      var px = this.x(progress);
      var py = this.y(this.easing ? this.easing.get(progress) : 0);
      var prog = "M" + px + "," + sy + " L" + px + "," + py + " L" + sx + "," + py;
      return _react2.default.createElement("path", {
        fill: "none",
        strokeWidth: "1px",
        stroke: progressColor,
        d: prog });
    }
  }]);

  return Progress;
}(_BezierComponent3.default);

exports.default = Progress;