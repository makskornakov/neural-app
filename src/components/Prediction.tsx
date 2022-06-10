import { useCallback, useEffect, useRef } from 'react';

import { circle } from '../functions/canvas';
import { getRandomElementOfArray } from '../functions/utils';

import { Canvas, Button } from '../App.styled';
import { trainingData, network } from '../global';
import type { TrainingSample } from '../types';
import { useCanvasContext } from '../hooks/useCanvasContext';
import { useLocalStorage } from 'usehooks-ts';

const canvasWidth = 400;

const amountOfCirclesToDraw = 1000;
const multiplier = 5;

const colorA = 'cyan';
const colorB = '#121213';

function trainMore() {
  const numberOfIterations = trainingData.length * multiplier;

  for (var i = 0; i < numberOfIterations; i++) {
    const trainingItem = getRandomElementOfArray(trainingData);
    network.train(trainingItem.input, trainingItem.output);
  }
}

function activateMatrixPoints(ctx: CanvasRenderingContext2D) {
  for (var i = 1; i < canvasWidth / 10; i++) {
    for (var ii = 1; ii < canvasWidth / 10; ii++) {
      const x = (i * 10) / canvasWidth;
      const y = (ii * 10) / canvasWidth;

      const input = [x, y];
      network.activate(input);
      const result: TrainingSample['output'] = network.run();

      const color = result[1] > result[0] ? colorA : colorB;
      const cords = [x * canvasWidth, y * canvasWidth];

      ctx.beginPath();
      circle(ctx, cords[0], cords[1], 2);
      ctx.fillStyle = color;
      ctx.closePath();
      ctx.fill();
    }
  }

  return ctx;
}

function activateRandomPoints(ctx: CanvasRenderingContext2D) {
  for (var i = 0; i < amountOfCirclesToDraw; i++) {
    const x = Math.random();
    const y = Math.random();
    const input = [x, y];
    network.activate(input);
    const result: TrainingSample['output'] = network.run();

    const color = result[1] > result[0] ? colorA : colorB;
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
  const [ctx, setCtx] = useCanvasContext(canvasRef);

  const drawPredictions = useCallback(() => {
    if (!ctx) return;

    // setCtx(activateRandomPoints(ctx));
    setCtx(activateMatrixPoints(ctx));
  }, [ctx, setCtx]);

  const [trainingInterval, setTrainingInterval] = useLocalStorage<
    number | undefined
  >('trainingInterval', 1000);
  const [drawingInterval, setDrawingInterval] = useLocalStorage<
    number | undefined
  >('drawingInterval', 10);

  useEffect(() => {
    if (!trainingInterval) return;

    const interval = setInterval(() => {
      trainMore();
    }, trainingInterval);

    return () => clearInterval(interval);
  }, [trainingInterval]);
  useEffect(() => {
    if (!drawingInterval) return;

    const interval = setInterval(() => {
      requestAnimationFrame(drawPredictions);
    }, drawingInterval);

    return () => clearInterval(interval);
  }, [drawPredictions, drawingInterval]);

  const [shouldUsePostProcessing, setShouldUsePostProcessing] = useLocalStorage(
    'shouldUsePostProcessing',
    true
  );
  function cleanNetwork() {
    // network.cleanMe();
  }
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div>Prediction</div>
      <div>
        <Button type="button" onClick={trainMore}>
          Train more
        </Button>
        <input
          placeholder="Training interval (ms)"
          value={trainingInterval}
          onChange={(e) => setTrainingInterval(Number(e.target.value))}
        />
      </div>
      <div>
        <Button type="button" onClick={drawPredictions}>
          Draw predictions
        </Button>
        <input
          placeholder="Drawing interval (ms)"
          value={drawingInterval}
          onChange={(e) => setDrawingInterval(Number(e.target.value))}
        />
      </div>
      <Canvas
        style={
          shouldUsePostProcessing
            ? {
                overflow: 'hidden',
                zIndex: -1,
                clipPath: 'border-box',
                filter: 'blur(5px) contrast(7)',
              }
            : undefined
        }
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
      <label>
        <input
          type="checkbox"
          checked={shouldUsePostProcessing}
          onChange={() => {
            setShouldUsePostProcessing(!shouldUsePostProcessing);
          }}
        />
        Use post-processing
      </label>
      <Button type="button" onClick={cleanNetwork}>
        De learn
      </Button>
    </div>
  );
}
export default Prediction;
