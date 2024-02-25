import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';


interface TimerProps {
    isActive: boolean,
    level: number,
    setLevel: Dispatch<SetStateAction<number>>;
    reset: () => void;
}

const TIME_LIMIT_SECONDS = 0;

export const Timer: React.FC<TimerProps> = (props: TimerProps) => {

  const [seconds, setSeconds] = useState(TIME_LIMIT_SECONDS);

  const time = seconds < 10 ? '0' + seconds : seconds;
  const timeDisplay = `00:${time}`;


  useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined;
    if (props.isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          const timeDisplayElement = document.getElementById("time-display");
          if (timeDisplayElement) {
            timeDisplayElement.innerHTML = "Time's up!";
          }
          props.reset();
          setSeconds(TIME_LIMIT_SECONDS);
          props.setLevel(props.level + 1);
        } else {
          setSeconds(seconds => seconds - 1);
        }
      }, 1000);
    } else {
      setSeconds(TIME_LIMIT_SECONDS); // if set to inactive, then reset
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  });

  return (
    <>
      <div className="timer">
        <div id="time-display">{timeDisplay}</div>
      </div>
    </>
  );

}