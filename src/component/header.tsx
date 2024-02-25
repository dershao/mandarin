import '../css/header.css';
import React from 'react';
import { Views } from '../view';
import { setStateGenericEventHandlerWrapper } from '../utils';

interface HeaderProps {
    setView: (view: Views) => void;
}

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {

  return (
    <>
      <div id="header">
        <div id="header-text">
          mandarin
        </div>
        <div id="header-panel">
          <div className="header-panel-item" onClick={setStateGenericEventHandlerWrapper([[Views.Options, props.setView]])}>Home</div>
          <div className='header-panel-item' onClick={setStateGenericEventHandlerWrapper([[Views.Main, props.setView]])}>About</div>
        </div>
      </div> 
    </>
  );
}