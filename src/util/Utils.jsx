/**
 * Remove excess operators from input
 * @param {String} input Input to clean up
 */
export function cleanUp(input) {
  const operators = "+-*/";
  while (operators.includes(input[0])) input = input.substr(1); // operatori s kraja
  while (operators.includes(input[input.length - 1]))
    input = input.substr(0, input.length - 1);
  let operator = "";
  let result = "";
  for (let i = 0; i < input.length; ++i) {
    if (operators.includes(input.charAt(i))) {
      if (operator === "") {
        operator = input.charAt(i);
        result += input.charAt(i);
      } else {
        console.log("repeated " + operator);
        input = input
          .split("")
          .splice(i - 1)
          .join("");
        console.log(input);
      }
    } else {
      operator = "";
      result += input.charAt(i);
    }
  }
  return result;
}

/**
 * Draw bounding boxes around all operands
 * @param {Path[]} paths Paths of operands
 * @param {object} context Reference to context
 */
export function drawBoundingBoxes(paths, context) {
  paths.forEach((pp) => {
    context.beginPath();
    context.lineWidth = 0.7;
    context.strokeStyle = "red";
    context.moveTo(pp.minX, pp.minY);
    context.lineTo(pp.minX, pp.maxY);
    context.stroke();
    context.lineTo(pp.maxX, pp.maxY);
    context.stroke();
    context.lineTo(pp.maxX, pp.minY);
    context.stroke();
    context.lineTo(pp.minX, pp.minY);
    context.stroke();
    context.strokeStyle = "black";
    context.closePath();
  });
}

/**
 * Convert path to bytes
 * @param {Path} path Path to convert
 * @param {object} context Reference to context
 */
export function convertPathToImageBytes(path, context) {
  const tmpCanvas = document.createElement("CANVAS");
  const tempCtx = tmpCanvas.getContext("2d");

  const data = context.getImageData(
    path.minX,
    path.minY,
    path.maxX - path.minX,
    path.maxY - path.minY
  );
  tmpCanvas.height = path.maxY - path.minY;
  tmpCanvas.width = path.maxX - path.minX;

  tempCtx.putImageData(data, 0, 0); // dodamo sliku i iza pozadinu
  tempCtx.globalCompositeOperation = "destination-over";
  tempCtx.fillStyle = "#FFFFFF";
  tempCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  const dataURL = tmpCanvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

/**
 * Evaluate expression to get a result
 * @param {String} expression Expression to evaluate
 */
export function evaluate(expression) {
  let operators = "-+/*";
  for (let i = 0; i < 4; i++) {
    let op = operators.charAt(i);
    let pos = expression.indexOf(op);
    if (pos > 0 && operators.indexOf(expression.charAt(pos - 1)) === -1) {
      let left = evaluate(expression.substr(0, pos));
      let right = evaluate(expression.substr(pos + 1));
      switch (op) {
        case "/":
          return left / right;
        case "*":
          return left * right;
        case "-":
          return left - right;
        case "+":
          return left + right;
        default:
          return;
      }
    }
  }
  return Number(expression);
}
