"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _BezierComponent2 = require("./BezierComponent");

var _BezierComponent3 = _interopRequireDefault(_BezierComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function range(from, to, step) {
  var t = [];
  for (var i = from; i < to; i += step) {
    t.push(i);
  }return t;
}

function sameShadowObject(a, b) {
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (var i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

var Grid = function (_BezierComponent) {
  _inherits(Grid, _BezierComponent);

  function Grid() {
    _classCallCheck(this, Grid);

    return _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).apply(this, arguments));
  }

  _createClass(Grid, [{
    key: "gridX",
    value: function gridX(div) {
      var step = 1 / div;
      return range(0, 1, step).map(this.x);
    }
  }, {
    key: "gridY",
    value: function gridY(div) {
      var step = 1 / div;
      return range(0, 1, step).map(this.y);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (_get(Grid.prototype.__proto__ || Object.getPrototypeOf(Grid.prototype), "shouldComponentUpdate", this).call(this, nextProps)) return true;
      var _props = this.props,
          background = _props.background,
          gridColor = _props.gridColor,
          textStyle = _props.textStyle;

      return nextProps.background !== background || nextProps.gridColor !== gridColor || !sameShadowObject(nextProps.textStyle, textStyle);
    }
  }, {
    key: "render",
    value: function render() {
      var x = this.x,
          y = this.y;
      var _props2 = this.props,
          background = _props2.background,
          gridColor = _props2.gridColor,
          textStyle = _props2.textStyle;


      var sx = x(0);
      var sy = y(0);
      var ex = x(1);
      var ey = y(1);

      var xhalf = this.gridX(2);
      var yhalf = this.gridY(2);
      var xtenth = this.gridX(10);
      var ytenth = this.gridY(10);

      var gridbg = "M" + sx + "," + sy + " L" + sx + "," + ey + " L" + ex + "," + ey + " L" + ex + "," + sy + " Z";

      var tenth = xtenth.map(function (xp) {
        return "M" + xp + "," + sy + " L" + xp + "," + ey;
      }).concat(ytenth.map(function (yp) {
        return "M" + sx + "," + yp + " L" + ex + "," + yp;
      })).join(" ");

      var half = xhalf.map(function (xp) {
        return "M" + xp + "," + sy + " L" + xp + "," + ey;
      }).concat(yhalf.map(function (yp) {
        return "M" + sx + "," + yp + " L" + ex + "," + yp;
      })).concat(["M" + sx + "," + sy + " L" + ex + "," + ey]).join(" ");

      var ticksLeft = ytenth.map(function (yp, i) {
        var w = 3 + (i % 5 === 0 ? 2 : 0);
        return "M" + sx + "," + yp + " L" + (sx - w) + "," + yp;
      }).join(" ");

      var ticksBottom = xtenth.map(function (xp, i) {
        var h = 3 + (i % 5 === 0 ? 2 : 0);
        return "M" + xp + "," + sy + " L" + xp + "," + (sy + h);
      }).join(" ");

      return _react2.default.createElement(
        "g",
        null,
        _react2.default.createElement("path", {
          fill: background,
          d: gridbg }),
        _react2.default.createElement("path", {
          strokeWidth: "1px",
          stroke: gridColor,
          d: tenth }),
        _react2.default.createElement("path", {
          strokeWidth: "2px",
          stroke: gridColor,
          d: half }),
        _react2.default.createElement("path", {
          strokeWidth: "1px",
          stroke: gridColor,
          d: ticksLeft }),
        _react2.default.createElement(
          "text",
          {
            style: (0, _objectAssign2.default)({ textAnchor: "end" }, textStyle),
            transform: "rotate(-90)",
            x: -this.y(1),
            y: this.x(0) - 8
          },
          "Progress Percentage"
        ),
        _react2.default.createElement("path", {
          strokeWidth: "1px",
          stroke: gridColor,
          d: ticksBottom }),
        _react2.default.createElement(
          "text",
          {
            style: (0, _objectAssign2.default)({ dominantBaseline: "text-before-edge" }, textStyle),
            textAnchor: "end",
            x: this.x(1),
            y: this.y(0) + 5 },
          "Time Percentage"
        )
      );
    }
  }]);

  return Grid;
}(_BezierComponent3.default);

exports.default = Grid;