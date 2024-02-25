import { useState, Dispatch, SetStateAction } from "react";
import { Views } from ".";
import { CharacterProps } from "../component/character";
import { CatalogResults, CatalogSearch } from "../component/search";
import { Card, createCard } from "../utils/card";
import { CharacterDictionary } from "../data";

import characterJson from "../data/hsk_characters.json";

import "../css/catalog.css";

export interface SearchResult {
  character: string;
  definition: string;
  pinyin: string;
}

export interface CatalogViewProps {
  setView: Dispatch<SetStateAction<Views>>;
  setCards: Dispatch<SetStateAction<Card<CharacterProps>[]>>;
}

export function CatalogView(props: CatalogViewProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const setCards = props.setCards;
  const setView = props.setView;

  const onSearchItem = (searchTerm: string) => {
    if (searchTerm === "") {
      setSearchResults([]);
      return;
    }

    // if there are multiple search terms inputted
    const searchTerms = searchTerm.split(" ");

    const filteredCharacters: SearchResult[] = Object.keys(characterJson)
      .filter((character) => {
        const charData = characterJson[character as keyof typeof characterJson];

        for (const term of searchTerms) {
          if (
            charData.definition.includes(term.toLowerCase()) ||
            (charData.pinyin.length > 0 &&
              charData.pinyin[0].includes(term.toLowerCase()))
          ) {
            continue;
          } else {
            return false;
          }
        }

        return true;
      })
      .map((character) => {
        const charData = characterJson[character as keyof typeof characterJson];

        return {
          character: character,
          definition: charData.definition,
          pinyin: charData.pinyin[0],
        };
      });

    // TODO paginate results
    const firstTenResults = filteredCharacters.slice(0, 10);
    setSearchResults(firstTenResults);
  };

  const startSessionWithCards = (event: React.MouseEvent<HTMLElement>) => {
    if (selectedCards.length === 0) {
      setShowErrorMessage(true);
    } else {
      const cards = selectedCards.map((character_unicode) => {
        const character: CharacterDictionary =
          characterJson[character_unicode as keyof typeof characterJson];
        const characterProps: CharacterProps = {
          pinyin: character.pinyin,
          definition: character.definition,
          svgCode: character_unicode.charCodeAt(0).toString(),
        };

        return createCard<CharacterProps>(
          characterProps,
          character_unicode,
          {}
        );
      });
      setCards(cards);
      setView(Views.Practice);
    }
  };

  return (
    <div className="catalog">
      <div className="catalog-search">
        <h2>Customize your Flash Cards</h2>
        <CatalogSearch
          onSearchItem={onSearchItem}
          setShowErrorMessage={setShowErrorMessage}
        />
        <div className="button-group">
          <button className="button" onClick={startSessionWithCards}>
            Start
          </button>
        </div>
        {showErrorMessage && (
          <div id="error-message">Must select at least one character</div>
        )}
      </div>
      <CatalogResults
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        setShowErrorMessage={setShowErrorMessage}
        results={searchResults}
      />
    </div>
  );
}
