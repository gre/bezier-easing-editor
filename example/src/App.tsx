import { useEffect, useState } from "react";
import BezierEditor, { type BezierValue } from "bezier-easing-editor";

const homepage = "https://github.com/gre/bezier-easing-editor";

function useAnimationProgress(durationMs: number): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let id: number;
    const loop = (t: number) => {
      id = requestAnimationFrame(loop);
      setProgress((t / durationMs) % 1);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [durationMs]);
  return progress;
}

export default function App() {
  const [value, setValue] = useState<BezierValue>(() => [
    Math.random() / 2,
    Math.random() / 2,
    (1 + Math.random()) / 2,
    (1 + Math.random()) / 2,
  ]);
  const progress = useAnimationProgress(2000);

  return (
    <div>
      <h1>
        <a href={homepage}>bezier-easing-editor</a>
      </h1>

      <h2>Cubic Bezier Curve editor made with React &amp; SVG</h2>

      <blockquote>
        The value is initialized to a random easing. The controlled component
        will track that value. The uncontrolled component will only be
        initialized to that value.
      </blockquote>

      <h3>
        controlled value:&nbsp;
        <code>{value.map((v) => v.toFixed(2)).join(", ")}</code>
        <br />
        progress:&nbsp;
        <code>{progress.toFixed(2).substring(2, 4)}%</code>
      </h3>

      <BezierEditor
        className="bezier"
        value={value}
        onChange={setValue}
        progress={progress}
        handleStroke={3}
        handleRadius={6}
        curveWidth={3}
      >
        <text x={0} y={16} fill="#f00">
          Controlled Bezier Editor
        </text>
      </BezierEditor>

      <BezierEditor
        className="bezier"
        defaultValue={value}
        onChange={setValue}
        progress={progress}
        curveColor="#0af"
        gridColor="#eee"
        handleColor="#000"
        progressColor="#0af"
        textStyle={{ fill: "#9df" }}
        padding={[50, 50, 50, 50]}
      >
        <text x={0} y={16} fill="#0af">
          Uncontrolled Bezier Editor
        </text>
      </BezierEditor>

      <br />

      <BezierEditor
        className="bezier"
        value={value}
        progress={progress}
        width={200}
        height={200}
        progressColor="#0af"
        curveColor="#0af"
        readOnly
      >
        <text x={0} y={16} fill="#0af">
          Read-Only
        </text>
      </BezierEditor>

      <BezierEditor
        className="bezier"
        value={value}
        width={200}
        height={200}
        readOnly
      >
        <text x={0} y={16} fill="#000">
          Read-Only, no progress
        </text>
      </BezierEditor>

      <BezierEditor
        className="bezier"
        value={value}
        onChange={setValue}
        progress={progress}
        width={200}
        height={200}
        background="#777"
        gridColor="#666"
        progressColor="#555"
        curveColor="#fc5"
        handleColor="#000"
        textStyle={{
          fontFamily: "monospace",
          fontSize: "9px",
          fill: "#222",
        }}
      >
        <text x={50} y={16} fill="#fc5">
          different styles
        </text>
      </BezierEditor>

      <p>
        <a
          target="_blank"
          rel="noreferrer"
          href={homepage + "/blob/master/example/src/App.tsx"}
        >
          Source code of these examples.
        </a>
      </p>
    </div>
  );
}
