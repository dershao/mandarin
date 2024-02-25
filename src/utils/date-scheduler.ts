
import { CardScheduler, SchedulerAlgorithm } from './scheduler';
import { Card } from './card';

export class DateScheduler<T> extends CardScheduler<T> implements SchedulerAlgorithm<T> {

  private dateCompareFn: (a: Card<T>, b: Card<T>) => number = (a:  Card<T>, b: Card<T>) => {

    if (a.nextDate < b.nextDate) {
      return -1;
    } else if (a.nextDate > b.nextDate) {
      return 1;
    }

    return 0;
  }

  constructor(cards: Card<T>[]) {
    super(cards);
  }

  getNextCard(): Card<T> | undefined {
    this.cards.sort(this.dateCompareFn);

    // this should never be array out of bounds because
    // the scheduler class cannot instantiate if array length < 1
    const nextCard = this.cards[0];
    const currentDate = new Date();
    const nextDate = new Date(nextCard.nextDate);

    if (nextDate <= currentDate) {

      return nextCard;    
    }

    return undefined;
  }

  addCard(card: Card<T>) {

    this.cards.push(card);
    this.cards.sort(this.dateCompareFn);
  }

  removeCard(card: Card<T>) {

    this.cards = this.cards.filter((element) => element.getId() != card.getId());
    this.cards.sort(this.dateCompareFn);
  }
}
