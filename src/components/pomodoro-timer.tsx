import React, { useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioFinishtWorking = new Audio(bellFinish);

interface Props {
  pomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTimer);
  const [timeCounting, setTimeCouning] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesMeneger, setCyclesMeneger] = useState(
    new Array(props.cycles - 1).fill(true)
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTimer, setFullWorkingTimer] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTimer(fullWorkingTimer + 1);
    },
    timeCounting ? 1000 : null
  );

  const configWorker = () => {
    setTimeCouning(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTimer);
    audioStartWorking.play();
  };
  const configRest = (Long: boolean) => {
    setTimeCouning(true);
    setWorking(false);
    setResting(true);

    if (Long) {
      setMainTime(props.longRestTime);
    } else {
      setMainTime(props.shortRestTime);
    }

    audioFinishtWorking.play();
  };

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesMeneger.length > 0) {
      configRest(false);
      cyclesMeneger.pop();
    } else if (working && cyclesMeneger.length <= 0) {
      configRest(true);
      setCyclesMeneger(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configWorker();
  }, [
    working,
    resting,
    mainTime,
    cyclesMeneger,
    numberOfPomodoros,
    completedCycles,
    configRest,
    setCyclesMeneger,
    configWorker,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>Voce esta {working ? 'trabalhando' : 'descansando'}!</h2>
      <Timer mainTime={mainTime} />
      <div className="control">
        <Button text="WORK!" onClick={() => configWorker()}></Button>
        <Button text="Rest" onClick={() => configRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'PAUSE' : 'PLAY'}
          onClick={() => setTimeCouning(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        <p>Ciclos concluidos: {completedCycles}</p>
        <p>Horas Trabalhadas: {secondsToTime(fullWorkingTimer)}</p>
        <p>Numero Pomodoros Concluidos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
