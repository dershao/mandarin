import '../css/Main.css'

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Views } from '../view';
import { MainPanel } from '../component/main-panel';
import { Prompt } from '../component/prompt';
import { CharacterProps } from '../component/character';
import { Card } from '../utils/card'; 

export const MainView: React.FC<MainProps> = (props: MainProps) => {

  const [promptActive, setPromptActive] = useState(false);

  return (
    <>
      <Prompt isActive={promptActive} setView={props.setView} setCards={props.setCards} />
      <MainPanel />
      <div className="container">
        <div className="title">Real Time Mandarin</div>
        <canvas id="character"></canvas>
        <p className="paragraph">Learn Mandarin with a Neural Network</p>
        <div className="button-group">
          <button className="button" onClick={() => {setPromptActive(true)}}>Start</button>
        </div>
      </div>
    </>
  );
}

export interface MainProps {

  setView: Dispatch<SetStateAction<Views>>
  setCards: Dispatch<SetStateAction<Card<CharacterProps>[]>>
}