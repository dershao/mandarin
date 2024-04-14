import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import * as tf from "@tensorflow/tfjs";

import { Curtain } from "../component/curtain";
import {
  DrawingCanvas,
  DrawingCanvasRefProps,
  DrawingCanvasProps,
} from "../component/canvas";
import { Card } from "../utils/card";
import { CharacterProps, CharacterInfo } from "../component/character";
import "../css/canvas.css";
import "../css/draw.css";
import { Views } from ".";
import { DrawPanel } from '../component/draw-panel';
import encoder_json from '../data/hsk3_encoder.json';

interface DrawViewProps {
  setView: Dispatch<SetStateAction<Views>>;
  setCorrect: Dispatch<SetStateAction<boolean[]>>;
  cards: Card<CharacterProps>[];
  model: tf.LayersModel;
}

function getPredictionText(prediction: string, isDrawing: boolean, isCorrect: boolean) {
  if (!isDrawing) return "...";

  if (prediction) {
    if (isCorrect) {
      return `You are drawing ${prediction}!`;
    } else {
      return `I think you are drawing ${prediction} ...`;
    }
  }

  return "...";
}

export const DrawView: React.FC<DrawViewProps> = (props: DrawViewProps) => {

  const encoder = encoder_json as unknown as Record<string, number>;
  const cards: Card<CharacterProps>[] = props.cards;
  const numberOfCards = cards.length;

  const [level, setLevel] = useState(0);
  const [active, setActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState({
    prediction: "",
    isCorrect: false
  });
  const [correct] = useState(new Array(numberOfCards));

  const canvasRef = useRef<DrawingCanvasRefProps>(null);

  function addImageToDrawHistory(imageBitmap: ImageBitmap, height: number, width: number) {
    const tempCanvas = document.createElement('canvas') as HTMLCanvasElement;
    tempCanvas.height = height;
    tempCanvas.width = width;

    document.getElementsByClassName('draw-history')[0].appendChild(tempCanvas);
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(imageBitmap, 0, 0, width, height);
    return tempCtx.getImageData(0, 0, width, height);
  }

  async function fetchClassifyResults(imgData: ImageData | undefined, model: tf.LayersModel) {

    function sleep() {
      return new Promise(res => setTimeout(res, 1000));
    }

    if (!imgData) {
      console.error(`No image data was retrieved from canvas`);
      return;
    }

    const imageBitmap = await createImageBitmap(imgData)

    const resizedImageData = addImageToDrawHistory(imageBitmap, 64, 64);
    
    const image = Array.from(resizedImageData.data);

    const image_tensor = tf.tensor(image);
    const resulting_image = image_tensor.reshape([1, 64, 64, 4]).slice([0, 0, 0, 2], [1, 64, 64, 1]);
    const model_input = tf.fill([1, 64, 64, 1], 255).sub(resulting_image).div(255);
    const model_output = model.predict(model_input) as tf.Tensor<tf.Rank>;
    const top_values = tf.topk(model_output, 10);
    
    const predictions = Array.from(top_values.indices.dataSync().map((index): number => {

      return encoder[`${index}`]
    }));

    console.debug(`Predictions: ${JSON.stringify(predictions)}`);

    const currentCardCode = parseInt(cards[level].card.svgCode);

    for (const prediction of predictions) {
      if (prediction === currentCardCode) {
        correct[level] = true;
        setPrediction(prevState => {

          return {...prevState, ...{prediction: String.fromCharCode(prediction), isCorrect: true}}
        });
        await sleep()
        setLevel(level + 1);
        reset();
        return
      }
    }

    setPrediction(prevState => {

      return {...prevState, ...{prediction: String.fromCharCode(predictions[0]), isCorrect: false}}
    });
  }

  function reset() {
    setActive(false);
    setPrediction(prevState => {

      return {...prevState, ...{prediction: "", isCorrect: false}}
    });
    clearDrawHistory();
  }

  function clearDrawHistory() {
    const drawHistoryElement = document.getElementsByClassName('draw-history');
    if (drawHistoryElement.length > 0) {
      drawHistoryElement[0].innerHTML = ''
    }
  }

  function clearCanvasHandler() {
    setIsDrawing(false);
    setPrediction(prevState => {
      return {...prevState, ...{prediction: ""}}
    })
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

    const drawHistoryJsx = <>
      <div className='draw-history'></div>
    </>

    drawViewElement = (
      <>
        <DrawPanel characterProps={characterProps} 
          clearCanvas={() => canvasRef.current?.clearCanvas()}
          setView={props.setView}
          active={active}
          level={level}
          setLevel={setLevel}
          reset={reset}
        />
        {characterProps && level < numberOfCards && (
          <>
            <Curtain
              character={cards[level]}
              isActive={active}
              setActive={setActive}
            />
            <div className="draw-wrapper">
              <CharacterInfo {...characterProps} />
              <div className="canvas-wrapper" onMouseDown={() => setIsDrawing(true)} onTouchEnd={() => setIsDrawing(true)}>
                <DrawingCanvas
                  ref={canvasRef}
                  drawingCanvasProps={drawingCanvasProps}
                />
              </div>
              <div className='bottom'>
                <button className={isDrawing ? "card-button" : "card-button-disabled"} onClick={() => fetchClassifyResults(canvasRef?.current?.getImageData(), props.model)}>Submit</button>
                <button className="card-button" onClick={clearCanvasHandler}>Clear</button>
              </div>
              {drawHistoryJsx}
            </div>
            <div className="text-bubble-wrapper">
              <div className="text-bubble">
                {getPredictionText(prediction.prediction, isDrawing, prediction.isCorrect)}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return drawViewElement;
};
