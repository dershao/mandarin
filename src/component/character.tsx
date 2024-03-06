import '../css/character.css';
import React from 'react';

import { isCardType, Card, createCardFromObj } from '../utils/card';

const CHARACTER_IMG_ID = 'character-img';
const CHARACTER_BUTTON_CLASS_NAME = 'card-button';
const CHARACTER_DESCRIPTION_CLASS_NAME = 'card-description';

/**
 * Properties interface for all character UI components
 */
export interface CharacterProps {
    definition: string,
    pinyin: string[], // TODO: Edit the data to convert pinyin from string[] to string type
    svgCode: string
}

export function isCardCharacterPropsArray(obj: Array<unknown>): obj is Card<CharacterProps>[] {
  obj.forEach((item) => {
    const itemAsObj = item as object;

    if (!isCardType(itemAsObj)) {
      return false;
    }

    const card = createCardFromObj(itemAsObj);

    const cardData = card.card as object;

    if (!('definition' in cardData) || !('pinyin' in cardData) || !('svgCode' in cardData)) {
      return false;
    }
  });

  return true;
}

/** 
 * @deprecated Only use components to construct new views
*/
export function CharacterCard(character: CharacterProps) {

  const characterProps: CharacterProps = {...character, svgCode: '23398'};

  return (
    <>
      <div className="character-card">
        <CharacterImage {...characterProps}/>
        <CharacterInfo {...characterProps}/>
        <CharacterPanel {...characterProps}/>
      </div>
    </>
  );
}

/**
 * Temporarily unused, will re-use for new views in the future
 * 
 */
export const CharacterImage: React.FC<CharacterProps> = (props: CharacterProps) => {

  const svg = require(`../data/character_images/${props.svgCode}.svg`);

  return (
    <>
      <div className="card-img">
        <img id={CHARACTER_IMG_ID} alt={`Something went wrong with code ${props.svgCode}`} src={svg}></img>
      </div>
    </>
  )
}

export const CharacterInfo: React.FC<CharacterProps> = (props: CharacterProps) => {

  const definition: string = props.definition ?? '--';
  const pinyin: string[] = props.pinyin ?? ['--'];

  return (
    <>
      <div className={CHARACTER_DESCRIPTION_CLASS_NAME}>
        <p><em>Definition:</em> {definition}</p>
      </div>
      <div className={CHARACTER_DESCRIPTION_CLASS_NAME}>
        <p><em>Pinyin:</em> {pinyin}</p>
      </div>
    </>
  )
}

export const CharacterPanel: React.FC<CharacterProps> = (props: CharacterProps) => {
  return (
    <>
      <div id='character-panel'>
        <button className={CHARACTER_BUTTON_CLASS_NAME} onClick={resetImgAnimation(props)}>Write Animation</button>
        <button className={CHARACTER_BUTTON_CLASS_NAME} onClick={showStillCharacter(props)}>No Animation</button>
        <button className={CHARACTER_BUTTON_CLASS_NAME} onClick={clearCanvas}>Hide Animation</button>
      </div>
    </>
  );
}

/**
 * Show the non-animated character
 */
function showStillCharacter(props: CharacterProps) {

  const svgUrl = require(`../data/svgs-still/${props.svgCode}-still.svg`);

  return () => {
    const canvasImage: HTMLCanvasElement | null = document.getElementById('drawingCanvas') as HTMLCanvasElement;
    if (canvasImage) {
      canvasImage.style.backgroundImage = `url('${svgUrl}?rand=${Math.random()}')`
    }
  }
}

/**
 * Show only the grid for practicing without the image present
 */
function clearCanvas() {
  
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
