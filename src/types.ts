export type Vector2 = [number, number];

export type TrainingSample = {
  input: Vector2;
  output: readonly [number, number];
};
