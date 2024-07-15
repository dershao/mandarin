import '../css/header.css';
import '../css/panel-button.css';
import React, { Dispatch, SetStateAction } from 'react';
import { CharacterProps } from './character';
import { Views } from '../view';

export interface PanelButtonProps {
  characterProps: CharacterProps;
  setView: Dispatch<SetStateAction<Views>>;
  clearCanvas: () => void;

}

export interface QuitPanelButtonProps extends PanelButtonProps {
  setQuitActive: Dispatch<SetStateAction<boolean>>;
}

export interface AboutPanelButtonProps {
  setTutorialActive: Dispatch<SetStateAction<boolean>>;
}

/**
 * Show only the grid for practicing without the image present
 */
function hideAnimation() {
  
  const canvasImage: HTMLCanvasElement | null = document.getElementById('drawingCanvas') as HTMLCanvasElement;
  const svgUrl = require('../data/grid.svg');
  if (canvasImage) {
    canvasImage.style.backgroundImage = `url('${svgUrl.default}')`
  }
}

/**
 * Create function for resetting the animation of the SVG image showing how
 * to write the character
 */
function resetImgAnimation(props: CharacterProps) {

  const svgUrl = require(`../data/svgs/${props.svgCode}.svg`);

  return () => {
    const canvasImage: HTMLCanvasElement | null = document.getElementById('drawingCanvas') as HTMLCanvasElement;
    if (canvasImage) {
      canvasImage.style.backgroundImage = `url('${svgUrl}?rand=${Math.random()}')`
    }
  }
}

export const ShowAnimationPanelButton: React.FC<PanelButtonProps> = (props: PanelButtonProps) => {

  return (
    <div className="panel-button-wrapper">
      <button className="panel-button" onClick={resetImgAnimation(props.characterProps)}>
        <span className="icon write"></span>
      </button>
      <span className="tooltip-text">Show Animation</span>
    </div>
  )
}


export const HideAnimationPanelButton: React.FC<PanelButtonProps> = (props: PanelButtonProps) => {

  return (
    <div className="panel-button-wrapper">
      <button className="panel-button" onClick={hideAnimation}><span className="icon hide"></span></button>
      <span className="tooltip-text">Hide Animation</span>
    </div>
  )
}

export const ClearCanvasPanelButton: React.FC<PanelButtonProps> = (props: PanelButtonProps) => {

  return (
    <div className="panel-button-wrapper">
      <button className="panel-button" onClick={props.clearCanvas}><span className="icon clear"></span></button>
      <span className="tooltip-text">Clear Canvas</span>
    </div>
  )
}

export const QuitPanelButton: React.FC<QuitPanelButtonProps> = (props: QuitPanelButtonProps) => {

  return (
    <>
      <div className="panel-button-wrapper">
        <button className="panel-button quit" onClick={() => {props.setQuitActive(true)}}><span className="icon quit"/></button>
        <span className="tooltip-text">Quit</span>
      </div>       
    </>
  )
}

export const AboutPanelButton: React.FC<AboutPanelButtonProps> = (props: AboutPanelButtonProps) => {

  return (
    <>
      <div className="panel-button-wrapper">
        <button className="panel-button about" onClick={() => {props.setTutorialActive(true)}}><span className="icon about"/></button>
      </div>
    </>
  )
}

