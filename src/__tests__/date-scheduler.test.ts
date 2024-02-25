import { describe, expect, test } from '@jest/globals';
import { Card, createCard } from '../utils/card';
import { DateScheduler } from '../utils/date-scheduler';

describe('date scheduler', () => {

  describe(`stores cards correctly`, () => {

    const cards = [
      createCard({}, 'card1', {nextDate: new Date(0)}),
      createCard({}, 'card2', {nextDate: new Date(1)}),
    ];

    const dateScheduler: DateScheduler<unknown> = new DateScheduler<unknown>(cards);

    const getCards = dateScheduler.getCards();

    test('can retrieve cards stored as expected', () => {
      expect(getCards.length).toBe(cards.length);
    });
    
    test('can get next card', () => {

      const nextCard = dateScheduler.getNextCard();
      expect(nextCard?.id).toBe('card1');
    });

    test('update next card based on date', () => {

      cards[0].nextDate = new Date(1000);
      dateScheduler.setCards(cards);
      const nextCard = dateScheduler.getNextCard();

      expect(nextCard?.id).toBe('card2');
    });
  });
});
