import '../css/Options.css'

import React from 'react';
import characterJson from '../data/hsk_characters.json';
import { Views } from '.';
import { getRandomCharacters, setStateGenericEventHandlerWrapper } from '../utils';
import { CharacterDictionary, hsk1_unique_chars_unicode, hsk2_unique_chars_unicode, hsk3_unique_chars_unicode } from '../data';
import { CharacterProps } from '../component/character';
import { Card, createCard } from '../utils/card';

const CHARACTER_CODES = [
  ...hsk1_unique_chars_unicode,
  // ...hsk2_unique_chars_unicode,
  // ...hsk3_unique_chars_unicode
]

export const OptionsView: React.FC<OptionsProps> = (props: OptionsProps) => {
  return (
    <div id="options-view">
      <div className="options-wrapper">
        <div className="box" onClick={quickStartHandler(props)}>
          <div className="big-font">Quick Start</div>
          <div className="small-font">Randomly chosen characters to learn</div>
        </div>
        <div className="box" onClick={catalog(props)}>
          <div className="big-font">Custom Learning</div>
          <div className="small-font">Customize characters from full catalogue</div>
        </div>
      </div>
    </div>
  );
}

function quickStartHandler(props: OptionsProps) {
  const selected_character_unicode = getRandomCharacters(CHARACTER_CODES, 3)

  const cards = selected_character_unicode.map((character_unicode) => {
    const character: CharacterDictionary = characterJson[character_unicode as keyof typeof characterJson];
    const characterProps: CharacterProps = {
      pinyin: character.pinyin,
      definition: character.definition,
      svgCode: character_unicode.charCodeAt(0).toString(),
    };

    return createCard<CharacterProps>(characterProps, character_unicode, {});
  });

  /*eslint-disable @typescript-eslint/no-explicit-any */
  // Need explicit any since this is a generic state update handler which can take various
  // state type and function signatures for updating state
  const setStateInputs: [any, any][] = [
    [cards, props.setCards],
    [Views.Practice, props.setView]
  ]

  return setStateGenericEventHandlerWrapper(setStateInputs);
}

function catalog(props: OptionsProps) {

  const setStateInputs: [any, any][] = [
    [Views.Catalog, props.setView]
  ]

  return setStateGenericEventHandlerWrapper(setStateInputs);
}

export interface OptionsProps {
  
  setCards: (cards: Card<CharacterProps>[]) => void,
  setView: (view: Views) => void,
}
