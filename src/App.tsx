import { MainContainer } from './App.styled';
import Training from './components/Training';
import Prediction from './components/Prediction';

// const myTrainingData: { input: Vector2, output: readonly [number, number] }[] = [];
// function resolveCords(cords: Vector2) {
//   const rX = cords[0];
//   const rY = cords[1];

//   const conditions = {
//     centerSquare: (rX > 0.25 && rX < 0.75) && (rY > 0.25 && rY < 0.75),
//     smallSquere: rX < 0.5 && rY < 0.5,
//     lineFromTopLeftToBottomRight: rX > rY,
//     lineInTheBottomRightCorner: (rX * rY < 0.5),
//     lineFromBottomLeftToTopRight: (rX + rY < 1),
//   }

//   return conditions.centerSquare ? [0, 1] as const : [1, 0] as const;
// }
// const numberOfRightGuessExamples = 10000;
// for (let i = 0; i < numberOfRightGuessExamples; i++) {
//   const input: Vector2 = [
//     Math.random(),
//     Math.random(),
//   ];
//   myTrainingData.push({
//     input,
//     output: resolveCords(input)
//   });
// }

function App() {

  // function clickAndDraw(event: React.MouseEvent<SVGSVGElement>) {
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   const x = (event.clientX - rect.left); //x position within the element.
  //   const y = (event.clientY - rect.top)  //y position within the element.
  //   const cords = [x / canvasWidth, y / canvasWidth];
  //   network.activate(cords);
  //   const result = network.run()
  //   const guess = decodeGuess(result)
  //   const color = guess === 'left' ? 'red' : 'blue';
  //   const circle1 = <circle key={`${x},${y}`} cx={x} cy={y} fill={color} r='2' />
  //   setCanvasAll((prev)=>({circles:[...prev.circles, circle1]}));
  // }

  // useEffect(() => {
  //   for (let i = 0; i < Math.min(myTrainingData.length, 1000); i++) {
  //     const trainingItem = myTrainingData[i]
  //     network.activate(trainingItem.input);
  //     const result = network.run();
  //     const guess = decodeGuess(result);

  //     // const guess = decodeGuess(resolveCords(trainingItem.input))
  //     const color = guess === 'left' ? 'red' : 'blue';
  //     const circle1 = <circle cx={trainingItem.input[0] * canvasWidth} cy={trainingItem.input[1] * canvasWidth} fill={color} r='2' />
  //     setCanvasAll((prev) => ({ circles: [...prev.circles, circle1] }));
  //   }
  // }, [])



  return (
    <MainContainer>
      <h1>Neural Networks tests</h1>
      <h2>Automatically sort dots on the screen after training</h2>

      <div style={{ display: 'flex', columnGap: '10px' }}>
        <Training></Training>
        <Prediction></Prediction>
      </div>

      {/* <rect x="100" y="100" width="200" height="200" stroke="black" strokeWidth="2" fill="transparent" />
        <path d='M 0 0 L 400 400' stroke='black' strokeWidth='2' />
        <path d='M 0 400 L 400 0' stroke='black' strokeWidth='2' />
        {canvasAll.circles} */}
    </MainContainer>
  );
}

export default App;
