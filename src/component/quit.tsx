import React, { Dispatch, SetStateAction } from 'react';

import '../css/quit.css';
import { Views } from '../view';

interface CurtainProps {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    setView: Dispatch<SetStateAction<Views>>;
}

export const QuitScreen: React.FC<CurtainProps> = (props: CurtainProps) => {
  const curtainClassName = props.isActive ? "quit-panel visible": "quit-panel";

  return (
    <>
      <div id="quit-screen-wrapper">
        <div className={curtainClassName}>
          <div className="curtain-card">
            <div className="quit-confirmation">Are you sure you wish to Quit and return to the home page?</div>
            <button className="card-button" onClick={() => {
              props.setView(Views.Main);
            }}>Yes</button>
            <button className="card-button" onClick={() => {
              props.setActive(false)
            }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
