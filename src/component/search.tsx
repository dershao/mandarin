import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { SearchResult } from '../view/Catalog';
import { Card } from './card'; 

export interface CatalogSearchProps {
  onSearchItem: (searchTerm: string) => void;
  setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
}

export function CatalogSearch(props: CatalogSearchProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const onSearchItem = props.onSearchItem;
  const setShowErrorMessage = props.setShowErrorMessage;

  useEffect(() => {
    onSearchItem(searchTerm);
  }, [searchTerm]);

  return <>
    <div className="search-wrapper">
      <input
        id="search"
        type="text"
        placeholder="Search..."
        onChange={e => {
          setShowErrorMessage(false);
          setSearchTerm(e.target.value)
        }}
        value={searchTerm}
      />
    </div>
  </>
}

export interface CatalogResultsProps {
  results: SearchResult[];
  selectedCards: string[];
  setSelectedCards: Dispatch<SetStateAction<string[]>>;
  setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
}

export function CatalogResults(props: CatalogResultsProps) {

  const setSelectedCards = props.setSelectedCards;
  const setShowErrorMessage = props.setShowErrorMessage;

  function addCard(setSelectedCards: Dispatch<SetStateAction<string[]>>, setShowErrorMessage: Dispatch<SetStateAction<boolean>>, character: string) {

    return (event: React.MouseEvent<HTMLElement>) => {

      setShowErrorMessage(false);
      setSelectedCards(prevSelectedCards => ([...prevSelectedCards, character]))
    }
  }

  function removeCard(setSelectedCards: Dispatch<SetStateAction<string[]>>, character: string) {

    return (event: React.MouseEvent<HTMLElement>) => {

      setSelectedCards(prevSelectedCards => (prevSelectedCards.filter(c => c !== character)))
    }
  }

  return <>
    <div className="catalog-results">
      {props.results.map((result) => {

        const selected = props.selectedCards.includes(result.character) ? true : false;
        return <>
          <Card cardName={result.character} 
            cardContent={[result.pinyin, result.definition]}
            selected={selected} 
            addCard={addCard(setSelectedCards, setShowErrorMessage, result.character)}
            removeCard={removeCard(setSelectedCards, result.character)}
          />
        </> 
      })}
    </div>
  </>
}