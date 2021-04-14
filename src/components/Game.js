import '../css/Game.css'
import Button from 'react-bootstrap/Button'
import React from 'react';

const DEFAULT = 0;
const PLAY_GAME = 1;

const DEALER = 0;
const PLAYER = 1;

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameState: DEFAULT,
            deckId: "",
            dealerHand: [],
            playerHand: [],
            dealerCardVal: 0,
            playerCardVal: 0
        };
        this.startGame = this.startGame.bind(this);
        this.drawCard = this.drawCard.bind(this);
    }

    startGame() {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(
            res => res.json()).then(
                result => {
                    this.setState({ gameState: PLAY_GAME, deckId: result["deck_id"] }, function() {
                        this.drawCard(DEALER, 1);
                        this.drawCard(PLAYER, 2);
                    });
                });
    }

    drawCard(hand, count) {
        fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=${count}`).then(
            res => res.json()).then(
                result => {
                    switch (hand) {
                        case DEALER:
                            let dHand = [...this.state.dealerHand];
                            dHand.push(result["cards"]);
                            this.setState({ dealerHand: dHand });
                            break;
                        case PLAYER:
                            let pHand = [...this.state.playerHand];
                            pHand.push(result["cards"]);
                            this.setState({ playerHand: pHand });
                            break;
                        default:
                            break;
                    }
                }
            );
    }

    renderGameState(state) {
        switch (state) {
            case PLAY_GAME:
                return (
                    <div className="container-fluid center-in-parent">
                        {/* Dealer's Hand */}
                        <div className="row">
                            <div className="hand">
                                <h3>Dealer's Hand</h3>
                                {this.state.dealerHand.map((index, i) => (
                                    index.map((card, i) => (
                                        <img className="card" src={card.image} alt={card.code} key={i}></img>
                                    ))
                                ))}
                            </div>
                        </div>
                        {/* Player's Hand */}
                        <div className="row">
                            <div className="hand">
                                {this.state.playerHand.map((index, i) => (
                                    index.map((card, i) => (
                                        <img className="card" src={card.image} alt={card.code} key={i}></img>
                                    ))
                                ))}
                            </div>
                            <h3>Your Hand</h3>
                        </div>
                        {/* Game Controls */}
                        <div>
                            <Button className="btn-game">Stand</Button>
                            <Button className="btn-game">Hit</Button>
                            <Button className="btn-game">Split</Button>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <div className="center-in-parent">
                            <h2>Blackjack</h2>
                            <Button onClick={this.startGame} className="btn-play">Play Game</Button>
                        </div>
                    </>
                );
        }
    }

    render() {
        return (
            <div className="Game container-fluid">
                {this.renderGameState(this.state.gameState)}
            </div>
        );
    }
}

export default Game