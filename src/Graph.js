import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { canvasOptions, preOptions } from "./options/canvasOptions";

const Wrapper = styled.div`
  width: 50vw;
  height: 50vh;
  ${Line} {
    transform: translate(50%, 50%);
  }
`;

const canvas = document.createElement("canvas");

const data = (canvas, meta, setGraphOpts) => {
  const ctx = canvas.getContext("2d");
  const length = meta.dataset._children.length;
  const startX = meta.dataset._children[0]._model.x;
  const endX = meta.dataset._children[length - 1]._model.x;
  const graphLength = endX - startX;

  const gradientStroke = ctx.createLinearGradient(startX, 0, endX, 0);
  const colors = ["#666666", "#999999"];

  for (let i = 1; i < length; i++) {
    const xPos = (meta.dataset._children[i]._model.x - startX) / graphLength;
    const xPos2 =
      (meta.dataset._children[i - 1]._model.x - startX) / graphLength;
    gradientStroke.addColorStop(xPos, colors[i % 2]);
    gradientStroke.addColorStop(xPos2, colors[i % 2]);
  }
  setGraphOpts(canvasOptions(gradientStroke));
};

const Graph = () => {
  const [graphOpts, setGraphOpts] = useState(preOptions);
  const secondLineRef = React.useRef();
  //   const meta = lineref.chartInstance.getDatasetMeta(0);

  React.useEffect(() => {
    const meta = secondLineRef.current.chartInstance.getDatasetMeta(0);
    const resizeFunc = () => {
      data(canvas, meta, setGraphOpts);
    };
    resizeFunc();
    window.addEventListener("resize", resizeFunc);

    return () => window.removeEventListener("resize", resizeFunc);
  }, []);

  return (
    <Wrapper>
      <Line ref={secondLineRef} {...graphOpts} />
    </Wrapper>
  );
};

export default Graph;
