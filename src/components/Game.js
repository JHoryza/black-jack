import '../css/Game.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import DealerHand from './game/DealerHand';
import PlayerHand from './game/PlayerHand';
import GameControls from './game/GameControls';

/*
TODO:

-Split functionality

*/

export const IDLE = 0;
export const PLAY_GAME = 1;
export const GAME_WON = 2;
export const GAME_LOST = 3;
export const GAME_TIE = 4;
export const END_GAME = 5;

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameState: IDLE,
            deckId: "",
            dealerHand: [],
            playerHand: [],
            dealerCardVal: 0,
            playerCardVal: 0,
            endGameMessage: ""
        };

        this.startGame = this.startGame.bind(this);
        this.stand = this.stand.bind(this);
        this.hit = this.hit.bind(this);
        this.checkWinCondition = this.checkWinCondition.bind(this);
    }

    /**
     * Handles start of game routines
     */
    startGame() {
        // Reset game state properties
        this.setState({ deckId: "", dealerHand: [], playerHand: [], dealerCardVal: 0, playerCardVal: 0, endGameMessage: "" });
        // Shuffle new deck and deal out opening hands
        this.shuffleDeck().then(() => {
            this.drawCard(this.state.dealerHand, 1).then(dHand => {
                this.drawCard(this.state.playerHand, 2).then(pHand => {
                    this.setState({
                        dealerHand: dHand, dealerCardVal: this.getHandValue(dHand),
                        playerHand: pHand, playerCardVal: this.getHandValue(pHand),
                        gameState: PLAY_GAME
                    },
                        this.checkWinCondition
                    );
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
                console.log(newHand);
        return newHand;
    }

    /**
     * Sum of card values in array of held cards
     * @param {*} hand array of held cards
     * @returns value of cards in hand array
     */
    getHandValue(hand) {
        let value = 0;
        let numAces = 0;
        // Calculate value of non-ACE cards
        for (var i = 0; i < hand.length; i++) {
            switch (hand[i].value) {
                case "ACE":
                    numAces++;
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
        // Calculate value of Aces to produce best hand
        for (var i = 0; i < numAces; i++) {
            if (value + numAces >= 21) {
                value += numAces;
            } else if (value + 11 + (numAces - i) <= 21) {
                value += 11;
            } else {
                value += 1;
            }
        }
        return value;
    }

    /**
     * Draws card and recalculates hand value
     */
    hit() {
        this.drawCard(this.state.playerHand, 1).then(pHand => {
            this.setState({ playerHand: pHand, playerCardVal: this.getHandValue(pHand) },
                this.checkWinCondition
            );
        });
    }

    /**
     * Dealer draws cards until a win condition is met
     */
    stand() {
        if (this.state.dealerCardVal < this.state.playerCardVal || this.state.dealerCardVal < 17) {
            this.drawCard(this.state.dealerHand, 1).then(dHand => {
                this.setState({ dealerHand: dHand, dealerCardVal: this.getHandValue(dHand) },
                    this.stand
                );
            });
        }
        this.checkWinCondition();
    }

    /**
     * Checks for win conditions that would end the game
     */
    checkWinCondition() {
        let outcome = this.state.gameState;
        let message = "";
        if (this.state.playerCardVal == 21 && this.state.playerHand.length == 2) {
            outcome = GAME_WON;
            message = "BLACKJACK!";
        } else if (this.state.playerCardVal > 21) {
            outcome = GAME_LOST;
            message = "BUST!";
        } else if (this.state.dealerCardVal > 21) {
            outcome = GAME_WON;
            message = "YOU WIN!";
        } else if (this.state.dealerCardVal == this.state.playerCardVal) {
            outcome = GAME_TIE;
            message = "PUSH!";
        } else if (this.state.dealerCardVal > this.state.playerCardVal) {
            outcome = GAME_LOST;
            message = "YOU LOSE!";
        }
        this.setState({ gameState: outcome, endGameMessage: message });
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
                    <div className="container-fluid center-in-parent">
                        <DealerHand hand={this.state.dealerHand} handValue={this.state.dealerCardVal} />
                        <p id="endGameMessage" className="center-in-parent">{this.state.endGameMessage}</p>
                        <PlayerHand hand={this.state.playerHand} handValue={this.state.playerCardVal} />
                        <GameControls gameState={this.state.gameState} startGame={this.startGame} stand={this.stand} hit={this.hit} />
                    </div>
                );
            default:
                return (
                    <div className="center-in-parent">
                        <h2>Blackjack</h2>
                        <Button onClick={this.startGame} className="btn-play">Play Game</Button>
                    </div>
                );
        }
    }
}

export default Game;