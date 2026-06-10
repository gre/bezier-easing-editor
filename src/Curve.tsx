import { memo } from "react";
import { projectX, projectY, type BezierValue, type Projection } from "./types";

export interface CurveProps extends Projection {
  value: BezierValue;
  curveColor: string;
  curveWidth: number;
}

function Curve(props: CurveProps) {
  const { value, curveColor, curveWidth } = props;
  const x = (v: number) => projectX(props, v);
  const y = (v: number) => projectY(props, v);

  const curve = `M${x(0)},${y(0)} C${x(value[0])},${y(value[1])} ${x(
    value[2]
  )},${y(value[3])} ${x(1)},${y(1)}`;

  return <path fill="none" stroke={curveColor} strokeWidth={curveWidth} d={curve} />;
}

export default memo(Curve);
