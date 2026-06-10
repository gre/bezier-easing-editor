import { memo } from "react";
import type { CSSProperties } from "react";
import { projectX, projectY, type Projection } from "./types";

function range(from: number, to: number, step: number): number[] {
  const t = [];
  for (let i = from; i < to; i += step) t.push(i);
  return t;
}

export interface GridProps extends Projection {
  background: string;
  gridColor: string;
  textStyle: CSSProperties;
}

function Grid(props: GridProps) {
  const { background, gridColor, textStyle } = props;
  const x = (v: number) => projectX(props, v);
  const y = (v: number) => projectY(props, v);

  const sx = x(0);
  const sy = y(0);
  const ex = x(1);
  const ey = y(1);

  const xhalf = range(0, 1, 1 / 2).map(x);
  const yhalf = range(0, 1, 1 / 2).map(y);
  const xtenth = range(0, 1, 1 / 10).map(x);
  const ytenth = range(0, 1, 1 / 10).map(y);

  const gridbg = `M${sx},${sy} L${sx},${ey} L${ex},${ey} L${ex},${sy} Z`;

  const tenth = xtenth
    .map((xp) => `M${xp},${sy} L${xp},${ey}`)
    .concat(ytenth.map((yp) => `M${sx},${yp} L${ex},${yp}`))
    .join(" ");

  const half = xhalf
    .map((xp) => `M${xp},${sy} L${xp},${ey}`)
    .concat(yhalf.map((yp) => `M${sx},${yp} L${ex},${yp}`))
    .concat([`M${sx},${sy} L${ex},${ey}`])
    .join(" ");

  const ticksLeft = ytenth
    .map((yp, i) => {
      const w = 3 + (i % 5 === 0 ? 2 : 0);
      return `M${sx},${yp} L${sx - w},${yp}`;
    })
    .join(" ");

  const ticksBottom = xtenth
    .map((xp, i) => {
      const h = 3 + (i % 5 === 0 ? 2 : 0);
      return `M${xp},${sy} L${xp},${sy + h}`;
    })
    .join(" ");

  return (
    <g>
      <path fill={background} d={gridbg} />
      <path strokeWidth="1px" stroke={gridColor} d={tenth} />
      <path strokeWidth="2px" stroke={gridColor} d={half} />
      <path strokeWidth="1px" stroke={gridColor} d={ticksLeft} />
      <text
        style={{ textAnchor: "end", ...textStyle }}
        transform="rotate(-90)"
        x={-y(1)}
        y={x(0) - 8}
      >
        Progress Percentage
      </text>
      <path strokeWidth="1px" stroke={gridColor} d={ticksBottom} />
      <text
        style={textStyle}
        dominantBaseline="text-before-edge"
        textAnchor="end"
        x={x(1)}
        y={y(0) + 5}
      >
        Time Percentage
      </text>
    </g>
  );
}

export default memo(Grid);
