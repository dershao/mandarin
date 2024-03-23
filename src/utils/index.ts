export * from './scheduler';
export * from './date-scheduler';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function setStateGenericEventHandlerWrapper(stateUpdateInputs: [state: any, setState: (state: any) => void][]) {

  return (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    stateUpdateInputs.forEach((setStateInput) => {

      const state: any = setStateInput[0];
      const setState: (state: any) => void = setStateInput[1];

      setState(state);
    })
  }
}

export function getRandomCharacters(inputArray: number[], numberOfValues: number): string[] {
  const randomIndices: number[] = [];
  
  while (randomIndices.length < numberOfValues) {
    const randomIndex = Math.floor(Math.random() * inputArray.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }
  
  const randomValues: number[] = randomIndices.map(index => inputArray[index]);
  
  const unicodeValues: string[] = randomValues.map(value =>
    String.fromCharCode(value)
  );
  
  return unicodeValues;
}
  