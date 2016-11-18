"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _Grid = require("./Grid");

var _Grid2 = _interopRequireDefault(_Grid);

var _Handle = require("./Handle");

var _Handle2 = _interopRequireDefault(_Handle);

var _Progress = require("./Progress");

var _Progress2 = _interopRequireDefault(_Progress);

var _Curve = require("./Curve");

var _Curve2 = _interopRequireDefault(_Curve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = _react2.default.PropTypes,
    Component = _react2.default.Component;


var propTypes = {
  onChange: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.array,
  handleRadius: PropTypes.number,
  style: PropTypes.object,
  progress: PropTypes.number,
  handleStroke: PropTypes.number,
  background: PropTypes.string,
  gridColor: PropTypes.string,
  curveColor: PropTypes.string,
  curveWidth: PropTypes.number,
  handleColor: PropTypes.string,
  color: PropTypes.string,
  textStyle: PropTypes.object,
  progressColor: PropTypes.string,
  readOnly: PropTypes.bool
};

var defaultProps = {
  value: [0.25, 0.25, 0.75, 0.75],
  width: 300,
  height: 300,
  padding: [25, 5, 25, 18],
  progress: 0,
  background: "#fff",
  color: "#000", // FIXME what is color?
  gridColor: "#eee",
  curveColor: "#333",
  progressColor: "#ccc",
  handleColor: "#f00",
  curveWidth: 2,
  handleRadius: 5,
  handleStroke: 2,
  textStyle: {
    fontFamily: "sans-serif",
    fontSize: "10px"
  },
  pointers: {
    down: "none",
    hover: "pointer",
    def: "default"
  }
};

var BezierEditor = function (_Component) {
  _inherits(BezierEditor, _Component);

  function BezierEditor(props) {
    _classCallCheck(this, BezierEditor);

    var _this = _possibleConstructorReturn(this, (BezierEditor.__proto__ || Object.getPrototypeOf(BezierEditor)).call(this, props));

    _this.state = {
      down: 0,
      hover: 0
    };
    _this.x = _this.x.bind(_this);
    _this.y = _this.y.bind(_this);
    _this.onDownLeave = _this.onDownLeave.bind(_this);
    _this.onDownMove = _this.onDownMove.bind(_this);
    _this.onDownUp = _this.onDownUp.bind(_this);
    _this.onEnterHandle1 = _this.onEnterHandle.bind(_this, 1);
    _this.onEnterHandle2 = _this.onEnterHandle.bind(_this, 2);
    _this.onLeaveHandle1 = _this.onLeaveHandle.bind(_this, 1);
    _this.onLeaveHandle2 = _this.onLeaveHandle.bind(_this, 2);
    _this.onDownHandle1 = _this.onDownHandle.bind(_this, 1);
    _this.onDownHandle2 = _this.onDownHandle.bind(_this, 2);
    return _this;
  }

  _createClass(BezierEditor, [{
    key: "render",
    value: function render() {
      var x = this.x,
          y = this.y;
      var _props = this.props,
          value = _props.value,
          width = _props.width,
          height = _props.height,
          handleRadius = _props.handleRadius,
          style = _props.style,
          progress = _props.progress,
          handleStroke = _props.handleStroke,
          background = _props.background,
          gridColor = _props.gridColor,
          curveColor = _props.curveColor,
          curveWidth = _props.curveWidth,
          handleColor = _props.handleColor,
          textStyle = _props.textStyle,
          progressColor = _props.progressColor,
          readOnly = _props.readOnly,
          pointers = _props.pointers;
      var _state = this.state,
          down = _state.down,
          hover = _state.hover;


      var sharedProps = {
        xFrom: x(0),
        yFrom: y(0),
        xTo: x(1),
        yTo: y(1)
      };

      var cursor = (0, _objectAssign2.default)({}, propTypes.pointers, pointers);

      var styles = (0, _objectAssign2.default)({
        background: background,
        cursor: down ? cursor.down : hover ? cursor.hover : cursor.def,
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none"
      }, style);

      var containerEvents = readOnly || !down ? {} : {
        onMouseMove: this.onDownMove,
        onMouseUp: this.onDownUp,
        onMouseLeave: this.onDownLeave
      };
      var handle1Events = readOnly || down ? {} : {
        onMouseDown: this.onDownHandle1,
        onMouseEnter: this.onEnterHandle1,
        onMouseLeave: this.onLeaveHandle1
      };
      var handle2Events = readOnly || down ? {} : {
        onMouseDown: this.onDownHandle2,
        onMouseEnter: this.onEnterHandle2,
        onMouseLeave: this.onLeaveHandle2
      };

      return _react2.default.createElement(
        "svg",
        _extends({
          style: styles,
          width: width,
          height: height
        }, containerEvents),
        _react2.default.createElement(_Grid2.default, _extends({}, sharedProps, { background: background, gridColor: gridColor, textStyle: (0, _objectAssign2.default)({}, defaultProps.textStyle, textStyle) })),
        _react2.default.createElement(_Progress2.default, _extends({}, sharedProps, { value: value, progress: progress, progressColor: progressColor })),
        _react2.default.createElement(_Curve2.default, _extends({}, sharedProps, { value: value, curveColor: curveColor, curveWidth: curveWidth })),
        this.props.children,
        readOnly ? undefined : _react2.default.createElement(
          "g",
          null,
          _react2.default.createElement(_Handle2.default, _extends({}, sharedProps, handle1Events, { index: 0, xval: value[0], yval: value[1], handleRadius: handleRadius, handleColor: handleColor, down: down === 1, hover: hover === 1, handleStroke: handleStroke, background: background })),
          _react2.default.createElement(_Handle2.default, _extends({}, sharedProps, handle2Events, { index: 1, xval: value[2], yval: value[3], handleRadius: handleRadius, handleColor: handleColor, down: down === 2, hover: hover === 2, handleStroke: handleStroke, background: background }))
        )
      );
    }
  }, {
    key: "onDownLeave",
    value: function onDownLeave(e) {
      if (this.state.down) {
        this.onDownMove(e);
        this.setState({
          down: null
        });
      }
    }
  }, {
    key: "onDownHandle",
    value: function onDownHandle(h, e) {
      e.preventDefault();
      this.setState({
        hover: null,
        down: h
      });
    }
  }, {
    key: "onEnterHandle",
    value: function onEnterHandle(h) {
      if (!this.state.down) {
        this.setState({
          hover: h
        });
      }
    }
  }, {
    key: "onLeaveHandle",
    value: function onLeaveHandle() {
      if (!this.state.down) {
        this.setState({
          hover: null
        });
      }
    }
  }, {
    key: "onDownMove",
    value: function onDownMove(e) {
      if (this.state.down) {
        e.preventDefault();
        var i = 2 * (this.state.down - 1);
        var value = [].concat(this.props.value);

        var _positionForEvent = this.positionForEvent(e),
            _positionForEvent2 = _slicedToArray(_positionForEvent, 2),
            x = _positionForEvent2[0],
            y = _positionForEvent2[1];

        value[i] = this.inversex(x);
        value[i + 1] = this.inversey(y);
        this.props.onChange(value);
      }
    }
  }, {
    key: "onDownUp",
    value: function onDownUp() {
      // this.onDownMove(e);
      this.setState({
        down: 0
      });
    }
  }, {
    key: "positionForEvent",
    value: function positionForEvent(e) {
      var rect = (0, _reactDom.findDOMNode)(this).getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
  }, {
    key: "x",
    value: function x(value) {
      var padding = this.props.padding;
      var w = this.props.width - padding[1] - padding[3];
      return Math.round(padding[3] + value * w);
    }
  }, {
    key: "inversex",
    value: function inversex(x) {
      var padding = this.props.padding;
      var w = this.props.width - padding[1] - padding[3];
      return Math.max(0, Math.min((x - padding[3]) / w, 1));
    }
  }, {
    key: "y",
    value: function y(value) {
      var padding = this.props.padding;
      var h = this.props.height - padding[0] - padding[2];
      return Math.round(padding[0] + (1 - value) * h);
    }
  }, {
    key: "inversey",
    value: function inversey(y) {
      var _props2 = this.props,
          height = _props2.height,
          handleRadius = _props2.handleRadius,
          padding = _props2.padding;

      var clampMargin = 2 * handleRadius;
      var h = height - padding[0] - padding[2];
      y = Math.max(clampMargin, Math.min(y, height - clampMargin));
      return 1 - (y - padding[0]) / h;
    }
  }]);

  return BezierEditor;
}(Component);

exports.default = BezierEditor;


BezierEditor.propTypes = propTypes;
BezierEditor.defaultProps = defaultProps;