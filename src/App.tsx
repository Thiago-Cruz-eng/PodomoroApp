import React from 'react';
import { PomodoroTimer } from './components/pomodoro-tomer';

function App() {
  return (
    <div className="App">
      <PomodoroTimer defaultPomodoroTimer={3600} />
    </div>
  );
}

export default App;
