import '../css/canvas.css';
import gridSvgUrl from '../data/grid.svg';
import { useState, useRef, forwardRef, useImperativeHandle, useEffect, MouseEvent, TouchEvent } from 'react';


export interface DrawingCanvasRefProps {
  clearCanvas: () => void,
  getImageData: () => ImageData | undefined
}

export interface DrawingCanvasProps {
  backgroundImageUrl?: string,
  showAnswer?: boolean,
}

interface DrawingCanvasForwardRefComponentProps {
  drawingCanvasProps: DrawingCanvasProps
}

/* eslint-disable react/prop-types */
// Disabling prop-types since we are already typing in the forwardref props
// If not disabled, it will complain prop validation is not set for `drawingCanvasProps`
export const DrawingCanvas = forwardRef<DrawingCanvasRefProps, DrawingCanvasForwardRefComponentProps>(function canvasComponent(canvasForwardRefProps: DrawingCanvasForwardRefComponentProps, ref) {
  const CANVAS_WIDTH_PX = 450;
  const CANVAS_HEIGHT_PX = 450;
  const [previousPoint, setPreviousPoint] = useState<Point>(); // previous coordinate
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>();
  const [isPainting, setIsPainting] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  
  const props: DrawingCanvasProps = canvasForwardRefProps.drawingCanvasProps; 
  // const setIsPainting = props.setIsPainting;
  // const isPainting = props.isPainting;

  function componentSetup() {

    if (!canvas || !canvas.current) {
      throw new Error("Canvas was not initialized properly");
    }

    canvas.current.width = CANVAS_WIDTH_PX;
    canvas.current.height = CANVAS_HEIGHT_PX;
    canvas.current.style.backgroundSize = 'cover';
    canvas.current.style.backgroundPosition = 'center';
    canvas.current.style.backgroundRepeat = 'no-repeat';
  }

  useEffect(componentSetup, [canvas, props.backgroundImageUrl]);

  useImperativeHandle(ref, () => {

    if (!canvas || !canvas.current) {
      throw new Error("Canvas was not initialized properly");
    }

    // get the offset of the drawing canvas from the page
    // needed to paint on the canvas in the correct location
    const canvasContext = canvas.current.getContext('2d');
    if (canvasContext) {
      setCanvasContext(canvasContext);
    }

    return {
      clearCanvas() {

        if (canvas && canvas.current && canvasContext) {
          const rect: DOMRect = canvas.current.getBoundingClientRect();
          canvasContext.clearRect(0, 0, rect.height, rect.width);
        }
      },
      getImageData() {

        if (canvasContext) {
          return canvasContext.getImageData(0, 0, CANVAS_HEIGHT_PX, CANVAS_WIDTH_PX);
        }

        return undefined;
      },
    }
  }, []);

  const redraw = function(context: CanvasRenderingContext2D, x: number, y: number) {

    if (previousPoint) {
      /**
       * Draw on canvas.
       * 
       * @param context The canvas context to draw on.
       * @param x Last X-coordinate that mouse lands on.
       * @param y Last Y-coordinate that mouse lands on.
       * 
       */
      context.strokeStyle = "#FFFFFF";
      context.lineJoin = "round";
      context.lineWidth = 20;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(previousPoint.x, previousPoint.y);
      context.lineTo(x, y);
      context.stroke();
    }
  };

  function onMouseDown(event: MouseEvent) {
    /**
      * Mouse begins drawing on canvas.
      * 
      */
    if (canvas && canvas.current) {
      const rect = canvas.current.getBoundingClientRect();
      const x: number = event.clientX - rect.left - 13; // since the stroke length is -20px, we add -13px to center it
      const y: number = event.clientY - 1 - rect.top;
      const point: Point = {x, y};

      setPreviousPoint(point);
      setIsPainting(true);
    }
        
  }

  function onMouseUp() {
    /**
      * Mouse stops drawing on canvas.
      * 
      */
    setIsPainting(false);
    setPreviousPoint(undefined);
  }

  function onMouseMove(event: MouseEvent) {
    /**
      * Mouse is drawing on canvas.
      * 
      */
    if (isPainting && canvas && canvas.current && canvasContext) {

      const rect = canvas.current.getBoundingClientRect();

      const x = event.clientX - rect.left - 13; // since the stroke length is -20px, we add -13px to center it
      const y = event.clientY - rect.top;
      const point: Point = {x, y};

      redraw(canvasContext, x, y);
      setPreviousPoint(point);
    }
  }

  function onMouseLeave() {

    /**
      * Mouse leaves drawing canvas.
      * 
      */
    setPreviousPoint(undefined);
  }

  function onTouchStart(event: TouchEvent) {

    if (canvas && canvas.current) {
            
      const rect: DOMRect = canvas.current.getBoundingClientRect();

      const x = event.targetTouches[0].clientX - rect.left - 13; // since the stroke length is -20px, we add -13px to center it
      const y = event.targetTouches[0].clientY - 1 - rect.top;
      const point: Point = {x, y};


      setPreviousPoint(point);
      setIsPainting(true);
    }
  }

  function onTouchMove(event: TouchEvent) {
    /**
      * Touch is drawing on canvas.
      * 
      */
    if (isPainting && canvas && canvas.current && canvasContext) {

      const rect: DOMRect = canvas.current.getBoundingClientRect();

      const x = event.targetTouches[0].clientX - rect.left - 13; // since the stroke length is -20px, we add -13px to center it
      const y = event.targetTouches[0].clientY - 1 - rect.top;
      const point: Point = {x, y};
      redraw(canvasContext, x, y);
      setPreviousPoint(point);  
    }
  }

  function onTouchEnd() {
    /**
      * Touch stops drawing on canvas.
      * 
      */
    setIsPainting(false);
    setPreviousPoint(undefined);
  }

  return (
    <>
      <div onMouseUp={() => setIsPainting(false)}>
        <canvas 
          id="drawingCanvas"
          ref={canvas}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{backgroundImage: `url('${props.showAnswer ? props.backgroundImageUrl : gridSvgUrl}')`}}
        >
        </canvas>
      </div>
    </>
  )
});

/**
 * Point objects are used to indicate a coordinate on the drawing canvas.
 * 
 * @param x X-coordinate
 * @param y Y-coordinate
 * 
 * @return Point object
 */
interface Point {
    x: number;
    y: number;
}
