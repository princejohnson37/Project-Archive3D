import * as _ from 'lodash';
import { state, stateArray } from '../Utils/types';

const curr_state: stateArray = { };

export const initial_State: stateArray = {
  'teeth': {
    material : {
      color: 0xffffff,
      transparent: true,
      opacity: 1
    }
  },
  'gum': {
    material: {
      color: 0xff8080,
      transparent: true,
      opacity: 1
    }
  }
};

export const getState = (key: string): stateArray[keyof state] => _.cloneDeep(curr_state[key]);

export const setState = (key: string, payload: state) => {
  curr_state[key] = payload;
}