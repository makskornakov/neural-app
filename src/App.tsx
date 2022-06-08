import { MainContainer, Canvas } from './App.styled';
import React, { useState, useEffect } from 'react';
// @ts-expect-error kek
import { Network } from 'vt-neural-network';

type Vector2 = [ x: number, y: number ];
// enum Vector2 {
//   x,
//   y,
// }

const canvasWidth = 400;
const myTrainingData: { input: Vector2, output: readonly [number, number] }[] = [];
function resolveCords(cords: Vector2) {
  const rX = cords[0];
  const rY = cords[1];

  const conditions = {
    centerSquare: (rX > 0.25 && rX < 0.75) && (rY > 0.25 && rY < 0.75),
    smallSquere: rX < 0.5 && rY < 0.5,
    lineFromTopLeftToBottomRight: rX > rY,
    lineInTheBottomRightCorner: (rX * rY < 0.5),
    lineFromBottomLeftToTopRight: (rX + rY < 1),
  }

return  conditions.centerSquare ? [0, 1] as const : [1, 0] as const;
}
const numberOfRightGuessExamples = 10000;
for (let i = 0; i < numberOfRightGuessExamples; i++) {
  const input: Vector2 = [
    Math.random(),
    Math.random(),
  ];
  myTrainingData.push({
    input,
    output: resolveCords(input)
  });
}
// console.log(myTrainingData);

// Define the layer structure
const layers = [
  2, // This is the input layer
  9,
  2  // Output
]

const network = new Network(layers)

// Start training
const numberOfIterations = numberOfRightGuessExamples * 50;

// Training data for a "XOR" logic gate
// const trainingData = [{
//   input : [0,0],
//   output: [0]
// }, {
//   input : [0,1],
//   output: [1]
// }, {
//   input : [1,0],
//   output: [1]
// }, {
//   input : [1,1],
//   output: [0]
// }]

for(var i = 0; i < numberOfIterations; i ++) {
  // Get a random training sample
  const trainingItem = myTrainingData[Math.floor((Math.random()*myTrainingData.length))]
  network.train(trainingItem.input, trainingItem.output);
}

function decodeGuess(output: readonly [isGuessLeft: number, isGuessRight: number]){
  return output[0] > output[1] ? 'left' : 'right';
}

// After training we can see if it works
// we call activate to set a input in the first layer
// network.activate([0.2, 0.4]);
// const resultA = network.run()

// network.activate([0.4, 0.1]);
// const resultB = network.run()

// network.activate([0.7, 0.33]);
// const resultC = network.run()

// network.activate([0.1, 0.44]);
// const resultD = network.run()
// console.log('Expected 1, 0 got', resultA)
// console.log('Expected 0, 1 got', resultB)
// console.log('Expected 0, 1 got', resultC)
// console.log('Expected 1, 0 got', resultD)

console.log(myTrainingData);

function App() {

  const [canvasAll, setCanvasAll] = useState<{circles: JSX.Element[]}>({
    circles: [<></>],
  });

  function clickAndDraw(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left); //x position within the element.
    const y = (event.clientY - rect.top)  //y position within the element.
    const cords = [x / canvasWidth, y / canvasWidth];
    network.activate(cords);
    const result = network.run()
    const guess = decodeGuess(result)
    const color = guess === 'left' ? 'red' : 'blue';
    const circle1 = <circle key={`${x},${y}`} cx={x} cy={y} fill={color} r='2' />
    setCanvasAll((prev)=>({circles:[...prev.circles, circle1]}));
  }

  useEffect(() => {
    for (let i = 0; i < Math.min(myTrainingData.length, 1000); i++) {
      const trainingItem = myTrainingData[i]
      network.activate(trainingItem.input);
      const result = network.run();
      const guess = decodeGuess(result);

      // const guess = decodeGuess(resolveCords(trainingItem.input))
      const color = guess === 'left' ? 'red' : 'blue';
      const circle1 = <circle cx={trainingItem.input[0] * canvasWidth} cy={trainingItem.input[1] * canvasWidth} fill={color} r='2' />
      setCanvasAll((prev)=>({circles:[...prev.circles, circle1]}));
    }
  }, [])

  return (
    <MainContainer>
      <h1>Neural Networks tests</h1>
      <h2>Automaticaly sort dots on the screen after training</h2>
      <Canvas width={canvasWidth} height={canvasWidth} id="canvas" onClick={clickAndDraw}>
      {/* <Canvas width="400" height="400" id="canvas" onClick={clickNewCirle}> */}
        {/* <line x1="0" x2="400" y1="0" y2="400" stroke="green" /> */}
        <rect x="100" y="100" width="200" height="200" stroke="black" strokeWidth="2" fill="transparent" />
        {/* <line x1="400" x2="0" y1="0" y2="400" stroke="green" /> */}
        {canvasAll.circles}
      </Canvas>
    </MainContainer>
  );
}

export default App;
