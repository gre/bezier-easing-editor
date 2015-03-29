import React from "react";
import uncontrollable from "uncontrollable";
import objectAssign from "object-assign";
import BezierEasing from "bezier-easing";
const {PropTypes, Component} = React;

function range (from, to, step) {
  const t = [];
  for (let i=from; i<to; i+=step)
    t.push(i);
  return t;
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
  onChange: function(){},
  width: 300,
  height: 300,
  padding: [25, 5, 25, 18],
  progress: 0,
  background: "#fff",
  color: "#000",
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

class BezierEditor extends Component {

  constructor (props) {
    super(props);
    this.state = {
      down: 0,
      hover: 0,
      startx: null,
      starty: null
    };
    this.x = this.x.bind(this);
    this.y = this.y.bind(this);
    this.onDownLeave = this.onDownLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDownMove = this.onDownMove.bind(this);
    this.onDownUp = this.onDownUp.bind(this);
    this.onHoverMove = this.onHoverMove.bind(this);
  }

  render () {
    const {x, y} = this;
    const {
      width,
      height,
      value,
      handleStroke,
      handleRadius,
      background,
      gridColor,
      curveColor,
      curveWidth,
      handleColor,
      color,
      style,
      padding,
      textStyle,
      progress,
      progressColor
    } = this.props;
    const {
      down,
      hover
    } = this.state;

    const styles = objectAssign({
      background: background,
      cursor: down ? "move" : hover ? "pointer" : "default"
    }, style);

    const sx = x(0);
    const sy = y(0);
    const ex = x(1);
    const ey = y(1);

    const px = x(progress);
    const py = y(progress ? BezierEasing.apply(null, value)(progress) : 0);

    const cx1 = x(value[0]);
    const cy1 = y(value[1]);
    const cx2 = x(value[2]);
    const cy2 = y(value[3]);
    const a1 = Math.atan2(cy1-sy, cx1-sx);
    const a2 = Math.atan2(cy2-ey, cx2-ex);
    const cx1s = cx1 - handleRadius * Math.cos(a1);
    const cy1s = cy1 - handleRadius * Math.sin(a1);
    const cx2s = cx2 - handleRadius * Math.cos(a2);
    const cy2s = cy2 - handleRadius * Math.sin(a2);
    const gridbg = [
      "M"+[sx,sy],
      "L"+[sx,ey],
      "L"+[ex,ey],
      "L"+[ex,sy],
      "Z"
    ].join(" ");
    const curve = [
      "M"+[sx,sy],
      "C"+[cx1,cy1],
      ""+[cx2,cy2],
      ""+[ex,ey]
    ].join(" ");
    const prog = [
      "M"+[px,sy],
      "L"+[px,py],
      "L"+[sx,py]
    ].join(" ");

    const xhalf = this.gridX(2);
    const yhalf = this.gridY(2);
    const xtenth = this.gridX(10);
    const ytenth = this.gridY(10);

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

    var mouseEvents = {
      onMouseDown: this.onMouseDown
    };
    if (down) {
      mouseEvents.onMouseMove = this.onDownMove;
      mouseEvents.onMouseUp = this.onDownUp;
      mouseEvents.onMouseLeave = this.onDownLeave;
    }
    else {
      mouseEvents.onMouseMove = this.onHoverMove;
    }

    return <svg
      style={styles}
      width={width}
      height={height}
      {...mouseEvents}>
      <g>
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
          fill="none"
          strokeWidth="1px"
          stroke={progressColor}
          d={prog} />
      </g>
      <path
        fill="none"
        stroke={curveColor}
        strokeWidth={curveWidth}
        d={curve} />
      <g>
        <path
          strokeWidth="1px"
          stroke={gridColor}
          d={ticksLeft} />
        <text
          style={objectAssign({ textAnchor: "end" }, textStyle)}
          transform="rotate(-90)"
          fill={color}
          x={-padding[0]}
          y={sx-8}
        >Progress Percentage</text>
      </g>
      <g>
        <path
          strokeWidth="1px"
          stroke={gridColor}
          d={ticksBottom} />
        <text
          style={objectAssign({ dominantBaseline: "text-before-edge" }, textStyle)}
          textAnchor="end"
          fill={color}
          x={ex}
          y={sy+5}>Time Percentage</text>
      </g>
      <g>
        <g>
          <line
            stroke={handleColor}
            strokeWidth={hover===1 ? 1 + handleStroke : handleStroke}
            x1={cx1s}
            y1={cy1s}
            x2={sx}
            y2={sy} />
          <circle
            ref="handle1"
            cx={cx1}
            cy={cy1}
            r={handleRadius}
            stroke={handleColor}
            strokeWidth={hover===1 ? 2 * handleStroke : handleStroke}
            fill={handleColor} />
        </g>
        <g>
          <line
            stroke={handleColor}
            strokeWidth={hover===2 ? 1 + handleStroke : handleStroke}
            x1={cx2s}
            y1={cy2s}
            x2={ex}
            y2={ey} />
          <circle
            ref="handle2"
            cx={cx2}
            cy={cy2}
            r={handleRadius}
            stroke={handleColor}
            strokeWidth={hover===2 ? 2 * handleStroke : handleStroke}
            fill={handleColor} />
        </g>
      </g>
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

  onHoverMove (e) {
    const hover = this.handleForEvent(e);
    if (hover !== this.state.hover) {
      this.setState({
        hover: hover
      });
    }
  }

  onMouseDown (e) {
    const down = this.handleForEvent(e);
    if (down) {
      e.preventDefault();
      this.setState({
        down: down,
        hover: 0,
        startx: e.clientX,
        starty: e.clientY
      });
    }
  }

  onDownMove (e) {
    if (this.state.down) {
      e.preventDefault();
      const rect = React.findDOMNode(this).getBoundingClientRect();
      const i = 2*(this.state.down-1);
      const value = [].concat(this.props.value);
      value[i] = this.inversex(e.clientX - rect.left);
      value[i+1] = this.inversey(e.clientY - rect.top);
      this.props.onChange(value);
    }
  }

  onDownUp (e) {
    this.onDownMove(e);
    this.setState({
      down: 0
    });
  }

  handleForEvent (e) {
    return e.target === this.refs.handle1.getDOMNode() ? 1 : e.target === this.refs.handle2.getDOMNode() ? 2 : 0;
  }

  gridX (div) {
    var step = 1 / div;
    return range(0, 1, step).map(this.x);
  }

  gridY (div) {
    var step = 1 / div;
    return range(0, 1, step).map(this.y);
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
