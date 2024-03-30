import React, { KeyboardEvent, useState } from 'react';

import '../css/prompt.css';
import characterJson from '../data/hsk_characters.json';
import { Views } from '../view';
import { getRandomCharacters } from '../utils';
import { CharacterDictionary, hsk1_unique_chars_unicode, hsk2_unique_chars_unicode, hsk3_unique_chars_unicode } from '../data';
import { CharacterProps } from '../component/character';
import { Card, createCard } from '../utils/card';

const CHARACTER_CODES = [
  ...hsk1_unique_chars_unicode,
  // ...hsk2_unique_chars_unicode,
  // ...hsk3_unique_chars_unicode
]

export interface PromptProps {
  
  setCards: (cards: Card<CharacterProps>[]) => void;
  setView: (view: Views) => void;
  isActive: boolean;
}

function quickStartHandler(props: PromptProps, numberOfCharacters: number) {
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

export const Prompt: React.FC<PromptProps> = (props: PromptProps) => {

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const curtainClassName = props.isActive ? "prompt visible" : "prompt";


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = event.target.value;
    setValue(inputValue);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {

    if (event.key === 'Enter') {
      const enteredValue: string = (event.target as HTMLInputElement).value;
      const number = Number(enteredValue);

      if (enteredValue && !isNaN(number) && (number > 0 && number <= 5)) {
        quickStartHandler(props, number);
      } else {
        setError('Please enter a number between 1 and 5')
      }
    }
  };

  return (
    <>
      <div className={curtainClassName}>
        <div id="prompt-input-wrapper">
          <label>
            How many characters would you like to learn?
          </label>
          <div>(1 to 5)</div>
          <div>
            <input id="prompt-input" 
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleEnter} 
            />
          </div>
          {error && <p id="error-text" style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </>
  )
}