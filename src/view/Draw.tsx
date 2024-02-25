import React, { useState, useRef, Dispatch, SetStateAction } from "react";

import { Curtain } from "../component/curtain";
import {
  DrawingCanvas,
  DrawingCanvasRefProps,
  DrawingCanvasProps,
} from "../component/canvas";
import { Timer } from "../component/timer";

import { Card } from "../utils/card";
import { CharacterProps, CharacterInfo } from "../component/character";
import "../css/canvas.css";
import "../css/draw.css";
import { Views } from ".";

interface DrawViewProps {
  setView: Dispatch<SetStateAction<Views>>;
  setCorrect: Dispatch<SetStateAction<boolean[]>>;
  cards: Card<CharacterProps>[];
}

export const DrawView: React.FC<DrawViewProps> = (props: DrawViewProps) => {
  const [prediction, setPrediction] = useState(undefined);
  const [level, setLevel] = useState(0);
  const [active, setActive] = useState(false);

  const cards: Card<CharacterProps>[] = props.cards;

  const numberOfCards = cards.length;

  const [correct] = useState(new Array(numberOfCards));

  const canvasRef = useRef<DrawingCanvasRefProps>(null);

  function reset() {
    setPrediction(undefined);
    setActive(false);
  }

  let drawViewElement: JSX.Element = <></>;
  if (level > numberOfCards - 1) {
    props.setView(Views.Summary);
  } else {
    const currentCard = cards[level];
    const characterProps = currentCard?.card;

    const svgUrl = currentCard
      ? require(`../data/svgs/${characterProps?.svgCode}.svg`)
      : undefined;
    const drawingCanvasProps: DrawingCanvasProps = {
      backgroundImageUrl: svgUrl,
    };
    drawViewElement = (
      <>
        {characterProps && level < numberOfCards && (
          <>
            <Curtain
              character={cards[level]}
              isActive={active}
              setActive={setActive}
            />
            <div className="draw-wrapper">
              <Timer
                isActive={active}
                level={level}
                setLevel={setLevel}
                reset={reset}
              />
              <CharacterInfo {...characterProps} />
              <DrawingCanvas
                ref={canvasRef}
                drawingCanvasProps={drawingCanvasProps}
              />
            </div>
          </>
        )}
      </>
    );
  }

  return drawViewElement;
};
