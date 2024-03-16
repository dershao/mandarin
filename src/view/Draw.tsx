import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import axios from 'axios';

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
  const [level, setLevel] = useState(0);
  const [active, setActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [correct] = useState(new Array(3));

  const cards: Card<CharacterProps>[] = props.cards;
  const numberOfCards = cards.length;

  const canvasRef = useRef<DrawingCanvasRefProps>(null);

  function fetchClassifyResults(imgData: ImageData | undefined) {

    if (!imgData) {
      console.error(`No image data was retrieved from canvas`);
      return;
    }

    // TODO: This should be set from environment variables
    const serverUrl = 'http://localhost:5000/predict';
    const image = Array.from(imgData.data)

    axios({
      method: 'post',
      url: serverUrl,
      data: {
        data: {
          type: "image",
          attributes: {
            image: image,
            channels: 4
          }
        }
      }
    }).then((res) => {
      const currentCardCode = parseInt(cards[level].card.svgCode);
      const predictions = res.data.predictions;

      for (const prediction of predictions) {
        if (prediction === currentCardCode) {
          correct[level] = true;
          setLevel(level + 1);
          reset();
        }
      }
    }).catch((err) => {
      console.error(`Error when calling ${serverUrl}, ${err}`);
    });
  }

  function reset() {
    setActive(false);
  }

  function clearCanvasHandler() {
    setIsDrawing(false);
    canvasRef.current?.clearCanvas();
  }

  let drawViewElement: JSX.Element = <></>;
  if (level > numberOfCards - 1) {
    props.setCorrect(correct);
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
              <div className="canvas-wrapper" onMouseDown={() => setIsDrawing(true)} onTouchEnd={() => setIsDrawing(true)}>
                <DrawingCanvas
                  ref={canvasRef}
                  drawingCanvasProps={drawingCanvasProps}
                />
              </div>
              <div className='bottom'>
                <button className={isDrawing ? "card-button" : "card-button-disabled"} onClick={() => fetchClassifyResults(canvasRef?.current?.getImageData())}>Submit</button>
                <button className="card-button" onClick={clearCanvasHandler}>Clear</button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return drawViewElement;
};
