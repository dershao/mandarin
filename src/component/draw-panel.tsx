import '../css/header.css';
import '../css/panel.css';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { QuitScreen } from './quit';
import { ClearCanvasPanelButton, QuitPanelButton, PanelButtonProps } from './panel-button';
import { Timer } from "../component/timer";

export interface DrawPanelProps extends PanelButtonProps {
    active: boolean;
    level: number;
    setLevel: Dispatch<SetStateAction<number>>;
    reset: () => void;
}


export const DrawPanel: React.FC<DrawPanelProps> = (props: DrawPanelProps) => {

  const [quitActive, setQuitActive] = useState(false);

  return (
    <>
      <QuitScreen isActive={quitActive} setActive={setQuitActive} setView={props.setView}/>
      <div id="header">
        <div id='canvas-panel'>
          <ClearCanvasPanelButton characterProps={props.characterProps} setView={props.setView} clearCanvas={props.clearCanvas} />
          <Timer
            isActive={props.active}
            level={props.level}
            setLevel={props.setLevel}
            reset={props.reset}
          />
          <QuitPanelButton characterProps={props.characterProps} setView={props.setView} clearCanvas={props.clearCanvas} setQuitActive={setQuitActive} />
        </div>
      </div>
    </>
  );
}
