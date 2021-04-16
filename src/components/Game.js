import '../css/Game.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import DealerHand from './game/DealerHand';
import PlayerHand from './game/PlayerHand';
import GameControls from './game/GameControls';
import GameManager from './game/GameManager';

/*
TODO:

-Stand and Split functionality
-Ace high/low logic checking
-Game end event win/loss
-Dealer drawing

*/

const IDLE = 0;
const PLAY_GAME = 1;
const GAME_WON = 2;
const GAME_LOST = 3;
const GAME_TIE = 4;
const END_GAME = 5;

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameState: IDLE,
            deckId: "",
            dealerHand: [],
            playerHand: [],
            dealerCardVal: 0,
            playerCardVal: 0
        };

        this.startGame = this.startGame.bind(this);
        this.hit = this.hit.bind(this);
    }

    startGame() {
        this.shuffleDeck().then(() => {
            this.drawCard(this.state.dealerHand, 1).then(dHand => {
                this.setState({ dealerHand: dHand });
                this.drawCard(this.state.playerHand, 2).then(pHand => {
                    this.setState({ playerHand: pHand, gameState: PLAY_GAME });
                });
            });
        });
    }

    async shuffleDeck() {
        await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(
            res => res.json()).then(
                result => {
                    this.setState({ deckId: result.deck_id });
                });
    }

    async drawCard(hand, count) {
        let newHand = await fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=${count}`).then(
            res => res.json()).then(
                result => {
                    let tempHand = [...hand];
                    for (var i = 0; i < result["cards"].length; i++) {
                        tempHand.push(result["cards"][i]);
                    }
                    return tempHand;
                });
        return await newHand;
    }

    getHandValue(hand) {
        let value = 0;
        for (var i = 0; i < hand.length; i++) {
            switch (hand[i].value) {
                case "ACE":
                    value += 11;
                    break;
                case "KING":
                case "QUEEN":
                case "JACK":
                    value += 10;
                    break;
                default:
                    value += parseInt(hand[i].value);
                    break;
            }
        }
        if (value > 21) {
            return "BUST!";
        }
        return "Value: " + value;
    }

    hit() {
        this.drawCard(this.state.playerHand, 1).then(pHand => {
            this.setState({ playerHand: pHand });
        });
    }

    render() {
        switch (this.state.gameState) {
            case GAME_LOST:
            case GAME_WON:
            case PLAY_GAME:
                return (
                    <div className="Game container-fluid">
                        <div className="container-fluid center-in-parent">
                            <DealerHand hand={this.state.dealerHand} handValue={this.getHandValue(this.state.dealerHand)} />
                            <GameManager gameState={this.state.gameState} />
                            <PlayerHand hand={this.state.playerHand} handValue={this.getHandValue(this.state.playerHand)} />
                            <GameControls hit={this.hit} />
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <div className="Game container-fluid">
                            <div className="center-in-parent">
                                <h2>Blackjack</h2>
                                <Button onClick={this.startGame} className="btn-play">Play Game</Button>
                            </div>
                        </div>
                    </>
                );
        }
    }
}

export default Game;