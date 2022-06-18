// @ts-expect-error
import { Network } from 'vt-neural-network-ts';

import { TrainingSample } from './types';

export const trainingData: TrainingSample[] = [];

const layers = [
  // our network has 2 hidden layers, 9 neurons each.
  // the logic behind this is by two input coordinates we divide the area into 9 squares, and each square has 9 times again.
  2, // This is the input layer
  9,
  9,
  2, // Output
];
export const network = new Network(layers);
