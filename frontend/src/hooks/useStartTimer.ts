import { useEffect, useReducer, useRef } from 'react';

import type { TimeDuration } from '../types';
import { assertNever } from '../utils/typeguards';

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
  | { type: 'addToDuration', payload: Pick<CountdownState, 'duration'> }
  | { type: 'reset', payload: Omit<CountdownState, 'duration'> }
  | { type: 'start', payload: Omit<CountdownState, 'duration'> }
  | { type: 'sync',  payload: Pick<CountdownState, 'countdownId' | 'startTime' | 'tickTime'> }
  | { type: 'pause', payload: Pick<CountdownState, 'countdownId' | 'isPaused' | 'tickTime'> }
  | { type: 'tick',  payload: Pick<CountdownState, 'countdownId' | 'tickTime'> };


const countdownReducer = (
  state: CountdownState,
  action: CountdownStateAction
): CountdownState => {
  switch (action.type) {
    case 'addToDuration': return {
      ...state,
      duration: Math.max(0, state.duration + action.payload.duration)
    };
    case 'reset': return { ...state, ...action.payload };
    case 'start': return { ...state, ...action.payload };
    case 'sync':  return { ...state, ...action.payload };
    case 'pause': return { ...state, ...action.payload };
    case 'tick':  return { ...state, ...action.payload };
    default: return assertNever(action);
  }
};


const initialCountdownState: CountdownState = {
  countdownId: null,
  duration: 5 * MSEC_IN_MIN,
  isPaused: true,
  startTime: 0,
  tickTime: 0,
};

/**
 * Hook that provides the state and logic for the Start Timer component.
 *
 * Ticks are implemented using JS setTimeout, which delay is not guaranteed to be precise.
 * In most cases the timer finishes within a delay of <~15 ms. When running on web some browsers
 * might introduce significant delays when running in background tabs. 15 min on firefox,
 * 1 min on chrome.
 *
 * @returns useStartTimer hook
 */
const useStartTimer = () => {
  const [countdown, dispatch] = useReducer(countdownReducer, initialCountdownState);
  const countdownRef = useRef(countdown);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  const computeTimeoutDelay = (msecsLeft: number): number => {
    if (msecsLeft > MSEC_IN_MIN) {
      return UPDATE_FREQ;
    }
    return msecsLeft < UPDATE_HIGH_FREQ ? msecsLeft : UPDATE_HIGH_FREQ;
  };

  const computeMsecsLeft = (duration: number, tickTime: number, startTime: number): number => {
    // NOTE: The remaining time to zero can be negative, delay of JS setTimeout is not guaranted.
    return Math.max(0, duration - (tickTime - startTime));
  };

  const msecsLeft = computeMsecsLeft(countdown.duration, countdown.tickTime, countdown.startTime);

  const ticker = () => {
    const tickTime = Date.now();

    const timeLeft = computeMsecsLeft(
      countdownRef.current.duration, tickTime, countdownRef.current.startTime
    );

    if (timeLeft > 0) {
      const countdownId = setTimeout(ticker, computeTimeoutDelay(timeLeft));

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

  const addToCountdown = (
    hours: number,
    minutes: number = 0,
    seconds: number = 0
  ) => {
    dispatch({
      type: 'addToDuration',
      payload: {
        duration: hours * MSEC_IN_HOUR + minutes * MSEC_IN_MIN + seconds * MSEC_IN_SEC,
      }
    });
  };

  const remainsAtMost = (
    hours: number,
    minutes: number = 0,
    seconds: number = 0
  ): boolean => {
    return msecsLeft <= (hours * MSEC_IN_HOUR + minutes * MSEC_IN_MIN + seconds * MSEC_IN_SEC);
  };

  const reset = () => {
    if (countdown.countdownId) {
      return; // Prevent resetting a running countdown
    }

    dispatch({
      type: 'reset',
      payload: {
        countdownId: null,
        isPaused: true,
        startTime: 0,
        tickTime: 0,
      },
    });
  };

  const setDuration = (hours: number, minutes: number, seconds: number) => {
    console.log('setDuration: NOT IMPLEMENTED!!'); // TODO: Implement functionality
  };

  const start = () => {
    const timeNow = Date.now();

    if (countdown.isPaused)
    {
      const correctedStartTime = countdown.startTime + (timeNow - countdown.tickTime);
      const timeLeft = computeMsecsLeft(countdown.duration, timeNow, correctedStartTime);
      const countdownId = setTimeout(ticker, computeTimeoutDelay(timeLeft));

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
      const countdownId = setTimeout(ticker, computeTimeoutDelay(countdown.duration));

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

  /**
   * Syncs the remining countdown time to the closest full minute
   */
  const sync = () => {
    const timeNow = Date.now();
    // If the countdown has not been started, then startTime == 0 && tickTime == 0
    const timeLeft = computeMsecsLeft(countdown.duration, timeNow, countdown.startTime || timeNow);
    const minuteRemainderMsecs = timeLeft % MSEC_IN_MIN;

    if (minuteRemainderMsecs === 0 || remainsAtMost(0, 0, 30)) {
      return;
    }
    if (countdown.countdownId) {
      clearTimeout(countdown.countdownId);
    }

    const startTimeShift = minuteRemainderMsecs < (0.5 * MSEC_IN_MIN)
      ? -minuteRemainderMsecs
      : (MSEC_IN_MIN - minuteRemainderMsecs);
    const syncedStartTime = (countdown.startTime || timeNow) + startTimeShift;

    if (countdown.isPaused) {
      dispatch({
        type: 'sync',
        payload: { countdownId: null, startTime: syncedStartTime, tickTime: timeNow },
      });
    } else {
      const syncedTimeLeft = computeMsecsLeft(countdown.duration, timeNow, syncedStartTime);
      const countdownId = setTimeout(ticker, computeTimeoutDelay(syncedTimeLeft));
      dispatch({
        type: 'sync',
        payload: { countdownId, startTime: syncedStartTime, tickTime: timeNow },
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

  return {
    addToCountdown,
    isCounting: countdown.countdownId !== null,
    pause,
    remainsAtMost,
    reset,
    setDuration,
    start,
    sync,
    canSync: msecsLeft > (0.5 * MSEC_IN_MIN),
    timeLeft: {
      hours: Math.floor(msecsLeft / MSEC_IN_HOUR),
      minutes: Math.floor((msecsLeft % MSEC_IN_HOUR) / MSEC_IN_MIN),
      seconds: Math.floor((msecsLeft % MSEC_IN_MIN) / MSEC_IN_SEC),
      msecs: msecsLeft % MSEC_IN_SEC,
    } satisfies TimeDuration as TimeDuration,
  };
};

export default useStartTimer;
