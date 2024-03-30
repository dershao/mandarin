import './App.css';

import { useState } from "react";
import { CharacterProps } from './component/character';
import { Views, MainView, PracticeView, OptionsView, CatalogView } from './view';
import { Card } from './utils/card'; 
import { DrawView } from './view/Draw';
import { SummaryView } from './view/Summary';
import { PromptView } from './view/Prompt';

function App() {

  const [cards, setCards] = useState<Card<CharacterProps>[]>([]);
  const [correct, setCorrect] = useState(new Array(cards.length));
  const [view, setView] = useState<Views>(Views.Main);

  return (
    <div className="App">
      <section className="App-body">
        {view === Views.Main && <MainView setView={setView} setCards={setCards} />}
        {view === Views.Prompt && <PromptView setView={setView} setCards={setCards} />}
        {view === Views.Options && <OptionsView setView={setView} setCards={setCards} />}
        {view === Views.Practice && <PracticeView setView={setView} cards={cards} setCards={setCards} />}
        {view === Views.Catalog && <CatalogView setView={setView} setCards={setCards} />}
        {view === Views.Draw && <DrawView setView={setView} setCorrect={setCorrect} cards={cards} />}
        {view === Views.Summary && <SummaryView setView={setView} correct={correct} cards={cards}/>}
      </section>
    </div>
  );
}

export default App;
