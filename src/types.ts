export type Vector2 = [number, number];

export type TrainingSample = {
  input: Vector2;
  // todo? make `readonly`
  output: [number, number];
};
