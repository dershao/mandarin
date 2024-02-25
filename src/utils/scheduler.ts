import { Card } from './card';

/**
 * Base class for scheduling cards
 */
export abstract class CardScheduler<T> {
  protected cards: Card<T>[];
  
  constructor(cards: Card<T>[]) {

    if (cards && cards.length === 0) {
      throw new Error('Must provide at least one card for scheduling');
    }

    this.cards = cards;
  }
  
  getCards(): Card<T>[]{
    return this.cards;
  }
  
  setCards(cards: Card<T>[]): void {
    this.cards = cards;
  }
}

/**
 * Example Scheduler
 * Scheduler returns the next Card in the given Card array
 */
export class SequentialScheduler<T> extends CardScheduler<T> implements SchedulerAlgorithm<T> {

  private sequence: number;

  constructor(cards: Card<T>[], sequence: number) {
    super(cards);

    this.sequence = sequence;
  }

  getNextCard(): Card<T> {

    const nextCard: Card<T> = this.cards[this.sequence % this.cards.length];

    return nextCard;
  }
}

export interface SchedulerAlgorithm<T> {
  getNextCard: () => Card<T> | undefined;
}
