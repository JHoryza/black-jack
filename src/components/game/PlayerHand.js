import React from 'react';

class PlayerHand extends React.Component {

    renderHand(hand, i) {
        return (
            <div>
                <p>
                    {i === this.props.activeHand ? <span style={{ fontWeight: "bolder", color: "#ffc857" }}>{"> "}</span> : ""}
                    <span style={{ fontWeight: "bold" }}>Value:</span> {hand.getValue()} {hand.getStatus()}
                    {i === this.props.activeHand ? <span style={{ fontWeight: "bolder", color: "#ffc857" }}>{" <"}</span> : ""}
                    <br />
                    <span style={{ fontWeight: "bold" }}>Bet:</span> ${hand.getBet()}
                </p>
                <div className="cards">
                    {hand.getCards().map((card, j) => (
                        <img className="card" src={card.image} alt={card.code} key={j}></img>
                    ))}
                </div>
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