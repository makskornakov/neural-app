// @ts-expect-error
import { Network } from 'vt-neural-network';

import { TrainingSample } from './types';

export const trainingData: TrainingSample[] = [];

const layers = [
  2, // This is the input layer
  9,
  2  // Output
];
export const network = new Network(layers);