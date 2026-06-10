import { memo, useMemo } from "react";
import BezierEasing from "bezier-easing";
import { projectX, projectY, type BezierValue, type Projection } from "./types";

export interface ProgressProps extends Projection {
  value: BezierValue;
  progress: number;
  progressColor: string;
}

function Progress(props: ProgressProps) {
  const { value, progress, progressColor } = props;
  const easing = useMemo(
    () => BezierEasing(value[0], value[1], value[2], value[3]),
    [value[0], value[1], value[2], value[3]]
  );
  if (!progress) return null;
  const x = (v: number) => projectX(props, v);
  const y = (v: number) => projectY(props, v);
  const px = x(progress);
  const py = y(easing(progress));
  const prog = `M${px},${y(0)} L${px},${py} L${x(0)},${py}`;
  return <path fill="none" strokeWidth="1px" stroke={progressColor} d={prog} />;
}

export default memo(Progress);
