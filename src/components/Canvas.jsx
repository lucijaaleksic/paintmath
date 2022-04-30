import React from "react";

import Path from "../models/Path";
import { canvasStyle } from "../style/Styles";

export default function Canvas({
  contextRef,
  canvasRef,
  setPaths,
  paths,
  setCheck,
  check,
}) {
  const [drawing, setDrawing] = React.useState(false);
  const path = new Path2D();
  let maxX = 0,
    maxY = 0,
    minX = window.innerWidth,
    minY = window.innerHeight;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  /**
   * Begin a path at current coordinates
   */
  function startDrawing({ nativeEvent }) {
    const x = nativeEvent.offsetX
      ? nativeEvent.offsetX
      : nativeEvent.changedTouches[0].clientX;
    const y = nativeEvent.offsetY
      ? nativeEvent.offsetY
      : nativeEvent.changedTouches[0].clientY;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    path.moveTo(x, y);
    setDrawing(true);
  }

  /**
   * Add important paths to global paths
   */
  function finishDrawing() {
    contextRef.current.closePath();
    path.closePath();
    setDrawing(false);
    const id = paths[paths.length - 1] ? paths[paths.length - 1].id + 1 : 0;
    const pathObj = new Path(id, path, minX, maxX, minY, maxY);
    if (pathObj.insignificant()) return; // ignore unimportant paths
    setPaths([...paths, pathObj]);
    maxX = 0;
    maxY = 0;
    minX = window.innerWidth;
    minY = window.innerHeight;
    setCheck(++check);
  }

  /**
   * Continuously update path and context while drawing
   */
  function draw({ nativeEvent }) {
    if (!drawing) {
      return;
    }
    const x = nativeEvent.offsetX
      ? nativeEvent.offsetX
      : nativeEvent.changedTouches[0].clientX;
    const y = nativeEvent.offsetY
      ? nativeEvent.offsetY
      : nativeEvent.changedTouches[0].clientY;
    contextRef.current.lineTo(x, y);
    path.lineTo(x, y);
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    contextRef.current.stroke();
  }

  return (
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onTouchStart={startDrawing}
      onTouchEnd={finishDrawing}
      onTouchMove={draw}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight * 0.9}
      style={canvasStyle}
    />
  );
}
