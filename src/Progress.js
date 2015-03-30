import React from "react";
import BezierEasing from "bezier-easing";
import BezierComponent from "./BezierComponent";

export default class Progress extends BezierComponent {

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
