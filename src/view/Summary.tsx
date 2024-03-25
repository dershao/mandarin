import React, { Dispatch, SetStateAction } from "react";
import { Views } from ".";
import { Card } from "../utils/card";
import { CharacterImage, CharacterProps } from "../component/character";
import "../css/summary.css";
import { Header } from "../component/header";

interface SummaryViewProps {
  setView: Dispatch<SetStateAction<Views>>;
  cards: Card<CharacterProps>[];
  correct: boolean[];
}

function getCorrectImage(isCorrect: boolean) {
  return isCorrect ? (
    <img className="correct-img" src={`/correct.png`} alt={`Correct`} />
  ) : (
    <img className="correct-img" src={`/incorrect.png`} alt={`Incorrect`} />
  );
}

export const SummaryView: React.FC<SummaryViewProps> = (
  props: SummaryViewProps
) => {
  const cardsCorrectPair = props.cards.map((card, i) => {
    return {
      card: card.card,
      correct: props.correct[i],
    };
  });

  return (
    <>
      <Header />
      <div id="summary-wrapper">
        {cardsCorrectPair.map((cardPair) => (
          <div className="summary-card" key={cardPair.card.svgCode}>
            <CharacterImage {...cardPair.card} />
            {getCorrectImage(cardPair.correct)}
          </div>
        ))}
      </div>
      <div id="button-wrapper">
        <button
          className="card-button"
          onClick={() => {
            props.setView(Views.Options);
          }}
        >
          New set
        </button>
        <button className="card-button" onClick={() => {
          props.setView(Views.Practice);
        }}>Retry</button>
      </div>
    </>
  );
};
