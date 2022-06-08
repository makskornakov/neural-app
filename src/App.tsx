import { MainContainer, Canvas } from './App.styled';
import React, { useState } from "react";

const canvasWidth = 400;
const trainingData: { input: { x: number, y: number }, output: number }[] = [];
function resolveCords(cords: { x: number, y: number }) {
  const rX = cords.x / canvasWidth
  const rY = cords.y / canvasWidth
  return  rX > rY ? 1 : 0
}
let weights = { 
  x: Math.random() * 2 - 1,
  y: Math.random() * 2 - 1
};
console.log(weights);
for (let i = 0; i < 500; i++) {
  const input = {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasWidth,
  };
  trainingData.push({
    input,
    output: resolveCords(input)
  });
}
console.log(trainingData);

function sigmoid(value: number) {  
  return 1 / (1 + Math.exp(-value));
}
function guess(weights: {x: number, y: number} , input: {x: number, y: number}) {
  const calcX = input.x / canvasWidth;
  const calcY = input.y / canvasWidth;
  const sum = (weights.x * calcX + weights.y * calcY);
  return {
    sig: sigmoid(sum),
    sum
  };
}

function train(myWeights: { x: number, y: number }, input: { x: number, y: number }, output: number ) {
  console.log(`input: ${input.x}, ${input.y}`);
  console.log(`weights: ${myWeights.x}, ${myWeights.y}`);

  const myGuess = guess(myWeights, input);
  const error = output - myGuess.sig;
  const multiplier = 10; // for hard mathimatial tasks it will be faster to train

  weights.x += error * input.x * multiplier;
  weights.y += error * input.y * multiplier;

  console.log(`myGuess: ${myGuess.sig} | ${myGuess.sum}`);
  console.log(`output: ${output}`);
  console.log(`error: ${error}`);
  console.log(`ajusted weights: ${weights.x}, ${weights.y}`);
  console.log('------------------------------------');
}

trainingData.forEach(data => {
  const myInput = {
    x: data.input.x / canvasWidth,
    y: data.input.y / canvasWidth
  }
  train(weights, myInput, data.output);
});

function App() {

  const [canvasAll, setCanvasAll] = useState<{circles: JSX.Element[]}>({
    circles: [<></>],
  });

  function clickCirle(ev: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = ev.currentTarget.getBoundingClientRect();
    const cords = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };
    const myGuess = guess(weights, cords);
    const color = myGuess.sig > 0.5 ? 'red' : 'blue';
    const circle1 = <circle cx={cords.x} cy={cords.y} fill={color} r='2' />
    setCanvasAll({circles: [...canvasAll.circles, circle1]});
  }

  return (
    <MainContainer>
      <h1>Neural Networks tests</h1>
      <h2>Automaticaly sort dots on the screen after training</h2>
      <Canvas width="400" height="400" id="canvas" onClick={clickCirle}>
        <line x1="0" x2="400" y1="0" y2="400" stroke="green" />
        {canvasAll.circles}
      </Canvas>
    </MainContainer>
  );
}

export default App;
