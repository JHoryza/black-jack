import '../css/Game.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import DealerHand from './game/DealerHand';
import PlayerHand from './game/PlayerHand';
import GameControls from './game/GameControls';
import * as State from '../game/State';
import Hand from '../game/Hand';

/*
TODO:

-Split functionality

*/

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameState: State.IDLE,
            dealerHand: [new Hand([])],
            playerHand: [new Hand([])],
            endGameMessage: ""
        };

        this.deckId = "";
        this.activeHand = 0;
        this.playoutHand = false;

        this.startGame = this.startGame.bind(this);
        this.stand = this.stand.bind(this);
        this.hit = this.hit.bind(this);
        this.split = this.split.bind(this);
    }

    resetGame() {
        this.deckId = "";
        this.activeHand = 0;
        this.playoutHand = false;
        this.setState({ dealerHand: [new Hand([])], playerHand: [new Hand([])], endGameMessage: "" });
    }

    /**
     * Handles start of game routines
     */
    startGame() {
        // Reset game state properties
        this.resetGame();
        // Shuffle new deck and deal out opening hands
        this.shuffleDeck().then(() => {
            let dHand = this.state.dealerHand[0];
            let pHand = this.state.playerHand[this.activeHand];
            this.drawCard(1).then((dCards) => {
                this.drawCard(2).then((pCards) => {
                    dHand.addCards(dCards);
                    dHand.setValue(this.calcCardVal(dHand["cards"]));
                    pHand.addCards(pCards);
                    pHand.setValue(this.calcCardVal(pHand["cards"]));
                    this.setState({ dealerHand: [dHand], playerHand: [pHand], gameState: State.PLAY_GAME },
                        () => {
                            if (this.isBlackjack(pHand)) {
                                this.setState({ gameState: State.END_GAME });
                            }
                        }
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
                    this.deckId = result.deck_id;
                });
    }

    /**
     * API call to draw a given a number of cards
     * @param {*} count number of cards to draw
     * @returns array of drawn cards
     */
    async drawCard(count) {
        let cards = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${count}`).then(
            res => res.json()).then(
                result => {
                    return result["cards"];
                });
        return cards;
    }

    /**
     * Sum of card values in array of held cards
     * @param {*} cards array of held cards
     * @returns value of cards in cards array
     */
    calcCardVal(cards) {
        let value = 0;
        let numAces = 0;
        let i = 0;
        // Calculate value of non-ACE cards
        for (i = 0; i < cards.length; i++) {
            switch (cards[i].value) {
                case "ACE":
                    numAces++;
                    break;
                case "KING":
                case "QUEEN":
                case "JACK":
                    value += 10;
                    break;
                default:
                    value += parseInt(cards[i].value);
                    break;
            }
        }
        // Calculate value of Aces to produce best hand
        for (i = 0; i < numAces; i++) {
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
        this.drawCard(1).then(cards => {
            let pHand = this.state.playerHand; // All player hands (split hands)
            let aHand = this.state.playerHand[this.activeHand]; // Active player hand
            aHand.addCards(cards);
            aHand.setValue(this.calcCardVal(aHand["cards"]));
            pHand[this.activeHand] = aHand;
            this.setState({ playerHand: pHand },
                () => {
                    if (this.isBust(aHand)) {
                        if (!this.hasNextHand()) {
                            this.endGame();
                        } else {
                            this.activeHand = this.activeHand + 1;
                        }
                    }
                }
            );
        });
    }

    /**
     * Dealer draws cards until a win condition is met
     */
    stand() {
        this.playoutHand = true;
        if (this.hasNextHand()) {
            this.activeHand = this.activeHand + 1;
        } else {
            this.endGame();
        }
    }

    dealerDraw(rec, cb) {
        let dHand = this.state.dealerHand[0];
        rec--;
        if (dHand.getValue() < 17) {
            rec++;
            this.drawCard(1).then(dCards => {
                dHand.addCards(dCards);
                dHand.setValue(this.calcCardVal(dHand["cards"]));
                this.setState({ dealerHand: [dHand] },
                    () => {
                        this.dealerDraw(rec, cb);
                    }
                );
            });
        }
        if (rec == 0) cb();
    }

    endGame() {
        if (this.playoutHand) {
            this.dealerDraw(1, function () {
                this.checkWinCondition();
                this.setState({ gameState: State.END_GAME });
            }.bind(this));
        } else {
            this.setState({ gameState: State.END_GAME });
        }
    }

    /**
     * Splits the active hand into two hands
     */
    split() {
        let aHand = this.state.playerHand[this.activeHand]; // Active player hand
        let pHand = this.state.playerHand; // All player hands
        let newHand = new Hand([]); // New hand
        let card = [aHand["cards"][1]]; // Card to move
        // Build new hand
        newHand.addCards(card);
        newHand.setValue(this.calcCardVal(newHand["cards"]));
        // Modify active hand
        aHand.removeCards(card);
        aHand.setValue(this.calcCardVal(aHand["cards"]));
        // Rebuild player hands array
        pHand.splice(pHand.indexOf(aHand), 1, aHand, newHand);
        this.setState({ playerHand: pHand });
    }

    /**
     * Checks for win conditions that would end the game
     */
    checkWinCondition() {
        let pHand = this.state.playerHand;
        let dHand = this.state.dealerHand[0];
        for (var hand of pHand) {
            if (hand.getStatus().length == 0) {
                if (hand.getValue() > dHand.getValue()
                    || dHand.getValue() > 21) {
                    hand.setStatus("[WIN]");
                } else {
                    hand.setStatus("[LOSE]");
                }
            }
        }
    }

    isBust(hand) {
        if (hand.getValue() > 21) {
            hand.setStatus("[BUST]");
            return true;
        } else {
            return false;
        }
    }

    isBlackjack(hand) {
        if (hand.getValue() === 21 && hand["cards"].length === 2) {
            hand.setStatus("[BLACKJACK]");
            return true;
        } else {
            return false;
        }
    }

    hasNextHand() {
        let pHand = this.state.playerHand;
        if (this.activeHand < pHand.length - 1)
            return true;
        else
            return false;
    }

    /**
     * Screen render of HTML based on current gameState
     * @returns HTML to render on screen
     */
    render() {
        switch (this.state.gameState) {
            case State.END_GAME:
            case State.PLAY_GAME:
                return (
                    <div className="container-fluid center-in-parent">
                        <DealerHand hand={this.state.dealerHand[0]} />
                        <p id="endGameMessage" className="center-in-parent">{this.state.endGameMessage}</p>
                        <PlayerHand hands={this.state.playerHand} />
                        <GameControls gameState={this.state.gameState} startGame={this.startGame} stand={this.stand} hit={this.hit} split={this.split} />
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