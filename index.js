import React from "react";
import uncontrollable from "./src/uncontrollable";
import objectAssign from "object-assign";
import BezierEasing from "bezier-easing";
const {PropTypes, Component} = React;

function range (from, to, step) {
  const t = [];
  for (let i=from; i<to; i+=step)
    t.push(i);
  return t;
}

function interp (a, b, x) {
  return a * (1-x) + b * x;
}

const propTypes = {
  value: PropTypes.array,
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
  progressColor: PropTypes.string
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
  }
};

class BezierComponent extends Component {
  constructor (props) {
    super(props);
    this.x = this.x.bind(this);
    this.y = this.y.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    const {
      xFrom,
      yFrom,
      xTo,
      yTo
    } = this.props;
    return nextProps.xFrom !== xFrom ||
      nextProps.yFrom !== yFrom ||
      nextProps.xTo !== xTo ||
      nextProps.yTo !== yTo;
  }
  x (value) {
    return Math.round(interp(this.props.xFrom, this.props.xTo, value));
  }

  y (value) {
    return Math.round(interp(this.props.yFrom, this.props.yTo, value));
  }
}

class Grid extends BezierComponent {

  gridX (div) {
    var step = 1 / div;
    return range(0, 1, step).map(this.x);
  }

  gridY (div) {
    var step = 1 / div;
    return range(0, 1, step).map(this.y);
  }

  shouldComponentUpdate(nextProps) {
    if (super.shouldComponentUpdate(nextProps)) return true;
    const {
      background,
      gridColor,
      textStyle,
      color
    } = this.props;
    return nextProps.background !== background ||
      nextProps.gridColor !== gridColor ||
      nextProps.textStyle !== textStyle ||
      nextProps.color !== color;
  }

  render() {
    const { x, y } = this;
    const {
      background,
      gridColor,
      textStyle,
      color
    } = this.props;

    const sx = x(0);
    const sy = y(0);
    const ex = x(1);
    const ey = y(1);

    const xhalf = this.gridX(2);
    const yhalf = this.gridY(2);
    const xtenth = this.gridX(10);
    const ytenth = this.gridY(10);

    const gridbg = [
      "M"+[sx,sy],
      "L"+[sx,ey],
      "L"+[ex,ey],
      "L"+[ex,sy],
      "Z"
    ].join(" ");

    const tenth =
      xtenth
      .map(xp => [ "M"+[xp,sy], "L"+[xp,ey] ] )
      .concat(ytenth.map(yp => [ "M"+[sx,yp], "L"+[ex,yp] ]))
      .join(" ");

    const half =
      xhalf
      .map(xp => [ "M"+[xp,sy], "L"+[xp,ey] ])
      .concat(yhalf.map(yp => [ "M"+[sx,yp], "L"+[ex,yp] ]))
      .concat([ "M"+[sx,sy], "L"+[ex,ey] ])
      .join(" ");

    const ticksLeft =
      ytenth.map( (yp, i) => {
        const w = 3 + (i % 5 === 0 ? 2 : 0);
        return [ "M"+[sx,yp], "L"+[sx-w,yp] ];
      }).join(" ");

    const ticksBottom =
      xtenth.map((xp, i) => {
        const h = 3 + (i % 5 === 0 ? 2 : 0);
        return [ "M"+[xp,sy], "L"+[xp,sy+h] ];
      }).join(" ");

    return <g>
      <path
        fill={background}
        d={gridbg} />
      <path
        strokeWidth="1px"
        stroke={gridColor}
        d={tenth} />
      <path
        strokeWidth="2px"
        stroke={gridColor}
        d={half} />
      <path
        strokeWidth="1px"
        stroke={gridColor}
        d={ticksLeft} />
      <text
        style={objectAssign({ textAnchor: "end" }, textStyle)}
        transform="rotate(-90)"
        fill={color}
        x={-this.y(1)}
        y={this.x(0)-8}
      >Progress Percentage</text>
      <path
        strokeWidth="1px"
        stroke={gridColor}
        d={ticksBottom} />
      <text
        style={objectAssign({ dominantBaseline: "text-before-edge" }, textStyle)}
        textAnchor="end"
        fill={color}
        x={this.x(1)}
        y={this.y(0)+5}>Time Percentage</text>
    </g>;
  }
}

class Handle extends BezierComponent {

  shouldComponentUpdate(nextProps) {
    if (super.shouldComponentUpdate(nextProps)) return true;
    const {
      index,
      handleRadius,
      handleColor,
      hover,
      down,
      background,
      handleStroke,
      xval,
      yval,
      onMouseEnter,
      onMouseLeave,
      onMouseDown
    } = this.props;
    return nextProps.index !== index ||
    nextProps.handleRadius !== handleRadius ||
    nextProps.handleColor !== handleColor ||
    nextProps.hover !== hover ||
    nextProps.down !== down ||
    nextProps.background !== background ||
    nextProps.handleStroke !== handleStroke ||
    nextProps.xval !== xval ||
    nextProps.yval !== yval ||
    nextProps.onMouseDown !== onMouseDown ||
    nextProps.onMouseLeave !== onMouseLeave ||
    nextProps.onMouseEnter !== onMouseEnter;
  }

  render() {
    const { x, y } = this;
    const {
      index,
      handleRadius,
      handleColor,
      hover,
      down,
      background,
      handleStroke,
      xval,
      yval,
      onMouseEnter,
      onMouseLeave,
      onMouseDown
    } = this.props;

    const sx = x(index);
    const sy = y(index);
    const cx = x(xval);
    const cy = y(yval);
    const a = Math.atan2(cy-sy, cx-sx);
    const cxs = cx - handleRadius * Math.cos(a);
    const cys = cy - handleRadius * Math.sin(a);

    return <g>
      <line
        stroke={handleColor}
        strokeWidth={hover||down ? 1 + handleStroke : handleStroke}
        x1={cxs}
        y1={cys}
        x2={sx}
        y2={sy} />
      <circle
        cx={cx}
        cy={cy}
        r={handleRadius}
        stroke={handleColor}
        strokeWidth={hover||down ? 2 * handleStroke : handleStroke}
        fill={down ? background: handleColor}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown} />
    </g>;
  }
}

class Curve extends BezierComponent {

  shouldComponentUpdate(nextProps) {
    if (super.shouldComponentUpdate(nextProps)) return true;
    const {
      curveColor,
      curveWidth,
      value
    } = this.props;
    return nextProps.curveColor !== curveColor ||
    nextProps.curveWidth !== curveWidth ||
    nextProps.value !== value;
  }

  render() {
    const {
      curveColor,
      curveWidth,
      value
    } = this.props;
    const {x, y} = this;
    const sx = x(0);
    const sy = y(0);
    const ex = x(1);
    const ey = y(1);
    const cx1 = x(value[0]);
    const cy1 = y(value[1]);
    const cx2 = x(value[2]);
    const cy2 = y(value[3]);
    const curve = [
      "M"+[sx,sy],
      "C"+[cx1,cy1],
      ""+[cx2,cy2],
      ""+[ex,ey]
    ].join(" ");

    return <path
      fill="none"
      stroke={curveColor}
      strokeWidth={curveWidth}
      d={curve} />;
  }
}

class Progress extends BezierComponent {

  constructor (props) {
    super(props);
    this.genEasing(props.value);
  }

  genEasing (value) {
    this.easing = BezierEasing.apply(null, value);
  }

  shouldComponentUpdate(nextProps) {
    if (super.shouldComponentUpdate(nextProps)) return true;
    const {
      value,
      progress,
      progressColor
    } = this.props;
    return nextProps.progress !== progress ||
    nextProps.progressColor !== progressColor ||
    nextProps.value !== value;
  }

  componentWillUpdate (props) {
    if (this.props.value !== props.value) {
      this.genEasing(props.value);
    }
  }

  render() {
    const {
      progress,
      progressColor
    } = this.props;
    if (!progress) return <path />;
    const sx = this.x(0);
    const sy = this.y(0);
    const px = this.x(progress);
    const py = this.y(this.easing ? this.easing(progress) : 0);
    const prog = [
      "M"+[px,sy],
      "L"+[px,py],
      "L"+[sx,py]
    ].join(" ");
    return <path
      fill="none"
      strokeWidth="1px"
      stroke={progressColor}
      d={prog} />;
  }
}

class BezierEditor extends Component {

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
      color,
      textStyle,
      progressColor,
      onChange
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

    const styles = objectAssign({
      background: background,
      cursor: down ? "move" : hover ? "pointer" : "default"
    }, style);

    const containerEvents = !onChange||!down ? {} : {
      onMouseMove: this.onDownMove,
      onMouseUp: this.onDownUp,
      onMouseLeave: this.onDownLeave
    };
    const handle1Events = !onChange||down ? {} : {
      onMouseDown: this.onDownHandle1,
      onMouseEnter: this.onEnterHandle1,
      onMouseLeave: this.onLeaveHandle1
    };
    const handle2Events = !onChange||down ? {} : {
      onMouseDown: this.onDownHandle2,
      onMouseEnter: this.onEnterHandle2,
      onMouseLeave: this.onLeaveHandle2
    };

    return <svg
      style={styles}
      width={width}
      height={height}
      {...containerEvents}>
      <Grid {...sharedProps} background={background} gridColor={gridColor} textStyle={textStyle} color={color} />
      <Progress {...sharedProps} value={value} progress={progress} progressColor={progressColor} />
      <Curve {...sharedProps} value={value} curveColor={curveColor} curveWidth={curveWidth} />
      {!onChange ? undefined :
      <g>
        <Handle {...sharedProps} {...handle1Events} index={0} xval={value[0]} yval={value[1]} handleRadius={handleRadius} handleColor={handleColor} down={down===1} hover={hover===1} handleStroke={handleStroke} background={background} />
        <Handle {...sharedProps} {...handle2Events} index={1} xval={value[2]} yval={value[3]} handleRadius={handleRadius} handleColor={handleColor} down={down===2} hover={hover===2} handleStroke={handleStroke} background={background} />
      </g>
      }
      {this.props.children}
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
    const rect = React.findDOMNode(this).getBoundingClientRect();
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
    const padding = this.props.padding;
    const h = this.props.height - padding[0] - padding[2];
    return 1 - (y - padding[0]) / h;
  }
}

BezierEditor.propTypes = propTypes;
BezierEditor.defaultProps = defaultProps;

export default uncontrollable(BezierEditor, {
  value: "onChange"
});
