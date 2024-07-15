import '../css/header.css';
import '../css/panel.css';
import React, { Dispatch, SetStateAction } from 'react';
import { AboutPanelButton } from './panel-button';

export const MainPanel: React.FC<MainPanelProps> = (props: MainPanelProps) => {

  return (
    <>
      <div id="header">
        <div id='main-panel'>
          <AboutPanelButton setTutorialActive={props.setTutorialActive}/>
        </div>
      </div>
    </>
  );
}

export interface MainPanelProps {
  setTutorialActive: Dispatch<SetStateAction<boolean>>;
}
