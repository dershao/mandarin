import React, { Dispatch, SetStateAction } from 'react';

import { Card } from '../utils/card';
import { CharacterProps } from './character'
import '../css/curtain.css';

interface CurtainProps {
    character: Card<CharacterProps>,
    isActive: boolean,
    setActive: Dispatch<SetStateAction<boolean>>
}

export const Curtain: React.FC<CurtainProps> = (props: CurtainProps) => {
  const curtainClassName = props.isActive ? "curtain-panel" : "curtain-panel visible";

  return (
    <>
      <div id="curtain-wrapper">
        <div id="curtain" className={curtainClassName}>
          <div className="curtain-card">
            <div className="curtain-text">Draw: {props.character.card.definition}</div>
            <button id="button" className="card-button" onClick={() => {
              props.setActive(true);
            }}>Let&apos;s go!</button>
          </div>
        </div>
      </div>
    </>
  );
}
