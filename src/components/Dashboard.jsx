import React from "react";

import { Fab } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import ClearIcon from "@mui/icons-material/Clear";
import { QuestionMark } from "@mui/icons-material";

import Canvas from "./Canvas";
import ResultDialog from "./ResultDialog";
import HowToDialog from "./HowToDialog";
import {
  cleanUp,
  convertPathToImageBytes,
  drawBoundingBoxes,
} from "../util/Utils";
import { dashboardFabsStyle } from "../style/Styles";
const api = "https://paintmath-backend.herokuapp.com/"

export default function Dashboard() {
  const [paths, setPaths] = React.useState([]);
  const [check, setCheck] = React.useState(0);
  const [openResult, setOpenResult] = React.useState(false);
  const [openHelp, setOpenHelp] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [boundingBoxes, setBoundingBoxes] = React.useState(false);
  let operators = new Map();

  const contextRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const id = paths[paths.length - 1] ? paths[paths.length - 1].id : 0;
    async function intersections() {
      if (id > 0 && paths.length > 1)
        return await checkIntersection(paths.filter((p) => p.id === id)[0]);
    }
    intersections().then(() => {}); // weird syntax to avoid making useEffect async
  }, [check]);

  React.useEffect(() => {
    drawBoundingBoxes(paths, contextRef.current);
  }, [boundingBoxes]);

  /**
   * Sort paths from left to right
   * @param {Path[]} paths Paths to be sorted
   */
  function sortPaths(paths) {
    setPaths(
      paths.sort((a, b) => {
        if (a.minX < b.minX) return -1;
        if (a.minX > b.minX) return 1;
        return 0;
      })
    );
  }

  /**
   * Remove selected path from global paths
   * @param {int} id Id of the path to be removed
   */
  function removePath(id) {
    const pathsCopy = paths;
    setPaths([
      ...pathsCopy.splice(0, id),
      ...pathsCopy.splice(1, pathsCopy.length - 1),
    ]);
  }

  /**
   * Check intersection between selected path and the rest
   * @param {Path} path Path to be checked for intersection
   */
  async function checkIntersection(path) {
    for (let i = 0; i < paths.length - 1; ++i) {
      if (path.id === paths[i].id) break;
      if (path.intersectsWith(paths[i])) {
        path.addOther(paths[i]);
        path.normalizeBox();
        removePath(i);
      }
    }
  }

  /**
   * Add operator with its index to global operators
   * @param {int} index Operators' index
   * @param {String} class_name Operators' class name
   */
  async function addOperator(index, class_name) {
    operators.set(index, class_name);
  }

  /**
   * Fetch a POST request to predict endpoint
   * @param {int} index Operators' index
   * @param {Object} payload Object containing image bytes
   */
  function fetchPrediction(index, payload) {
    fetch(api + "/predict", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await addOperator(index, data.class_name);
        await new Promise((resolve) => setTimeout(resolve, 200));
      })
      .then(() => {
        if (index === paths.length - 1) {
          const newOp = new Map([...operators].sort());
          let inp = "";
          newOp.forEach((i) => (inp += i));
          setInput(cleanUp(inp));
        }
      });
  }

  /**
   * Calculate expression
   */
  function calculate() {
    sortPaths(paths);
    setOpenResult(true);

    for (let i = 0; i < paths.length; ++i) {
      const path = paths[i];
      const canvasBytes = convertPathToImageBytes(path, contextRef.current);
      const payload = { image: canvasBytes };

      fetchPrediction(i, payload);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <HowToDialog />
      <Canvas
        contextRef={contextRef}
        canvasRef={canvasRef}
        setPaths={setPaths}
        paths={paths}
        setCheck={setCheck}
        check={check}
      />
      <div
        style={
          window.innerWidth > 760
            ? dashboardFabsStyle
            : {
                ...dashboardFabsStyle,
                justifyContent: "space-between",
              }
        }
      >
        <Fab
          variant="extended"
          color="primary"
          onClick={calculate}
          sx={{ mr: 0.5, fontSize: 12 }}
          disabled={paths.length === 0}
        >
          <CalculateIcon sx={{ mr: 1 }} />
          Calculate
        </Fab>
        <Fab
          variant="extended"
          color="secondary"
          onClick={() => window.location.reload()}
          sx={{ mr: 0.5, fontSize: 12 }}
          disabled={paths.length === 0}
        >
          <ClearIcon sx={{ mr: 1 }} />
          Clear
        </Fab>
        <Fab
          onClick={() => setOpenHelp(true)}
          variant="extended"
          color="success"
          sx={{ mr: 0.5, fontSize: 12 }}
        >
          <QuestionMark sx={{ mr: 1 }} />
          Help
        </Fab>
      </div>
      <ResultDialog
        open={openResult}
        setOpen={setOpenResult}
        input={input}
        setBoundingBoxes={setBoundingBoxes}
      />
      <HowToDialog open={openHelp} setOpen={setOpenHelp} />
    </div>
  );
}
