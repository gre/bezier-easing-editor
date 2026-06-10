import { memo, useEffect, useRef } from "react";
import type { PointerEventHandler } from "react";
import { projectX, projectY, type Projection } from "./types";

export interface HandleProps extends Projection {
  index: 0 | 1;
  xval: number;
  yval: number;
  handleRadius: number;
  handleColor: string;
  handleStroke: number;
  background: string;
  hover: boolean;
  down: boolean;
  onPointerDown?: PointerEventHandler<SVGCircleElement>;
  onPointerEnter?: PointerEventHandler<SVGCircleElement>;
  onPointerLeave?: PointerEventHandler<SVGCircleElement>;
}

function Handle(props: HandleProps) {
  const {
    index,
    xval,
    yval,
    handleRadius,
    handleColor,
    handleStroke,
    background,
    hover,
    down,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
  } = props;

  // touch-action is ignored on SVG children by some browsers (iOS Safari) and
  // React registers touch listeners as passive: preventing the scroll on
  // handle touches requires a native non-passive touchstart listener
  const hitRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const el = hitRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => el.removeEventListener("touchstart", onTouchStart);
  }, []);

  const sx = projectX(props, index);
  const sy = projectY(props, index);
  const cx = projectX(props, xval);
  const cy = projectY(props, yval);
  const a = Math.atan2(cy - sy, cx - sx);
  const cxs = cx - handleRadius * Math.cos(a);
  const cys = cy - handleRadius * Math.sin(a);

  return (
    <g>
      <line
        stroke={handleColor}
        strokeWidth={hover || down ? 1 + handleStroke : handleStroke}
        x1={cxs}
        y1={cys}
        x2={sx}
        y2={sy}
      />
      <circle
        cx={cx}
        cy={cy}
        r={handleRadius}
        stroke={handleColor}
        strokeWidth={hover || down ? 2 * handleStroke : handleStroke}
        fill={down ? background : handleColor}
      />
      <circle
        ref={hitRef}
        data-handle={index}
        cx={cx}
        cy={cy}
        r={Math.max(2 * handleRadius, 22)}
        fill="transparent"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      />
    </g>
  );
}

export default memo(Handle);
