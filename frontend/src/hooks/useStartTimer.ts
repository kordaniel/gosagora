import { useReducer } from 'react';

import type { TimeDuration } from '../types';
//import { assertNever } from '../utils/typeguards';

const MSEC_IN_SEC  = 1000;
const MSEC_IN_MIN  = 60 * MSEC_IN_SEC;
const MSEC_IN_HOUR = 60 * MSEC_IN_MIN;

const UPDATE_FREQ = 500; // ms. Note: ticker cb expects that this is set to <= MSEC_IN_MIN
const UPDATE_HIGH_FREQ = Math.round(MSEC_IN_SEC / 30); // last minute, ms. Should be < UPDATE_FREQ

interface CountdownState {
  countdownId: ReturnType<typeof setTimeout> | null;
  duration: number;
  isPaused: boolean;
  startTime: number;
  tickTime: number;
}

type CountdownStateAction =
  | { type: 'reset', payload: Omit<CountdownState, 'duration'> }
  | { type: 'start', payload: Omit<CountdownState, 'duration'> }
  | { type: 'pause', payload: Pick<CountdownState, 'countdownId' | 'isPaused' | 'tickTime'> }
  | { type: 'tick',  payload: Pick<CountdownState, 'countdownId' | 'tickTime'> };


const countdownReducer = (
  state: CountdownState,
  action: CountdownStateAction
): CountdownState => {
  //switch (action.type) {
  //  case 'reset': return { ...state, ...action.payload };
  //  case 'start': return { ...state, ...action.payload };
  //  case 'stop':  return { ...state, ...action.payload };
  //  case 'pause': return { ...state, ...action.payload };
  //  case 'tick':  return { ...state, ...action.payload };
  //  default: return assertNever(action);
  //}
  return { ...state, ...action.payload };
};


const initialCountdownState: CountdownState = {
  countdownId: null,
  duration: 5 * MSEC_IN_MIN,
  isPaused: false,
  startTime: 0,
  tickTime: 0,
};

/**
 * Hook that provides the state and logic for the Start Timer component.
 *
 * Ticks are implemented using JS setTimeout, which delay is not guaranteed to be precise.
 * In most cases the timer finishes with a delay of <~15 ms. When running on web some browsers
 * might introduce significant delays when running in background tabs. 15 min on firefox,
 * 1 min on chrome.
 *
 * @returns useStartTimer hook
 */
const useStartTimer = () => {
  const [countdown, dispatch] = useReducer(countdownReducer, initialCountdownState);

  const computeMsecsLeft = (duration: number, tickTime: number, startTime: number): number => {
    // The remaining time to zero can be negative since the delay of JS setTimeout is not guaranted.
    // On web (firefox) it might be as long as 15 min in inactive tabs.
    return Math.max(0, duration - (tickTime - startTime));
  };

  const msecsLeft = computeMsecsLeft(countdown.duration, countdown.tickTime, countdown.startTime);

  const ticker = (duration: number, startTime: number) => {
    const tickTime = Date.now();

    const timeLeft = computeMsecsLeft(duration, tickTime, startTime);

    if (timeLeft > 0) {
      const timeoutDelay = timeLeft > MSEC_IN_MIN
        ? UPDATE_FREQ
        : timeLeft < UPDATE_HIGH_FREQ
          ? timeLeft
          : UPDATE_HIGH_FREQ;
      const countdownId = setTimeout(
        ticker,
        timeoutDelay,
        duration,
        startTime,
      );
      dispatch({
        type: 'tick',
        payload: { countdownId, tickTime },
      });
    } else {
      dispatch({
        type: 'tick',
        payload: { countdownId: null, tickTime },
      });
    }
  };

  const reset = () => {
    if (countdown.countdownId) {
      return; // Prevent resetting a running countdown
    }

    dispatch({
      type: 'reset',
      payload: {
        countdownId: null,
        isPaused: false,
        startTime: 0,
        tickTime: 0,
      },
    });
  };

  const start = () => {
    const timeNow = Date.now();

    if (countdown.isPaused)
    {
      const correctedStartTime = countdown.startTime + (timeNow - countdown.tickTime);
      const timeLeft = computeMsecsLeft(countdown.duration, timeNow, correctedStartTime);
      const timeoutDelay = timeLeft > MSEC_IN_MIN
        ? UPDATE_FREQ
        : timeLeft < UPDATE_HIGH_FREQ
          ? timeLeft
          : UPDATE_HIGH_FREQ;
      const countdownId = setTimeout(
        ticker,
        timeoutDelay,
        countdown.duration,
        correctedStartTime
      );

      dispatch({
        type: 'start',
        payload: {
          countdownId,
          isPaused: false,
          startTime: correctedStartTime,
          tickTime: timeNow,
        },
      });
    }
    else
    {
      const countdownId = setTimeout(
        ticker,
        countdown.duration > MSEC_IN_MIN ? UPDATE_FREQ : UPDATE_HIGH_FREQ,
        countdown.duration,
        timeNow
      );

      dispatch({
        type: 'start',
        payload: {
          countdownId,
          isPaused: false,
          startTime: timeNow,
          tickTime: timeNow,
        },
      });
    }
  };

  const pause = () => {
    const tickTime = Date.now();

    if (!countdown.countdownId) {
      return;
    }

    clearTimeout(countdown.countdownId);

    dispatch({
      type: 'pause',
      payload: {
        countdownId: null,
        isPaused: true,
        tickTime,
      },
    });
  };

  console.assert(msecsLeft >= 0, 'msecsLeft:', msecsLeft, 'countdown:', countdown);
  if (msecsLeft < 100) console.log('time left:', msecsLeft);

  return {
    isCounting: countdown.countdownId !== null,
    pause,
    reset,
    start,
    timeLeft: {
      hours: Math.floor(msecsLeft / MSEC_IN_HOUR),
      minutes: Math.floor((msecsLeft % MSEC_IN_HOUR) / MSEC_IN_MIN),
      seconds: Math.floor((msecsLeft % MSEC_IN_MIN) / MSEC_IN_SEC),
      msecs: msecsLeft % MSEC_IN_SEC,
    } satisfies TimeDuration as TimeDuration,
  };
};

export default useStartTimer;
