import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { canvasOptions, preOptions } from "./options/canvasOptions";

const Wrapper = styled.div`
  width: 50vw;
  height: 50vh;
`;

// Configuration options go her
const data = (canvas, meta) => {
  const ctx = canvas.getContext("2d");
  const length = meta.dataset._children.length;
  const startX = meta.dataset._children[0]._model.x;
  const endX = meta.dataset._children[length - 1]._model.x;
  const graphLength = endX - startX;

  const gradientStroke = ctx.createLinearGradient(
    meta.dataset._children[0]._model.x,
    0,
    meta.dataset._children[length - 1]._model.x,
    0
  );
  const colors = ["#666666", "#999999"];

  for (let i = 0; i < length; i++) {
    const xPos = (meta.dataset._children[i]._model.x - startX) / graphLength;
    if (i === 0) {
      gradientStroke.addColorStop(0, colors[i % 2]);
      gradientStroke.addColorStop(xPos, colors[i % 2]);
    } else {
      const xPos2 =
        (meta.dataset._children[i - 1]._model.x - startX) / graphLength;
      gradientStroke.addColorStop(xPos, colors[i % 2]);
      gradientStroke.addColorStop(xPos2, colors[i % 2]);
    }
  }
  const options = canvasOptions(gradientStroke);
  console.log(options);
  return options;
};

function Graph() {
  const [graphOpts, setGraphOpts] = useState(preOptions);
  let lineref;
  let canvas;
  let meta;
  let chartProps;
  //   const meta = lineref.chartInstance.getDatasetMeta(0);

  React.useEffect(() => {
    meta = lineref.chartInstance.getDatasetMeta(0);
    canvas = document.createElement("canvas");
    chartProps = data(canvas, meta);
    setGraphOpts(chartProps);
  }, []);

  return (
    <Wrapper>
      <Line ref={ref => (lineref = ref)} {...graphOpts} />
    </Wrapper>
  );
}

export default Graph;
