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

export const IDLE = 0;
export const PLAY_GAME = 1;
export const GAME_WON = 2;
export const GAME_LOST = 3;
export const GAME_TIE = 4;
export const END_GAME = 5;

const INITIAL_STATE = {
    gameState: IDLE,
    deckId: "",
    dealerHand: [],
    playerHand: [],
    dealerCardVal: 0,
    playerCardVal: 0
};

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

    /**
     * Handles start of game routines
     */
    startGame() {
        this.setState({ deckId: "", dealerHand: [], playerHand: [], dealerCardVal: 0, playerCardVal: 0 });
        this.shuffleDeck().then(() => {
            this.drawCard(this.state.dealerHand, 1).then(dHand => {
                this.setState({ dealerHand: dHand, dealerCardVal: this.getHandValue(dHand) });
                this.drawCard(this.state.playerHand, 2).then(pHand => {
                    this.setState({ playerHand: pHand, playerCardVal: this.getHandValue(pHand), gameState: PLAY_GAME });
                });
            });
        });
    }

    /**
     * API call to generate a new deck of cards
     */
    async shuffleDeck() {
        await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(
            res => res.json()).then(
                result => {
                    this.setState({ deckId: result.deck_id });
                });
    }

    /**
     * API call to draw a given a number of cards
     * @param {*} hand array of held cards
     * @param {*} count number of cards to draw
     * @returns array of cards inclusive of cards drawn
     */
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

    /**
     * Sum of card values in array of held cards
     * @param {*} hand array of held cards
     * @returns value of cards in hand array
     */
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
            this.setState({ gameState: GAME_LOST });
            return "BUST!";
        } else if (value == 21) {
            this.setState({ gameState: GAME_WON });
            return "YOU WIN!";
        }
        return "Value: " + value;
    }

    /**
     * Draws card and recalculates hand value
     */
    hit() {
        this.drawCard(this.state.playerHand, 1).then(pHand => {
            this.setState({ playerHand: pHand, playerCardVal: this.getHandValue(pHand) });
        });
    }

    /**
     * Screen render of HTML based on current gameState
     * @returns HTML to render on screen
     */
    render() {
        switch (this.state.gameState) {
            case GAME_TIE:
            case GAME_LOST:
            case GAME_WON:
            case PLAY_GAME:
                return (
                    <div id="game" className="container-fluid">
                        <div className="container-fluid center-in-parent">
                            <DealerHand hand={this.state.dealerHand} handValue={this.state.dealerCardVal} />
                            <GameManager gameState={this.state.gameState} startGame={this.startGame} />
                            <PlayerHand hand={this.state.playerHand} handValue={this.state.playerCardVal} />
                            <GameControls hit={this.hit} />
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <div id="game" className="container-fluid">
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