import React, { Dispatch, SetStateAction } from 'react';


import { Card, Feedback } from '../utils/card';
import { CharacterProps } from './character';

export interface FeedbackPanelProps {
  cardId: string;
  cards: Card<CharacterProps>[];
  setCards: (cards: Card<CharacterProps>[]) => void;
  setPracticeViewState: Dispatch<SetStateAction<{ sequence: number; }>>;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = (props: FeedbackPanelProps) => {

  const currentCardId: string = props.cardId;

  const proceedToNextCharacter = (currentCardId: string, cards: Card<CharacterProps>[], feedback: Feedback) => {

    return () => {
      const findCurrentCard = cards.filter((c) => c.id === currentCardId);

      if (findCurrentCard.length === 0) {
        throw new Error(`Could not find card with id: ${currentCardId} when attempting to update card based on feedback`);
      }

      findCurrentCard[0].updateCardBasedOnFeedback(feedback);

      // need to create a new array each time or the state will seem to be unchanged since the array has the same reference
      props.setCards([...cards]);
      props.setPracticeViewState(prevState => ({showAnswer: false, sequence: prevState.sequence + 1}));
    }
  }
  
  return (
    <>
      <div id='feedback-panel'>
        <button className="card-button" onClick={proceedToNextCharacter(currentCardId, props.cards, Feedback.AGAIN)}>Again</button>
        <button className="card-button" onClick={proceedToNextCharacter(currentCardId, props.cards, Feedback.GOOD)}>Good</button>
        <button className="card-button" onClick={proceedToNextCharacter(currentCardId, props.cards, Feedback.EASY)}>Easy</button>
      </div>
    </>
  );
}