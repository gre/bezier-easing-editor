import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import BezierEditor from "./index";
import type { BezierValue } from "./index";

afterEach(cleanup);

function getHandles(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<SVGCircleElement>("circle[data-handle]")
  );
}

// jsdom has no real PointerEvent: back pointer events with MouseEvent and
// attach an explicit pointerId
function pointerEvent(type: string, pointerId: number, init: MouseEventInit = {}) {
  const e = new MouseEvent(type, { bubbles: true, cancelable: true, ...init });
  Object.defineProperty(e, "pointerId", { value: pointerId });
  return e;
}
function pointerDown(el: Element, pointerId = 1) {
  fireEvent(el, pointerEvent("pointerdown", pointerId));
}
function pointerMove(clientX: number, clientY: number, pointerId = 1) {
  fireEvent(window, pointerEvent("pointermove", pointerId, { clientX, clientY }));
}
function pointerUp(pointerId = 1) {
  fireEvent(window, pointerEvent("pointerup", pointerId));
}
function pointerCancel(pointerId = 1) {
  fireEvent(window, pointerEvent("pointercancel", pointerId));
}

describe("BezierEditor", () => {
  it("renders an svg with the given dimensions", () => {
    const { container } = render(<BezierEditor width={200} height={150} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("width")).toBe("200");
    expect(svg!.getAttribute("height")).toBe("150");
  });

  it("renders two draggable handles", () => {
    const { container } = render(<BezierEditor />);
    expect(getHandles(container)).toHaveLength(2);
  });

  it("renders no handles in readOnly mode", () => {
    const { container } = render(<BezierEditor readOnly />);
    expect(getHandles(container)).toHaveLength(0);
  });

  it("renders the curve from the controlled value", () => {
    const value: BezierValue = [0, 1, 1, 0];
    const { container } = render(
      <BezierEditor value={value} width={300} height={300} />
    );
    const paths = Array.from(container.querySelectorAll("path"));
    const curve = paths.find((p) => p.getAttribute("d")?.includes("C"));
    expect(curve).toBeDefined();
    expect(curve!.getAttribute("d")).toContain("C18,25");
  });

  it("renders children inside the svg", () => {
    const { container } = render(
      <BezierEditor>
        <text data-testid="label">hello</text>
      </BezierEditor>
    );
    expect(container.querySelector("svg [data-testid=label]")).not.toBeNull();
  });

  it("renders a progress path when progress is set", () => {
    const { container, rerender } = render(<BezierEditor progress={0} />);
    const countPaths = () => container.querySelectorAll("path").length;
    const withoutProgress = countPaths();
    rerender(<BezierEditor progress={0.5} />);
    expect(countPaths()).toBe(withoutProgress + 1);
  });

  it("calls onChange with a new value when dragging a handle", () => {
    const onChange = vi.fn();
    const value: BezierValue = [0.25, 0.25, 0.75, 0.75];
    const { container } = render(
      <BezierEditor value={value} onChange={onChange} />
    );
    const [handle1] = getHandles(container);
    pointerDown(handle1);
    pointerMove(100, 100);
    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as BezierValue;
    expect(next).toHaveLength(4);
    expect(next[2]).toBe(0.75);
    expect(next[3]).toBe(0.75);
    expect(next[0]).toBeGreaterThanOrEqual(0);
    expect(next[0]).toBeLessThanOrEqual(1);
    expect(value).toEqual([0.25, 0.25, 0.75, 0.75]);
    pointerUp();
  });

  it("stops emitting changes after pointer up", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BezierEditor value={[0.25, 0.25, 0.75, 0.75]} onChange={onChange} />
    );
    const [, handle2] = getHandles(container);
    pointerDown(handle2);
    pointerMove(50, 50);
    pointerUp();
    onChange.mockClear();
    pointerMove(80, 80);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("works uncontrolled with defaultValue and updates its own curve", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BezierEditor defaultValue={[0.25, 0.25, 0.75, 0.75]} onChange={onChange} />
    );
    const curveD = () =>
      Array.from(container.querySelectorAll("path"))
        .find((p) => p.getAttribute("d")?.includes("C"))!
        .getAttribute("d");
    const before = curveD();
    const [handle1] = getHandles(container);
    pointerDown(handle1);
    pointerMove(200, 200);
    pointerUp();
    expect(onChange).toHaveBeenCalled();
    expect(curveD()).not.toBe(before);
  });

  it("supports touch: drags via touch pointer events on the enlarged hit area", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BezierEditor value={[0.25, 0.25, 0.75, 0.75]} onChange={onChange} />
    );
    const [handle1] = getHandles(container);
    expect(Number(handle1.getAttribute("r"))).toBeGreaterThanOrEqual(22);
    expect(handle1.style.touchAction).toBe("none");
    // touches starting on the handle must not scroll the page: the native
    // non-passive touchstart listener prevents the default action
    const touchStart = new Event("touchstart", {
      bubbles: true,
      cancelable: true,
    });
    handle1.dispatchEvent(touchStart);
    expect(touchStart.defaultPrevented).toBe(true);
    pointerDown(handle1);
    pointerMove(120, 80);
    expect(onChange).toHaveBeenCalledTimes(1);
    pointerCancel();
    onChange.mockClear();
    pointerMove(140, 90);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports multi-touch: two fingers drag the two handles simultaneously", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BezierEditor
        defaultValue={[0.25, 0.25, 0.75, 0.75]}
        onChange={onChange}
      />
    );
    const [handle1, handle2] = getHandles(container);
    pointerDown(handle1, 1);
    pointerDown(handle2, 2);
    pointerMove(60, 250, 1);
    pointerMove(250, 60, 2);
    const last = onChange.mock.calls.at(-1)![0] as BezierValue;
    expect(last[0]).not.toBe(0.25);
    expect(last[2]).not.toBe(0.75);
    pointerUp(1);
    onChange.mockClear();
    pointerMove(80, 220, 1);
    expect(onChange).not.toHaveBeenCalled();
    pointerMove(240, 70, 2);
    expect(onChange).toHaveBeenCalled();
    pointerUp(2);
  });

  it("ignores a second pointer grabbing an already-dragged handle", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BezierEditor value={[0.25, 0.25, 0.75, 0.75]} onChange={onChange} />
    );
    const [handle1] = getHandles(container);
    pointerDown(handle1, 1);
    pointerDown(handle1, 2);
    pointerMove(100, 100, 2);
    expect(onChange).not.toHaveBeenCalled();
    pointerMove(100, 100, 1);
    expect(onChange).toHaveBeenCalledTimes(1);
    pointerUp(1);
    pointerUp(2);
  });

  it("does not respond to pointer events in readOnly mode", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BezierEditor value={[0.25, 0.25, 0.75, 0.75]} onChange={onChange} readOnly />
    );
    pointerMove(100, 100);
    expect(onChange).not.toHaveBeenCalled();
    expect(getHandles(container)).toHaveLength(0);
  });
});
