import '../css/Main.css'

import React from 'react';
import { Views } from '../view';
import { setStateGenericEventHandlerWrapper } from '../utils';
import { Header } from '../component/header';

export const MainView: React.FC<MainProps> = (props: MainProps) => {

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="title">Real Time Mandarin</h1>
        <p className="paragraph">Alpha</p>
        <div className="button-group">
          <button className="button" onClick={setStateGenericEventHandlerWrapper([[Views.Prompt, props.setView]])}>Start</button>
        </div>
      </div>
    </>
  );
}

export interface MainProps {

  setView: (view: Views) => void;
}