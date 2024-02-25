import '../css/card.css'

export interface CardProps {
  cardName: string;
  cardContent: string[];
  selected: boolean;
  addCard: (event: React.MouseEvent<HTMLElement>) => void;
  removeCard: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Card = (props: CardProps) => {

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>{props.cardName}</h2>
        </div>
        <div className="card-content">
          <em>{props.cardContent[0]}</em>
          <p>{props.cardContent[1]}</p>
          <div className='add-button'>
            {props.selected ? 
              <div className='card-button card-button-remove' onClick={props.removeCard}>Remove</div> :
              <div className='card-button card-button-add' onClick={props.addCard}>Add</div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
