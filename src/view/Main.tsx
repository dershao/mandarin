import '../css/Main.css'

import React, { useState, Dispatch, SetStateAction } from 'react';
import { CharacterDictionary, hsk1_unique_chars_unicode, hsk2_unique_chars_unicode, hsk3_unique_chars_unicode } from '../data';
import characterJson from '../data/hsk_characters.json';
import { Views } from '../view';
import { MainPanel } from '../component/main-panel';
import { Tutorial } from '../component/tutorial';
import { CharacterProps } from '../component/character';
import { getRandomCharacters } from '../utils';
import { Card, createCard } from '../utils/card';

const CHARACTER_CODES = [
  ...hsk1_unique_chars_unicode,
  ...hsk2_unique_chars_unicode,
  ...hsk3_unique_chars_unicode
]

export const MainView: React.FC<MainProps> = (props: MainProps) => {

  const [tutorialActive, setTutorialActive] = useState(false);

  function quickStartHandler(props: MainProps, numberOfCharacters: number) {
    const selected_character_unicode = getRandomCharacters(CHARACTER_CODES, numberOfCharacters)
  
    const cards = selected_character_unicode.map((character_unicode) => {
      const character: CharacterDictionary = characterJson[character_unicode as keyof typeof characterJson];
      const characterProps: CharacterProps = {
        pinyin: character.pinyin,
        definition: character.definition,
        svgCode: character_unicode.charCodeAt(0).toString(),
      };
  
      return createCard<CharacterProps>(characterProps, character_unicode, {});
    });
  
    props.setCards(cards);
    props.setView(Views.Practice);
  }

  return (
    <>
      <Tutorial isActive={tutorialActive} setView={props.setView} setCards={props.setCards} setTutorialActive={setTutorialActive} />
      <MainPanel setTutorialActive={setTutorialActive}/>
      <div className="container">
        <div className="title">Quick Draw Mandarin</div>
        <canvas id="character"></canvas>
        <p className="paragraph">Learn Mandarin with a Neural Network</p>
        <div className="button-group">
          <button className="button" onClick={() => {quickStartHandler(props, 3)}}>Start</button>
        </div>
      </div>
    </>
  );
}

export interface MainProps {

  setView: Dispatch<SetStateAction<Views>>
  setCards: Dispatch<SetStateAction<Card<CharacterProps>[]>>
}