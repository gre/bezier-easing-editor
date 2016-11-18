"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BezierEditor = require("./BezierEditor");

var _BezierEditor2 = _interopRequireDefault(_BezierEditor);

var _uncontrollable = require("uncontrollable");

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _uncontrollable2.default)(_BezierEditor2.default, {
  value: "onChange"
});