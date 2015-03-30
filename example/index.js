import React from "react/addons";
import BezierEditor from "..";
import libPackage from "../package.json";
import raf from "raf";

window.Perf = React.addons.Perf;

const linkStyle = {
  color: "#3c6",
  textDecoration: "none"
};

const bezierStyle = {
  display: "inline-block",
  margin: "5px"
};

class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [ Math.random()/2, Math.random()/2, (1+Math.random())/2, (1+Math.random())/2 ],
      progress: 0
    };
    this.onChange = this.onChange.bind(this);

    const loop = (t) => {
      raf(loop);
      this.setState({
        progress: (t/2000) % 1
      });
    };
    raf(loop);
  }

  onChange(value) {
    this.setState({ value });
  }

  render() {
    var {
      value,
      progress
    } = this.state;
    return <div>
      <h1>
        <a href={libPackage.homepage} style={linkStyle}>{libPackage.name}</a>
      </h1>

      <h2 style={{ color: "#aaa", fontWeight: "normal" }}>Cubic Bezier Curve editor made with React & SVG</h2>

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
        value={value}
        onChange={this.onChange}
        style={bezierStyle}
        progress={progress}
        handleStroke={3}
        handleRadius={6}
        curveWidth={3}
      >
        <text x={0} y={16} fill="#f00">Controlled Bezier Editor</text>
      </BezierEditor>

      <BezierEditor
        defaultValue={value}
        onChange={this.onChange}
        style={bezierStyle}
        progress={progress}
        curveColor="#0cc"
        gridColor="#dee"
        color="#33a"
        handleColor="#33a"
        progressColor="#0cc"
        padding={[ 50, 50, 50, 50]}
      >
      <text x={0} y={16} fill="#33a">Uncontrolled Bezier Editor</text>
    </BezierEditor>

    <br />

    <BezierEditor
      style={bezierStyle}
      value={value}
      onChange={this.onChange}
      progress={progress}
      width={200}
      height={200}
      progressColor="#fa0"
      readOnly>
      <text x={0} y={16} fill="#fa0">Read-Only</text>
    </BezierEditor>


    <BezierEditor
      style={bezierStyle}
      value={value}
      onChange={this.onChange}
      width={200}
      height={200}
      readOnly>
      <text x={0} y={16} fill="#fa0">Read-Only, no progress</text>
    </BezierEditor>


    <BezierEditor
      style={bezierStyle}
      value={value}
      onChange={this.onChange}
      progress={progress}
      width={200}
      height={200}
      background="#888"
      color="#fff"
      gridColor="#777"
      curveColor="#0ff"
      progressColor="#666"
      handleColor="#000"
      textStyle={{
        fontFamily: "monospace",
        fontSize: "9px",
        fill: "#000"
      }}>
      <text x={50} y={16} fill="#0ff">different styles</text>
    </BezierEditor>

    <p>
      <a style={linkStyle} target="_blank" href={libPackage.homepage+"/blob/master/example/index.js"}>Source code of these examples.</a>
    </p>

    </div>;
  }
}

document.body.style.padding = "0px 20px";
document.body.style.color = "#333";
document.body.style.background = "#eee";
document.body.style.fontFamily = "sans-serif";
React.render(<Example />, document.body);
