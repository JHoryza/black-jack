import React from 'react';

class DealerHand extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <h3>Dealer's Hand</h3>
                <div className="hand">
                    {this.props.hand.map((card, i) => (
                        <img className="card" src={card.image} alt={card.code} key={i}></img>
                    ))}
                    <p>{this.props.handValue}</p>
                </div>
            </div>
        );
    }
}

export default DealerHand;