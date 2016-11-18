import React from "react";
import {findDOMNode} from "react-dom";
import objectAssign from "object-assign";
const {PropTypes, Component} = React;

import Grid from "./Grid";
import Handle from "./Handle";
import Progress from "./Progress";
import Curve from "./Curve";

const propTypes = {
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

const defaultProps = {
  value: [0.25, 0.25, 0.75, 0.75 ],
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

export default class BezierEditor extends Component {

  constructor (props) {
    super(props);
    this.state = {
      down: 0,
      hover: 0
    };
    this.x = this.x.bind(this);
    this.y = this.y.bind(this);
    this.onDownLeave = this.onDownLeave.bind(this);
    this.onDownMove = this.onDownMove.bind(this);
    this.onDownUp = this.onDownUp.bind(this);
    this.onEnterHandle1 = this.onEnterHandle.bind(this, 1);
    this.onEnterHandle2 = this.onEnterHandle.bind(this, 2);
    this.onLeaveHandle1 = this.onLeaveHandle.bind(this, 1);
    this.onLeaveHandle2 = this.onLeaveHandle.bind(this, 2);
    this.onDownHandle1 = this.onDownHandle.bind(this, 1);
    this.onDownHandle2 = this.onDownHandle.bind(this, 2);
  }

  render () {
    const { x, y } = this;
    const {
      value,
      width,
      height,
      handleRadius,
      style,
      progress,
      handleStroke,
      background,
      gridColor,
      curveColor,
      curveWidth,
      handleColor,
      textStyle,
      progressColor,
      readOnly,
      pointers
    } = this.props;

    const {
      down,
      hover
    } = this.state;

    const sharedProps = {
      xFrom: x(0),
      yFrom: y(0),
      xTo: x(1),
      yTo: y(1)
    };

    const cursor = objectAssign({}, propTypes.pointers, pointers);

    const styles = objectAssign({
      background: background,
      cursor: down ? cursor.down : hover ? cursor.hover : cursor.def,
      userSelect: "none",
      WebkitUserSelect: "none",
      MozUserSelect: "none"
    }, style);

    const containerEvents = readOnly||!down ? {} : {
      onMouseMove: this.onDownMove,
      onMouseUp: this.onDownUp,
      onMouseLeave: this.onDownLeave
    };
    const handle1Events = readOnly||down ? {} : {
      onMouseDown: this.onDownHandle1,
      onMouseEnter: this.onEnterHandle1,
      onMouseLeave: this.onLeaveHandle1
    };
    const handle2Events = readOnly||down ? {} : {
      onMouseDown: this.onDownHandle2,
      onMouseEnter: this.onEnterHandle2,
      onMouseLeave: this.onLeaveHandle2
    };

    return <svg
      style={styles}
      width={width}
      height={height}
      {...containerEvents}>
      <Grid {...sharedProps} background={background} gridColor={gridColor} textStyle={objectAssign({}, defaultProps.textStyle, textStyle)} />
      <Progress {...sharedProps} value={value} progress={progress} progressColor={progressColor} />
      <Curve {...sharedProps} value={value} curveColor={curveColor} curveWidth={curveWidth} />
      {this.props.children}
      {readOnly ? undefined :
      <g>
        <Handle {...sharedProps} {...handle1Events} index={0} xval={value[0]} yval={value[1]} handleRadius={handleRadius} handleColor={handleColor} down={down===1} hover={hover===1} handleStroke={handleStroke} background={background} />
        <Handle {...sharedProps} {...handle2Events} index={1} xval={value[2]} yval={value[3]} handleRadius={handleRadius} handleColor={handleColor} down={down===2} hover={hover===2} handleStroke={handleStroke} background={background} />
      </g>
      }
    </svg>;
  }

  onDownLeave (e) {
    if (this.state.down) {
      this.onDownMove(e);
      this.setState({
        down: null
      });
    }
  }

  onDownHandle (h, e) {
    e.preventDefault();
    this.setState({
      hover: null,
      down: h
    });
  }

  onEnterHandle (h) {
    if (!this.state.down) {
      this.setState({
        hover: h
      });
    }
  }

  onLeaveHandle () {
    if (!this.state.down) {
      this.setState({
        hover: null
      });
    }
  }

  onDownMove (e) {
    if (this.state.down) {
      e.preventDefault();
      const i = 2*(this.state.down-1);
      const value = [].concat(this.props.value);
      const [ x, y ] = this.positionForEvent(e);
      value[i] = this.inversex(x);
      value[i+1] = this.inversey(y);
      this.props.onChange(value);
    }
  }

  onDownUp () {
    // this.onDownMove(e);
    this.setState({
      down: 0
    });
  }

  positionForEvent (e) {
    const rect = findDOMNode(this).getBoundingClientRect();
    return [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
  }

  x (value) {
    const padding = this.props.padding;
    const w = this.props.width - padding[1] - padding[3];
    return Math.round(padding[3] + value * w);
  }

  inversex (x) {
    const padding = this.props.padding;
    const w = this.props.width - padding[1] - padding[3];
    return Math.max(0, Math.min((x-padding[3]) / w, 1));
  }

  y (value) {
    const padding = this.props.padding;
    const h = this.props.height - padding[0] - padding[2];
    return Math.round(padding[0] + (1-value) * h);
  }

  inversey (y) {
    const {
      height,
      handleRadius,
      padding
    } = this.props;
    const clampMargin = 2 * handleRadius;
    const h = height - padding[0] - padding[2];
    y = Math.max(clampMargin, Math.min(y, height - clampMargin));
    return 1 - (y - padding[0]) / h;
  }
}

BezierEditor.propTypes = propTypes;
BezierEditor.defaultProps = defaultProps;
