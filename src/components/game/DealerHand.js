import React from 'react';

class DealerHand extends React.Component {

    render() {
        return (
            <div className="row">
                <h3>Dealer's Hand</h3>
                <div className="cards">
                    {this.props.hand.getCards().map((card, i) => (
                        <img className="card" src={card.image} alt={card.code} key={i}></img>
                    ))}
                </div>
                <p><span style={{fontWeight: "bold"}}>Value:</span> {this.props.hand.getValue()} {this.props.hand.getStatus()}</p>
            </div>
        );
    }
}

export default DealerHand;