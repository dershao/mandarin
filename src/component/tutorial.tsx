import React, { Dispatch, useRef, SetStateAction, useState } from 'react';

import '../css/tutorial.css';
import { Views } from '../view';
import { CharacterProps } from './character';
import { Card } from '../utils/card';

export interface TutorialProps {
  setCards: (cards: Card<CharacterProps>[]) => void;
  setView: (view: Views) => void;
  setTutorialActive: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
}

export const Tutorial: React.FC<TutorialProps> = (props: TutorialProps) => {

  const [slideNumber, setSlideNumber] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const curtainClassName = props.isActive ? "tutorial visible" : "tutorial";
  const practiceDemo = require('../data/practice-phase.mp4');
  const testingDemo = require('../data/test-phase.mp4');

  const tutorialSlides = [
    {
      description: "You will be shown how to write 3 different Mandarin characters. You can freely practice on the drawing canvas until you have it memorized.",
      demo: practiceDemo
    },
    {
      description: "Once you are ready, try to draw the characters shown within 30 seconds and see if the deep learning model can guess what you are drawing!",
      demo: testingDemo
    }
  ]

  const videoElement = <>
    <video height={240} width={480} autoPlay={true} loop={true} ref={videoRef}>
      <source src={tutorialSlides[slideNumber].demo} type="video/mp4" />
    </video>
  </>

  videoRef.current?.load();

  const handleStart = () => {

    props.setTutorialActive(false);
    setSlideNumber(0);
  };

  return (
    <>
      <div className={curtainClassName}>
        <p className="top-text">Tutorial</p>
        <div className="demo-wrapper">
          {videoElement}
          <p className="bottom-text">{tutorialSlides[slideNumber].description}</p>
          <div className="navigation-panel">
            {slideNumber === 0 && <button className="card-button-disabled">Prev</button>}
            {slideNumber > 0 && <button className="card-button" onClick={() => setSlideNumber(slideNumber - 1)}>Prev</button>}
            {slideNumber === tutorialSlides.length - 1 && <button className="card-button-disabled">Next</button>}
            {slideNumber < tutorialSlides.length - 1 && <button className="card-button" onClick={() => setSlideNumber(slideNumber + 1)}>Next</button>}
          </div>
        </div>
        <button className="card-button" onClick={handleStart}>Close</button>
      </div>
    </>
  )
}  