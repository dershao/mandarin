import { describe, expect, test } from '@jest/globals';
import { Feedback, createCard } from '../utils/card';
import { today } from '../utils/date';

describe('graduated cards', () => {

  describe(`with ${Feedback.AGAIN} feedback`, () => {
    const card = createCard({}, 'card1', {});
    card.setGraduated(true);

    const previousEaseFactor = card.getEaseFactor();
        
    card.updateCardBasedOnFeedback(Feedback.AGAIN);

    test('reverts back to learning phase', () => {
      expect(card.getGraduated()).toBe(false);
    });

    test('reduced ease factor', () => {
      expect(card.getEaseFactor()).toBe(previousEaseFactor - 0.2);
    });

    test('new date is set correctly', () => {
      const currentNextDate: Date = card.getNextDate();
      expect(currentNextDate.getMinutes() - new Date().getMinutes()).toBeLessThanOrEqual(2);
    });
  });

  describe(`with ${Feedback.GOOD} feedback`, () => {
    const card = createCard({}, 'card1', {});
    card.setGraduated(true);
    const currentInterval = card.getInterval();
        
    card.updateCardBasedOnFeedback(Feedback.GOOD);

    test('increase interval based on ease factor', () => {
      expect(card.getInterval()).toBe(Math.ceil(card.getEaseFactor() * currentInterval));
    });

    test('new date is set correctly', () => {
      const expectedNewDate = new Date(today());
      expectedNewDate.setDate(expectedNewDate.getDate() + currentInterval);
      expect(card.getNextDate()).toStrictEqual(expectedNewDate);
    });
  });
});

describe('learning phase cards', () => {

  describe(`with ${Feedback.AGAIN} feedback`, () => {
    const card = createCard({}, 'card1', {});
    card.setGraduated(false);

    card.updateCardBasedOnFeedback(Feedback.AGAIN);

    test('new date is set correctly', () => {
      const currentNextDate: Date = card.getNextDate();
      expect(currentNextDate.getMinutes() - new Date().getMinutes()).toBeLessThanOrEqual(2);
    });
  });

  describe(`with ${Feedback.GOOD} feedback`, () => {
    const card = createCard({}, 'card1', {});
    card.setGraduated(false);
        
    card.updateCardBasedOnFeedback(Feedback.GOOD);

    test('increases the repetitions', () => {
      expect(card.getRepetitions()).toBe(1);
    });

    test('increases new date by 10 minutes', () => {
      const currentNextDate: Date = card.getNextDate();
      expect(currentNextDate.getMinutes() - new Date().getMinutes()).toBeLessThanOrEqual(10);
    });
  });
});

describe('Graduating a card', () => {

  const card = createCard({}, 'card1', {});
  card.setGraduated(false);
  const currentInterval = card.getInterval();

  card.updateCardBasedOnFeedback(Feedback.GOOD);
  card.updateCardBasedOnFeedback(Feedback.GOOD);
  card.updateCardBasedOnFeedback(Feedback.GOOD);


  test('graduates card', () => {
    expect(card.getGraduated()).toBe(true);
    expect(card.getRepetitions()).toBe(0);
  });

  test('new date is set correctly', () => {
    const expectedNewDate = new Date(today());
    expectedNewDate.setDate(expectedNewDate.getDate() + currentInterval);
    expect(card.getNextDate()).toStrictEqual(expectedNewDate);
  });
})