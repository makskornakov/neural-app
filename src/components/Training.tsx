import { useRef } from 'react';

import { circle } from '../functions/canvas';

import { trainingData } from '../global';
import { Vector2 } from '../types';
import { Canvas } from '../App.styled';
import { useCanvasContext } from '../hooks/useCanvasContext';

const canvasWidth = 400;
const numberOfRightGuessExamples = 1000;

function generateTrainingData(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < numberOfRightGuessExamples; i++) {
    const input: Vector2 = [Math.random(), Math.random()];
    const coords = input.map((point) => point * canvasWidth) as Vector2;
    trainingData.push({
      input,
      output: ctx.isPointInPath(...coords) ? [0, 1] : [1, 0],
    });
  }
}

function displayTrainees(
  trainArr: typeof trainingData,
  ctx: CanvasRenderingContext2D,
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D>>,
) {
  trainArr.forEach((el) => {
    const cords = {
      x: el.input[0] * canvasWidth,
      y: el.input[1] * canvasWidth,
    };
    const pointIsInShape = el.output[0] < el.output[1];
    const color = pointIsInShape ? 'cyan' : 'magenta';

    ctx.beginPath();
    ctx.fillStyle = color;
    circle(ctx, cords.x, cords.y, 2);
    ctx.closePath();
    ctx.fill();
  });
  setCtx(ctx);
}

function Training() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useCanvasContext(canvasRef);

  function ButtonToDrawShape({
    shapeName,
    drawingFunc,
  }: {
    shapeName: string;
    drawingFunc: (localCtx: CanvasRenderingContext2D) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => {
          if (!ctx) return;

          ctx.beginPath();
          drawingFunc(ctx);
          ctx.closePath();

          ctx.stroke();

          setCtx(ctx);
        }}
      >
        Draw {shapeName}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>Training</div>
      <button
        type="button"
        onClick={() => {
          if (!ctx) return;

          generateTrainingData(ctx);
          console.log(trainingData);
          displayTrainees(
            trainingData,
            ctx,
            setCtx as React.Dispatch<React.SetStateAction<CanvasRenderingContext2D>>,
          );
        }}
      >
        Add more right examples for training
      </button>
      <ButtonToDrawShape
        shapeName="ellipse"
        drawingFunc={(localCtx) => localCtx.ellipse(200, 200, 100, 100, 0, 0, 2 * Math.PI)}
      />
      <ButtonToDrawShape shapeName="rect" drawingFunc={(localCtx) => localCtx.rect(100, 100, 200, 200)} />
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
export default Training;
