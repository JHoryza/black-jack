import React from 'react';

class PlayerHand extends React.Component {

    hand(cards) {
        return (
            <div className="cards">
                <p>Value: {this.props.handValue}</p>
                {this.props.hand.map((card, i) => (
                    <img className="card" src={card.image} alt={card.code} key={i}></img>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="hand">
                    {this.hand()}
                </div>
                <h3>Your Hand</h3>
            </div>
        );
    }
}

export default PlayerHand;