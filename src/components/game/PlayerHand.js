import React from 'react';

class PlayerHand extends React.Component {

    renderHand(hand, i) {
        return (
            <div className="cards">
                <p>Value: {hand.getValue()}</p>
                {hand.getCards().map((card, j) => (
                    <img className="card" src={card.image} alt={card.code} key={j}></img>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="hand">
                    {this.props.hands.map((hand, i) => (
                        <div key={i}>
                            {this.renderHand(hand, i)}
                        </div>
                    ))}
                </div>
                <h3>Your Hand</h3>
            </div>
        );
    }
}

export default PlayerHand;