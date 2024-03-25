import '../css/Practice.css'

import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { DrawingCanvas, DrawingCanvasProps } from "../component/canvas";
import { CharacterInfo, CharacterProps } from '../component/character';
import { DrawingCanvasRefProps } from '../component/canvas';
import { Card } from '../utils/card';
import { Views } from '.';
import { PracticePanel } from '../component/practice-panel';

export interface PracticeViewProperties {
  cards: Card<CharacterProps>[]
  setCards: (cards: Card<CharacterProps>[]) => void,
  setView: Dispatch<SetStateAction<Views>>;
}

export const PracticeView: React.FC<PracticeViewProperties> = (props: PracticeViewProperties) => {

  const canvasRef = useRef<DrawingCanvasRefProps>(null);

  const [seenAllCharacters, setSeenAllCharacters] = useState(false);
  const [sequence, setSequence] = useState(0);

  const cards: Card<CharacterProps>[] = props.cards;

  if (sequence === cards.length - 1 && seenAllCharacters === false) {
    setSeenAllCharacters(true);
  }

  const currentCard = props.cards[sequence];
  const characterProps = currentCard.card;

  const svgUrl = currentCard ? require(`../data/svgs/${characterProps?.svgCode}.svg`) : undefined;
  const drawingCanvasProps: DrawingCanvasProps = {
    backgroundImageUrl: svgUrl,
    showAnswer: true
  }

  const setNextCard = (cards: Card<CharacterProps>[], sequence: number) => {

    return () => {
      const canvasImage: HTMLCanvasElement | null = document.getElementById('drawingCanvas') as HTMLCanvasElement;
      const svgUrl = require('../data/grid.svg');
      if (canvasImage) {
        canvasImage.style.backgroundImage = `url('${svgUrl.default}')`
      }
      props.setCards([...cards]);
      setSequence(sequence);
    }
  }

  const ready = () => {
    props.setView(Views.Draw);
  }

  return (
    <>
      <header className="App-header">
        <PracticePanel characterProps={characterProps} clearCanvas={() => canvasRef.current?.clearCanvas()} setView={props.setView} />
      </header>
      <div id='practice-view'>
        <div className='canvas-wrapper'>
          <div className='centered'>
            <DrawingCanvas ref={canvasRef} drawingCanvasProps={drawingCanvasProps}/>
            <CharacterInfo {...characterProps}/>
          </div>
        </div>
        <div className='bottom'>
          {cards.length > 1 && <div id='feedback-panel'>
            {sequence === 0 && <button className="card-button-disabled">Prev</button>}
            {sequence > 0 && <button className="card-button" onClick={setNextCard(cards, sequence - 1)}>Prev</button>}
            {sequence === cards.length - 1 && <button className="card-button-disabled">Next</button>}
            {sequence < cards.length - 1 && <button className="card-button" onClick={setNextCard(cards, sequence + 1)}>Next</button>}
          </div>}
          <div id='ready-panel'>
            {seenAllCharacters && <button className="card-button" onClick={ready}>I&apos;m Ready</button>}
          </div>
        </div>
      </div>
    </>
  );
}
