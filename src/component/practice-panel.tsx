import '../css/header.css';
import '../css/panel.css';
import React, { useState } from 'react';
import { QuitScreen } from './quit';
import { ShowAnimationPanelButton, HideAnimationPanelButton, ClearCanvasPanelButton, QuitPanelButton, PanelButtonProps } from './panel-button';

export const PracticePanel: React.FC<PanelButtonProps> = (props: PanelButtonProps) => {

  const [quitActive, setQuitActive] = useState(false);

  return (
    <>
      <QuitScreen isActive={quitActive} setActive={setQuitActive} setView={props.setView}/>
      <div id="header">
        <div id='canvas-panel'>
          <ShowAnimationPanelButton characterProps={props.characterProps} setView={props.setView} clearCanvas={props.clearCanvas} />
          <HideAnimationPanelButton characterProps={props.characterProps} setView={props.setView} clearCanvas={props.clearCanvas} />
          <ClearCanvasPanelButton characterProps={props.characterProps} setView={props.setView} clearCanvas={props.clearCanvas} />
          <QuitPanelButton characterProps={props.characterProps} setView={props.setView} clearCanvas={props.clearCanvas} setQuitActive={setQuitActive} />
        </div>
      </div>
    </>
  );
}
