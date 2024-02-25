import '../css/Main.css'

import React from 'react';
import { Views } from '../view';
import { setStateGenericEventHandlerWrapper } from '../utils';

export const MainView: React.FC<MainProps> = (props: MainProps) => {

  return (
    <div className="container">
      <h1 className="title">Real Time Mandarin</h1>
      <p className="paragraph">Alpha</p>
      <div className="button-group">
        <button className="button" onClick={setStateGenericEventHandlerWrapper([[Views.Options, props.setView]])}>Start</button>
      </div>
    </div>
  );
}

export interface MainProps {

  setView: (view: Views) => void;
}