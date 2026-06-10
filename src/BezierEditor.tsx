import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactNode } from "react";

import Grid from "./Grid";
import Handle from "./Handle";
import Progress from "./Progress";
import Curve from "./Curve";
import type { BezierValue, Padding } from "./types";

export interface BezierEditorProps {
  /** Current easing value (controlled mode). */
  value?: BezierValue;
  /** Initial easing value (uncontrolled mode). */
  defaultValue?: BezierValue;
  /** Called with the new value whenever a handle is dragged. */
  onChange?: (value: BezierValue) => void;
  width?: number;
  height?: number;
  /** [top, right, bottom, left] padding around the grid, in pixels. */
  padding?: Padding;
  /** Current progress in [0,1] to visualize on the curve. */
  progress?: number;
  background?: string;
  gridColor?: string;
  curveColor?: string;
  curveWidth?: number;
  handleColor?: string;
  handleRadius?: number;
  handleStroke?: number;
  progressColor?: string;
  textStyle?: CSSProperties;
  readOnly?: boolean;
  style?: CSSProperties;
  className?: string;
  pointers?: { down?: string; hover?: string; def?: string };
  /** Extra SVG elements rendered between the curve and the handles. */
  children?: ReactNode;
}

const defaultTextStyle: CSSProperties = {
  fontFamily: "sans-serif",
  fontSize: "10px",
};

const defaultPointers = {
  down: "none",
  hover: "pointer",
  def: "default",
};

const initialValue: BezierValue = [0.25, 0.25, 0.75, 0.75];

export default function BezierEditor({
  value: controlledValue,
  defaultValue,
  onChange,
  width = 300,
  height = 300,
  padding = [25, 5, 25, 18],
  progress = 0,
  background = "#fff",
  gridColor = "#eee",
  curveColor = "#333",
  curveWidth = 2,
  handleColor = "#f00",
  handleRadius = 5,
  handleStroke = 2,
  progressColor = "#ccc",
  textStyle,
  readOnly,
  style,
  className,
  pointers,
  children,
}: BezierEditorProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<BezierValue>(
    defaultValue ?? initialValue
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [hover, setHover] = useState<0 | 1 | 2>(0);
  const [dragVersion, setDragVersion] = useState(0);
  const rootRef = useRef<SVGSVGElement>(null);
  const dragsRef = useRef(new Map<number, 1 | 2>());

  // refs so the window listeners always see the latest props, and so two
  // pointermove events in the same frame don't overwrite each other's change
  const latest = useRef({ padding, width, height, handleRadius, onChange, isControlled });
  latest.current = { padding, width, height, handleRadius, onChange, isControlled };
  const valueRef = useRef(value);
  valueRef.current = value;

  const down1 = [...dragsRef.current.values()].includes(1);
  const down2 = [...dragsRef.current.values()].includes(2);
  const anyDown = down1 || down2;

  useEffect(() => {
    if (!anyDown) return;
    const onPointerMove = (e: PointerEvent) => {
      const handle = dragsRef.current.get(e.pointerId);
      if (!handle) return;
      e.preventDefault();
      const { padding, width, height, handleRadius, onChange, isControlled } =
        latest.current;
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const w = width - padding[1] - padding[3];
      const xval = Math.max(0, Math.min((px - padding[3]) / w, 1));

      const clampMargin = 2 * handleRadius;
      const h = height - padding[0] - padding[2];
      const cy = Math.max(clampMargin, Math.min(py, height - clampMargin));
      const yval = 1 - (cy - padding[0]) / h;

      const next = valueRef.current.slice() as BezierValue;
      const i = 2 * (handle - 1);
      next[i] = xval;
      next[i + 1] = yval;
      valueRef.current = next;
      if (!isControlled) setUncontrolledValue(next);
      onChange?.(next);
    };
    const onPointerEnd = (e: PointerEvent) => {
      if (dragsRef.current.delete(e.pointerId)) {
        setDragVersion((v) => v + 1);
      }
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
    };
  }, [anyDown, dragVersion]);

  const beginDrag = useCallback((handle: 1 | 2, e: React.PointerEvent) => {
    e.preventDefault();
    const drags = dragsRef.current;
    if ([...drags.values()].includes(handle)) return;
    drags.set(e.pointerId, handle);
    setHover(0);
    setDragVersion((v) => v + 1);
  }, []);
  const onDownHandle1 = useCallback(
    (e: React.PointerEvent) => beginDrag(1, e),
    [beginDrag]
  );
  const onDownHandle2 = useCallback(
    (e: React.PointerEvent) => beginDrag(2, e),
    [beginDrag]
  );
  const onEnterHandle1 = useCallback(() => setHover((h) => h || 1), []);
  const onEnterHandle2 = useCallback(() => setHover((h) => h || 2), []);
  const onLeaveHandle = useCallback(() => setHover(0), []);

  const x = (v: number) => {
    const w = width - padding[1] - padding[3];
    return Math.round(padding[3] + v * w);
  };
  const y = (v: number) => {
    const h = height - padding[0] - padding[2];
    return Math.round(padding[0] + (1 - v) * h);
  };

  const projection = {
    xFrom: x(0),
    yFrom: y(0),
    xTo: x(1),
    yTo: y(1),
  };

  const cursor = { ...defaultPointers, ...pointers };

  const styles: CSSProperties = {
    background,
    cursor: anyDown ? cursor.down : hover ? cursor.hover : cursor.def,
    userSelect: "none",
    ...style,
  };

  const handle1Events =
    readOnly || down1
      ? {}
      : {
          onPointerDown: onDownHandle1,
          onPointerEnter: onEnterHandle1,
          onPointerLeave: onLeaveHandle,
        };
  const handle2Events =
    readOnly || down2
      ? {}
      : {
          onPointerDown: onDownHandle2,
          onPointerEnter: onEnterHandle2,
          onPointerLeave: onLeaveHandle,
        };

  return (
    <svg
      ref={rootRef}
      className={className}
      style={styles}
      width={width}
      height={height}
    >
      <Grid
        {...projection}
        background={background}
        gridColor={gridColor}
        textStyle={{ ...defaultTextStyle, ...textStyle }}
      />
      <Progress
        {...projection}
        value={value}
        progress={progress}
        progressColor={progressColor}
      />
      <Curve
        {...projection}
        value={value}
        curveColor={curveColor}
        curveWidth={curveWidth}
      />
      {children}
      {readOnly ? null : (
        <g>
          <Handle
            {...projection}
            {...handle1Events}
            index={0}
            xval={value[0]}
            yval={value[1]}
            handleRadius={handleRadius}
            handleColor={handleColor}
            handleStroke={handleStroke}
            background={background}
            down={down1}
            hover={hover === 1}
          />
          <Handle
            {...projection}
            {...handle2Events}
            index={1}
            xval={value[2]}
            yval={value[3]}
            handleRadius={handleRadius}
            handleColor={handleColor}
            handleStroke={handleStroke}
            background={background}
            down={down2}
            hover={hover === 2}
          />
        </g>
      )}
    </svg>
  );
}
