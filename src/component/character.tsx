import '../css/character.css';
import React from 'react';

import { isCardType, Card, createCardFromObj } from '../utils/card';

const CHARACTER_IMG_ID = 'character-img';
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
