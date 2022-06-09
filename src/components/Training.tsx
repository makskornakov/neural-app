import { useCallback, useRef } from 'react';
import {useLocalStorage} from 'usehooks-ts';

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
  return ctx;
}

function Training() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useCanvasContext(canvasRef);

  const [shouldAddExamplesOnDraw, setShouldAddExamplesOnDraw] = useLocalStorage('shouldAddExamplesOnDraw', true);

  const addExamples = useCallback(() => {
    if (!ctx) return;

    generateTrainingData(ctx);
    setCtx(displayTrainees(
      trainingData,
      ctx,
    ));
  }, [ctx, setCtx]);

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

          if (shouldAddExamplesOnDraw) addExamples();
        }}
      >
        Draw {shapeName}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>Training</div>
      <div>
        <button
          type="button"
          onClick={addExamples}
        >
          Add more right examples for training
        </button>
      <label>
        <input type="checkbox" checked={shouldAddExamplesOnDraw} onChange={() => {
          setShouldAddExamplesOnDraw(!shouldAddExamplesOnDraw);
        }} />
        Sample on draw
      </label>
      </div>
      <div>
        <ButtonToDrawShape
          shapeName="ellipse"
          drawingFunc={(localCtx) => localCtx.ellipse(200, 200, 100, 100, 0, 0, 2 * Math.PI)}
        />
        <ButtonToDrawShape shapeName="cross" drawingFunc={(localCtx) => {
          localCtx.rect(165, 50, 70, 300);
          localCtx.rect(50, 165, 300, 70);
        }}/>
        <ButtonToDrawShape shapeName="triangle" drawingFunc={(localCtx) => {
          localCtx.moveTo(200, 100);
          localCtx.lineTo(100, 300);
          localCtx.lineTo(300, 300);
          localCtx.lineTo(200, 100);
        }} />
        <ButtonToDrawShape shapeName="rect" drawingFunc={(localCtx) => localCtx.rect(100, 100, 200, 200)} />
        <ButtonToDrawShape shapeName="pinus" drawingFunc={(localCtx) => {
          // ball 0
          localCtx.moveTo(100 + 70, 300);
          circle(localCtx, 100, 300, 70);

          // ball 2
          localCtx.moveTo(300 + 70, 300);
          circle(localCtx, 300, 300, 70);

          // stvol
          localCtx.moveTo(240, 200);
          localCtx.ellipse(200, 200, 40, 150, 0, 0, 2 * Math.PI);
        }} />
      </div>
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
