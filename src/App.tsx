import './App.css';

import { useState, useEffect } from "react";

import { Header } from './component/header';
import { CharacterProps, isCardCharacterPropsArray } from './component/character';
import { Views, MainView, PracticeView, OptionsView, CatalogView } from './view';
import { Card } from './utils/card'; 
import { LocalStorageSessionManager } from './utils/session-manager';
import { DrawView } from './view/Draw';
import { SummaryView } from './view/Summary';

function App() {

  const sessionManager = new LocalStorageSessionManager<Card<CharacterProps>[]>(undefined, isCardCharacterPropsArray);
  const currentData = sessionManager.getAllData();

  const [cards, setCards] = useState<Card<CharacterProps>[]>(currentData && currentData["Default"] ? currentData["Default"] : []);
  const [sessionMap, setSessionMap] = useState<Record<string, Card<CharacterProps>[]>>(currentData);
  const [correct, setCorrect] = useState(new Array(cards.length));

  const [view, setView] = useState<Views>(Views.Options);


  useEffect(() => {

    const currentData = sessionManager.getAllData();
    sessionManager.upsert("Default", cards);
    setSessionMap(currentData);
  }, [cards]);

  return (
    <div className="App">
      <header className="App-header">
        <Header setView={setView}/>
      </header>
      <section className="App-body">
        {view === Views.Main && <MainView setView={setView} />}
        {view === Views.Options && <OptionsView setView={setView} setCards={setCards} sessionMap={sessionMap} />}
        {view === Views.Practice && <PracticeView setView={setView} cards={cards} setCards={setCards} />}
        {view === Views.Catalog && <CatalogView setView={setView} setCards={setCards} />}
        {view === Views.Draw && <DrawView setView={setView} setCorrect={setCorrect} cards={cards} />}
        {view === Views.Summary && <SummaryView setView={setView} correct={correct} cards={cards}/>}
      </section>
    </div>
  );
}

export default App;
