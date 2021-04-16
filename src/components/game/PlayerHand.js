import React from 'react';

class PlayerHand extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="hand">
                    <p>{this.props.handValue}</p>
                    {this.props.hand.map((card, i) => (
                        <img className="card" src={card.image} alt={card.code} key={i}></img>
                    ))}
                </div>
                <h3>Your Hand</h3>
            </div>
        );
    }
}

export default PlayerHand;