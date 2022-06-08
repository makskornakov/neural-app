import { useRef, useState, useEffect } from 'react';

import { circle } from '../functions/canvas';

import { Canvas } from '../App.styled';
import { trainingData, network } from '../global';
import type { TrainingSample } from '../types';

const canvasWidth = 400;
const trainingLength = trainingData.length;

const amountOfCirclesToDraw = 1000;

const numberOfIterations = trainingLength * 50; // numberOfRightGuessExamples * 50

function trainMore() {
  for (var i = 0; i < numberOfIterations; i++) {
    // Get a random training sample
    const trainingItem = trainingData[Math.floor(Math.random() * trainingData.length)];
    network.train(trainingItem.input, trainingItem.output);
  }
}
function activateRandomPoints(ctx: CanvasRenderingContext2D) {
  for (var i = 0; i < amountOfCirclesToDraw; i++) {
    const x = Math.random();
    const y = Math.random();
    const input = [x, y];
    network.activate(input);
    const result: TrainingSample['output'] = network.run();

    const color = result[0] > result[1] ? 'red' : 'blue';
    const cords = [x * canvasWidth, y * canvasWidth];

    ctx.beginPath();
    circle(ctx, cords[0], cords[1], 2);
    ctx.fillStyle = color;
    ctx.closePath();
    ctx.fill();
  }

  return ctx;
}

function Prediction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  useEffect(() => {
    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext('2d')!);
  }, [canvasRef]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>Prediction</div>
      <button type="button" onClick={trainMore}>
        Train more
      </button>
      <button
        type="button"
        onClick={() => {
          if (!ctx) return;

          console.log(network);
          setCtx(activateRandomPoints(ctx));
        }}
      >
        Draw predictions
      </button>
      <Canvas
        onClick={(event) => {
          if (!ctx) return;

          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          console.log(ctx.isPointInPath(x, y));
        }}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasWidth}
      />
    </div>
  );
}
export default Prediction;
