import React, { Component } from "react";
import raf from "raf";
import BezierEditor from "bezier-easing-editor";
import libPackage from "bezier-easing-editor/package.json";

class App extends Component {
  state = {
    value: [ Math.random()/2, Math.random()/2, (1+Math.random())/2, (1+Math.random())/2 ],
    progress: 0
  };

  componentDidMount() {
    const loop = (t) => {
      this._loopId = raf(loop);
      this.setState({
        progress: (t/2000) % 1
      });
    };
    this._loopId = raf(loop);
  }

  componentWillUnmount() {
    raf.cancel(this._loopId);
  }

  onChange = (value) => {
    this.setState({ value });
  }

  render() {
    var {
      value,
      progress
    } = this.state;
    return <div>
      <h1>
        <a href={libPackage.homepage}>{libPackage.name}</a>
      </h1>

      <h2>Cubic Bezier Curve editor made with React & SVG</h2>

      <blockquote>
        The value is initialized to a random easing.
        The controlled component will track that value.
        The uncontrolled component will only be initialized to that value.
      </blockquote>

      <h3>
        controlled value:&nbsp;
        <code>{this.state.value.map(function(v){ return v.toFixed(2); }).join(", ")}</code><br/>
        progress:&nbsp;
        <code>{this.state.progress.toFixed(2).substring(2, 4)}%</code>
      </h3>

      <BezierEditor
        className="bezier"
        value={value}
        onChange={this.onChange}
        progress={progress}
        handleStroke={3}
        handleRadius={6}
        curveWidth={3}
      >
        <text x={0} y={16} fill="#f00">Controlled Bezier Editor</text>
      </BezierEditor>

      <BezierEditor
        className="bezier"
        defaultValue={value}
        onChange={this.onChange}
        progress={progress}
        curveColor="#0af"
        gridColor="#eee"
        handleColor="#000"
        progressColor="#0af"
        textStyle={{
          fill: "#9df"
        }}
        padding={[ 50, 50, 50, 50]}
      >
      <text x={0} y={16} fill="#0af">Uncontrolled Bezier Editor</text>
    </BezierEditor>

    <br />

    <BezierEditor
      className="bezier"
      value={value}
      onChange={this.onChange}
      progress={progress}
      width={200}
      height={200}
      progressColor="#0af"
      curveColor="#0af"
      readOnly>
      <text x={0} y={16} fill="#0af">Read-Only</text>
    </BezierEditor>


    <BezierEditor
      className="bezier"
      value={value}
      onChange={this.onChange}
      width={200}
      height={200}
      readOnly>
      <text x={0} y={16} fill="#000">Read-Only, no progress</text>
    </BezierEditor>


    <BezierEditor
      className="bezier"
      value={value}
      onChange={this.onChange}
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
        fill: "#222"
      }}>
      <text x={50} y={16} fill="#fc5">different styles</text>
    </BezierEditor>

    <p>
      <a target="_blank" href={libPackage.homepage+"/blob/master/example/index.js"}>Source code of these examples.</a>
    </p>

    </div>;
  }
}

export default App;
