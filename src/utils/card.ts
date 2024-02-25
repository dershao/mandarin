import { today, addDaysToDate, addMinuteToDate } from './date';

export class Card<T> {

  public card: T;
  public id: string;
  public interval: number;
  public easeFactor: number;
  public repetitions: number;
  public graduated: boolean;
  public nextDate: Date;
  public easeFactorMinimum: number;
  public easeFactorDecayRate: number;

  constructor(cardProps: CardProps<T>, cardMetadata: CardMetadata) {

    this.card = cardProps.card;
    this.id = cardProps.id;
    this.interval = cardProps.interval;
    this.easeFactor = cardProps.easeFactor;
    this.repetitions = cardProps.repetitions;
    this.graduated = cardProps.graduated;
    this.nextDate = cardProps.nextDate;

    this.easeFactorMinimum = cardMetadata.easeFactorMinimum ?? 1.3;
    this.easeFactorDecayRate = cardMetadata.easeFactorDecayRateDefault ?? 0.2;
  }

  public updateCardBasedOnFeedback(feedback: Feedback) {

    this.graduated ? this.graduatedCardUpdateBasedonFeedback(feedback) : this.learningPhaseCardUpdateBasedOnFeedback(feedback);
  }

  private graduatedCardUpdateBasedonFeedback(feedback: Feedback) {
    switch (feedback) {
    case Feedback.AGAIN:
      this.easeFactor = this.easeFactor > this.easeFactorMinimum ? this.easeFactor - this.easeFactorDecayRate : this.easeFactor;
      this.graduated = false;
      this.nextDate = addMinuteToDate(new Date(), 1);
      break;
    case Feedback.GOOD:
      this.nextDate = addDaysToDate(today(), this.interval);
      this.interval = Math.ceil(this.interval * this.easeFactor);
      break;
    case Feedback.EASY:
      // TODO
      break;
    }
  }
  
  private learningPhaseCardUpdateBasedOnFeedback(feedback: Feedback) {
  
    switch (feedback) {
    case Feedback.AGAIN:
      // No updates, will test this card again
      break;
    case Feedback.GOOD:
      this.repetitions += 1;
      if (this.repetitions === 3) {
        this.repetitions = 0;
        this.graduated = true;
        this.nextDate = addDaysToDate(today(), this.interval);
      } else {
        this.nextDate = addMinuteToDate(new Date(), 10);
      }
      break;
    case Feedback.EASY:
      // TODO
      break;
    }
  }

  // TODO: Add validations
  public getCard(): T { return this.card; }

  public setCard(card: T) { this.card = card; } 
  
  public getId(): string { return this.id; }

  public setId(id: string) { this.id = id; } 

  public getInterval(): number { return this.interval }

  public setInterval(interval: number) { this.interval = interval  } 

  public getEaseFactor(): number { return this.easeFactor }

  public setEaseFactor(easeFactor: number) { this.easeFactor = easeFactor } 

  public getRepetitions(): number { return this.repetitions }

  public setRepetitions(repetitions: number) { this.repetitions = repetitions } 

  public getGraduated(): boolean { return this.graduated }

  public setGraduated(graduated: boolean) { this.graduated = graduated } 

  public getNextDate(): Date { return this.nextDate }

  public setNextDate(nextDate: Date) { this.nextDate = nextDate } 
}

export interface CardProps<T> {
  card: T,
  id: string,
  interval: number;
  easeFactor: number;
  repetitions: number;
  graduated: boolean;
  nextDate: Date;
}

export interface CardMetadata {
  easeFactorMinimum?: number;
  easeFactorDecayRateDefault?: number;
}

export enum Feedback {

  AGAIN,
  GOOD,
  EASY
}

/**
 * Wrapper function for creating Card objects
 * 
 */
export function createCard<T>(card: T, id: string, cardPropsInput: {
  interval?: number,
  easeFactor?: number,
  repetitions?: number,
  graduated?: boolean,
  nextDate?: Date
}): Card<T> {

  return new Card({
    card: card,
    id: id,
    interval: cardPropsInput.interval ?? 1,
    easeFactor: cardPropsInput.easeFactor ?? 2.5,
    repetitions: cardPropsInput.repetitions ?? 0,
    graduated: cardPropsInput.graduated ?? false,
    nextDate: cardPropsInput.nextDate ?? new Date()
  },
  {
    easeFactorMinimum: 1.3,
    easeFactorDecayRateDefault: 0.2
  });
}

export function createCardFromObj(obj: object) {

  if (!isCardType(obj)) {

    throw new Error("Argument is not a valid Card type");
  }

  const card = obj as Card<unknown>;

  return new Card({
    card: card.card,
    id: card.id,
    interval: card.interval,
    easeFactor: card.easeFactor,
    repetitions: card.repetitions,
    graduated: card.graduated,
    nextDate: card.nextDate
  }, {
    easeFactorMinimum: card.easeFactorMinimum,
    easeFactorDecayRateDefault: card.easeFactorDecayRate
  });
}

export function isCardType(obj: object): boolean {

  if ("card" in obj &&
    "id" in obj &&
    "interval" in obj &&
    "easeFactor" in obj &&
    "repetitions" in obj &&
    "graduated" in obj &&
    "nextDate" in obj &&
    "easeFactorMinimum" in obj &&
    "easeFactorDecayRate" in obj) {

    return true;
  }

  return false;
}