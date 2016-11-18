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

var Handle = function (_BezierComponent) {
  _inherits(Handle, _BezierComponent);

  function Handle() {
    _classCallCheck(this, Handle);

    return _possibleConstructorReturn(this, (Handle.__proto__ || Object.getPrototypeOf(Handle)).apply(this, arguments));
  }

  _createClass(Handle, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (_get(Handle.prototype.__proto__ || Object.getPrototypeOf(Handle.prototype), "shouldComponentUpdate", this).call(this, nextProps)) return true;
      var _props = this.props,
          index = _props.index,
          handleRadius = _props.handleRadius,
          handleColor = _props.handleColor,
          hover = _props.hover,
          down = _props.down,
          background = _props.background,
          handleStroke = _props.handleStroke,
          xval = _props.xval,
          yval = _props.yval,
          onMouseEnter = _props.onMouseEnter,
          onMouseLeave = _props.onMouseLeave,
          onMouseDown = _props.onMouseDown;

      return nextProps.index !== index || nextProps.handleRadius !== handleRadius || nextProps.handleColor !== handleColor || nextProps.hover !== hover || nextProps.down !== down || nextProps.background !== background || nextProps.handleStroke !== handleStroke || nextProps.xval !== xval || nextProps.yval !== yval || nextProps.onMouseDown !== onMouseDown || nextProps.onMouseLeave !== onMouseLeave || nextProps.onMouseEnter !== onMouseEnter;
    }
  }, {
    key: "render",
    value: function render() {
      var x = this.x,
          y = this.y;
      var _props2 = this.props,
          index = _props2.index,
          handleRadius = _props2.handleRadius,
          handleColor = _props2.handleColor,
          hover = _props2.hover,
          down = _props2.down,
          background = _props2.background,
          handleStroke = _props2.handleStroke,
          xval = _props2.xval,
          yval = _props2.yval,
          onMouseEnter = _props2.onMouseEnter,
          onMouseLeave = _props2.onMouseLeave,
          onMouseDown = _props2.onMouseDown;


      var sx = x(index);
      var sy = y(index);
      var cx = x(xval);
      var cy = y(yval);
      var a = Math.atan2(cy - sy, cx - sx);
      var cxs = cx - handleRadius * Math.cos(a);
      var cys = cy - handleRadius * Math.sin(a);

      return _react2.default.createElement(
        "g",
        null,
        _react2.default.createElement("line", {
          stroke: handleColor,
          strokeWidth: hover || down ? 1 + handleStroke : handleStroke,
          x1: cxs,
          y1: cys,
          x2: sx,
          y2: sy }),
        _react2.default.createElement("circle", {
          cx: cx,
          cy: cy,
          r: handleRadius,
          stroke: handleColor,
          strokeWidth: hover || down ? 2 * handleStroke : handleStroke,
          fill: down ? background : handleColor,
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
          onMouseDown: onMouseDown })
      );
    }
  }]);

  return Handle;
}(_BezierComponent3.default);

exports.default = Handle;