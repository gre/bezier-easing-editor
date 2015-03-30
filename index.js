import BezierEditor from "./src/BezierEditor";
import uncontrollable from "./src/uncontrollable";

export default uncontrollable(BezierEditor, {
  value: "onChange"
});
