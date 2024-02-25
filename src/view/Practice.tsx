import '../css/Practice.css'

import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { DrawingCanvas, DrawingCanvasProps } from "../component/canvas";
import { CharacterInfo, CharacterPanel, CharacterProps } from '../component/character';
import { DrawingCanvasRefProps } from '../component/canvas';
import { Card } from '../utils/card';
import { Views } from '.';

export interface PracticeViewProperties {
  cards: Card<CharacterProps>[]
  setCards: (cards: Card<CharacterProps>[]) => void,
  setView: Dispatch<SetStateAction<Views>>;
}

export const PracticeView: React.FC<PracticeViewProperties> = (props: PracticeViewProperties) => {

  const canvasRef = useRef<DrawingCanvasRefProps>(null);

  const [seenAllCharacters, setSeenAllCharacters] = useState(false);
  const [practiceViewState, setPracticeViewState] = useState({
    sequence: 0
  });

  const cards: Card<CharacterProps>[] = props.cards;

  if (practiceViewState.sequence === cards.length - 1 && seenAllCharacters === false) {
    setSeenAllCharacters(true);
  }

  const currentCard = props.cards[practiceViewState.sequence];
  const characterProps = currentCard.card;

  const svgUrl = currentCard ? require(`../data/svgs/${characterProps?.svgCode}.svg`) : undefined;
  const drawingCanvasProps: DrawingCanvasProps = {
    backgroundImageUrl: svgUrl,
  }

  const setNextCard = (cards: Card<CharacterProps>[], sequence: number) => {

    return () => {
      const canvasImage: HTMLCanvasElement | null = document.getElementById('drawingCanvas') as HTMLCanvasElement;
      const svgUrl = require('../data/grid.svg');
      if (canvasImage) {
        canvasImage.style.backgroundImage = `url('${svgUrl.default}')`
      }
      props.setCards([...cards]);
      setPracticeViewState(prevState => ({sequence: sequence}))
    }
  }

  const ready = () => {
    props.setView(Views.Draw);
  }

  return (
    <>
      <div id='practice-view'>
        <div className='canvas-wrapper'>
          <div className='centered'>
            <DrawingCanvas ref={canvasRef} drawingCanvasProps={drawingCanvasProps}/>
            <CharacterInfo {...characterProps}/>
          </div>
          <div className='right'>
            <button className="card-button" onClick={() => canvasRef.current?.clearCanvas()}>Clear Canvas</button>
            <CharacterPanel {...characterProps}/>
          </div>
        </div>
        <div className='bottom'>
          <div id='feedback-panel'>
            {practiceViewState.sequence === 0 && <button className="card-button-disabled">Prev</button>}
            {practiceViewState.sequence > 0 && <button className="card-button" onClick={setNextCard(cards, practiceViewState.sequence - 1)}>Prev</button>}
            {practiceViewState.sequence === cards.length - 1 && <button className="card-button-disabled">Next</button>}
            {practiceViewState.sequence < cards.length - 1 && <button className="card-button" onClick={setNextCard(cards, practiceViewState.sequence + 1)}>Next</button>}
          </div>
          <div id='ready-panel'>
            {seenAllCharacters && <button className="card-button" onClick={ready}>I&apos;m Ready</button>}
          </div>
        </div>
      </div>
    </>
  );
}
