import React from 'react';
import { secondsTime } from '../utils/seconds-to-time';

interface Props {
  mainTime: number;
}

export function Timer(props: Props): JSX.Element {
  return <div className="timer">{secondsTime(props.mainTime)}</div>;
}
