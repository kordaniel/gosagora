import { useReducer } from 'react';

import { assertNever } from '../utils/typeguards';

const MSEC_IN_SEC  = 1000;
const MSEC_IN_MIN  = 60 * MSEC_IN_SEC;
const MSEC_IN_HOUR = 60 * MSEC_IN_MIN;

const UPDATE_FREQ = 500; // ms
const UPDATE_HIGH_FREQ = Math.round(1000 / 60); // last minute, ms

const INITIAL_TIME_MS = MSEC_IN_MIN + 10 * MSEC_IN_SEC; // TODO: Temp, refactor away

interface CountdownState {
  countdownId: ReturnType<typeof setTimeout> | null;
  duration: number;
  startTime: number;
  tickTime: number;
}

type CountdownStateAction =
  | { type: 'reset', payload: CountdownState }
  | { type: 'start', payload: CountdownState }
  | { type: 'stop',  payload: Pick<CountdownState, 'countdownId' | 'tickTime'> }
  | { type: 'tick',  payload: Pick<CountdownState, 'countdownId' | 'tickTime'> };


const countdownReducer = (
  state: CountdownState,
  action: CountdownStateAction
): CountdownState => {
  switch (action.type) {
    case 'reset': return action.payload;
    case 'start': return action.payload;
    case 'stop': return { ...state, ...action.payload };
    case 'tick': return { ...state, ...action.payload };
    default: return assertNever(action);
  }
};


const initialCountdownState: CountdownState = {
  countdownId: null,
  duration: INITIAL_TIME_MS,
  startTime: 0,
  tickTime: 0,
};

const useStartTimer = () => {
  const [countdown, dispatch] = useReducer(countdownReducer, initialCountdownState);

  const msecsLeft = countdown.duration - (countdown.tickTime - countdown.startTime);

  const ticker = (duration: number, startTime: number) => {
    const tickTime = Date.now();
    const timeLeft = duration - (tickTime - startTime);
    //console.log('timeLeft:', timeLeft);

    const countdownId = setTimeout(
      ticker,
      timeLeft > MSEC_IN_MIN ? UPDATE_FREQ : UPDATE_HIGH_FREQ,
      duration,
      startTime,
    );
    dispatch({
      type: 'tick',
      payload: { countdownId, tickTime },
    });
  };

  const reset = () => {
    if (countdown.countdownId) {
      clearTimeout(countdown.countdownId);
    }

    dispatch({
      type: 'reset',
      payload: {
        countdownId: null,
        duration: INITIAL_TIME_MS,
        startTime: 0,
        tickTime: 0,
      },
    });
  };

  const start = () => {
    if (countdown.countdownId) {
      console.error('already counting.........');
      return;
    }

    const startTime = Date.now();
    const countdownId = setTimeout(
      ticker,
      INITIAL_TIME_MS > MSEC_IN_MIN ? UPDATE_FREQ : UPDATE_HIGH_FREQ,
      INITIAL_TIME_MS,
      startTime
    );

    dispatch({
      type: 'start',
      payload: {
        countdownId,
        duration: INITIAL_TIME_MS,
        startTime,
        tickTime: startTime,
      },
    });
  };

  const stop = () => {
    const tickTime = Date.now();

    if (countdown.countdownId) {
      clearTimeout(countdown.countdownId);
    }

    dispatch({
      type: 'stop',
      payload: {
        countdownId: null,
        tickTime,
      },
    });
  };

  console.assert(msecsLeft >= 0, 'msecsLeft:', msecsLeft, 'countdown:', countdown);

  return {
    isCounting: countdown.countdownId !== null,
    pause: () => { console.log('pause... NOT' ); },
    reset,
    start,
    stop,
    timeLeft: {
      hours: Math.floor(msecsLeft / MSEC_IN_HOUR),
      minutes: Math.floor((msecsLeft % MSEC_IN_HOUR) / MSEC_IN_MIN),
      seconds: Math.floor((msecsLeft % MSEC_IN_MIN) / MSEC_IN_SEC),
      msecs: msecsLeft % MSEC_IN_SEC,
    },
  };
};

export default useStartTimer;
