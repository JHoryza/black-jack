import '../css/Game.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import DealerHand from './game/DealerHand';
import PlayerHand from './game/PlayerHand';
import GameControls from './game/GameControls';
import * as State from '../game/State';
import Hand from '../game/Hand';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameState: State.IDLE,
            dealerHand: [new Hand([])],
            playerHand: [new Hand([])],
            activeHand: 0,
            endGameMessage: ""
        };

        this.deckId = "";
        this.cards = [];
        this.playoutHand = false;
        this.chips = 500;
        this.chipsWon = 0;

        this.startGame = this.startGame.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.placeBet = this.placeBet.bind(this);
        this.stand = this.stand.bind(this);
        this.hit = this.hit.bind(this);
        this.double = this.double.bind(this);
        this.split = this.split.bind(this);
    }

    /**
     * Resets game variables and state
     */
    resetGame() {
        this.deckId = "";
        this.cards = [];
        this.chipsWon = 0;
        this.playoutHand = false;
        this.setState({ gameState: State.IDLE, dealerHand: [new Hand([])], playerHand: [new Hand([])], activeHand: 0, endGameMessage: "" });
    }

    /**
     * Handles start of game routines
     */
    startGame() {
        // Reset game state properties
        this.resetGame();
        // Shuffle new deck and deal out opening hands
        this.shuffleDeck(function () {
            let dHand = this.state.dealerHand[0];
            let pHand = this.state.playerHand[this.state.activeHand];
            this.drawCard(1, function () {
                dHand.addCards(this.cards);
                dHand.setValue(this.calcCardVal(this.cards));
                this.drawCard(2, function () {
                    pHand.addCards(this.cards);
                    pHand.setValue(this.calcCardVal(this.cards));
                    this.setState({ dealerHand: [dHand], playerHand: [pHand], gameState: State.PLACE_BET },
                        () => {
                            if (this.isBlackjack(pHand)) {
                                pHand.setStatus("[BLACKJACK]");
                                this.chipsWon += parseFloat(pHand.getBet()) * 2;
                                this.setState({ gameState: State.END_GAME });
                            }
                        }
                    );
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    /**
     * Handles end of game routines
     */
    endGame() {
        let dHand = this.state.dealerHand[0];
        if (this.playoutHand) {
            this.dealerDraw(1, function () {
                if (dHand.getValue() === 21 && dHand.getCards().length === 2)
                    dHand.setStatus("BLACKJACK");
                this.checkWinCondition();
                this.setState({ gameState: State.END_GAME });
            }.bind(this));
        } else {
            this.setState({ gameState: State.END_GAME });
        }
    }

    /**
     * Assigns bet to value of button pressed by user
     * @param {Button} button 
     */
    placeBet = (button) => {
        let bet = button.target.getAttribute("value");
        this.state.playerHand[0].setBet(bet);
        this.setState({ gameState: State.PLAY_GAME });
    }

    /**
     * API call to generate a new deck of cards
     * @param {function()} cb callback function
     * @param {int} attempts max number of API call attempts to make
     */
    async shuffleDeck(cb, attempts = 10) {
        const errorCodes = [408, 500, 502, 503, 504, 522, 524];
        await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(
            res => {
                if (res.ok) {
                    res.json().then(
                        result => {
                            this.deckId = result.deck_id;
                            cb();
                        }
                    );
                } else {
                    if (attempts > 0 && errorCodes.includes(res.status)) {
                        return this.shuffleDeck(cb, attempts - 1);
                    } else {
                        throw new Error(res);
                    }
                }
            }
        ).catch(console.error);
    }

    /**
     * API call to draw a given a number of cards
     * @param {int} count number of cards to draw
     * @param {function()} cb callback function
     * @param {int} attempts max number of API call attempts to make
     */
    async drawCard(count, cb, attempts = 10) {
        const errorCodes = [408, 500, 502, 503, 504, 522, 524];
        await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${count}`).then(
            res => {
                if (res.ok) {
                    res.json().then(
                        result => {
                            this.cards = result["cards"];
                            cb();
                        }
                    );
                } else {
                    if (attempts > 0 && errorCodes.includes(res.status)) {
                        return this.drawCard(count, cb, attempts - 1);
                    } else {
                        throw new Error(res);
                    }
                }
            }
        ).catch(console.error);
    }

    /**
     * Handles routines that play out the dealer's hand
     * @param {int} rec tracks number of pending recursive calls to delay callback
     * @param {function} cb function callback once recursion has resolved
     */
    dealerDraw(rec, cb) {
        let dHand = this.state.dealerHand[0];
        rec--;
        if (dHand.getValue() < 17) {
            rec++;

            this.drawCard(1, function () {
                dHand.addCards(this.cards);
                dHand.setValue(this.calcCardVal(dHand.getCards()));
                this.setState({ dealerHand: [dHand] },
                    () => {
                        this.dealerDraw(rec, cb);
                    }
                );
            }.bind(this));
        }
        if (rec === 0) cb();
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
        this.drawCard(1, function () {
            let pHand = this.state.playerHand; // All player hands (split hands)
            let aHand = this.state.playerHand[this.state.activeHand]; // Active player hand
            aHand.addCards(this.cards);
            aHand.setValue(this.calcCardVal(aHand.getCards()));
            pHand[this.state.activeHand] = aHand;
            this.setState({ playerHand: pHand },
                () => {
                    if (this.isBust(aHand)) {
                        aHand.setStatus("[BUST]");
                        this.chipsWon -= parseFloat(aHand.getBet());
                        if (!this.hasNextHand()) {
                            this.checkWinCondition();
                        } else {
                            this.setState({ activeHand: this.state.activeHand + 1 });
                        }
                    }
                }
            );
        }.bind(this));
    }

    /**
     * Dealer draws cards until a win condition is met
     */
    stand() {
        this.playoutHand = true;
        if (this.hasNextHand()) {
            this.setState({ activeHand: this.state.activeHand + 1 });
        } else {
            this.endGame();
        }
    }

    /**
     * Doubles the bet and draws one card
     */
    double() {
        let pHand = this.state.playerHand; // All player hands
        let aHand = this.state.playerHand[this.state.activeHand]; // Active player hand
        aHand.setBet(aHand.getBet() * 2);
        this.drawCard(1, function () {
            aHand.addCards(this.cards);
            aHand.setValue(this.calcCardVal(aHand.getCards()));
            pHand[this.state.activeHand] = aHand;
            this.setState({ playerHand: pHand },
                () => {
                    if (this.isBust(aHand)) {
                        aHand.setStatus("[BUST]");
                        this.chipsWon -= parseFloat(aHand.getBet());
                    } else {
                        this.playoutHand = true;
                    }
                    if (!this.hasNextHand()) {
                        this.endGame();
                    } else {
                        this.setState({ activeHand: this.state.activeHand + 1 });
                    }
                }
            );
        }.bind(this));
    }

    /**
     * Splits the active hand into two hands
     */
    split() {
        let aHand = this.state.playerHand[this.state.activeHand]; // Active player hand
        let pHand = this.state.playerHand; // All player hands
        let newHand = new Hand([]); // New hand
        let card = aHand.getCards()[1]; // Card to move
        // Build new hand
        this.drawCard(2, function () {
            newHand.addCards([card, this.cards[0]]);
            newHand.setValue(this.calcCardVal(newHand.getCards()));
            newHand.setBet(aHand.getBet());
            // Modify active hand
            aHand.removeCards(card);
            aHand.addCards([this.cards[1]]);
            aHand.setValue(this.calcCardVal(aHand.getCards()));
            // Rebuild player hands array
            pHand.splice(pHand.indexOf(aHand), 1, aHand, newHand);
            this.setState({ playerHand: pHand },
                () => {
                    if (this.isBlackjack(newHand)) {
                        newHand.setStatus("[BLACKJACK]");
                        this.chipsWon += parseFloat(newHand.getBet()) * 2;
                    }
                    if (this.isBlackjack(aHand)) {
                        aHand.setStatus("[BLACKJACK]");
                        this.chipsWon += parseFloat(aHand.getBet()) * 2;
                    }
                    if (this.isBlackjack(newHand) && this.isBlackjack(aHand)) {
                        this.setState({ gameState: State.END_GAME });
                    }
                }
            );
        }.bind(this));
    }

    /**
     * Checks for win conditions that would end the game
     */
    checkWinCondition() {
        let pHand = this.state.playerHand;
        let dHand = this.state.dealerHand[0];
        if (this.isBust(dHand)) dHand.setStatus("[BUST]");
        if (this.isBlackjack(dHand)) {
            for (var hand of pHand) {
                if (hand.getStatus().length === 0) {
                    pHand.setStatus("[LOSE]");
                }
                this.chipsWon -= parseFloat(hand.getBet());
            }
        } else {
            for (var hand of pHand) {
                if (hand.getStatus().length === 0) {
                    if (hand.getValue() > dHand.getValue()
                        || dHand.getValue() > 21) {
                        hand.setStatus("[WIN]");
                        this.chipsWon += parseFloat(hand.getBet());
                    } else if (hand.getValue() === dHand.getValue()) {
                        hand.setStatus("[PUSH]");
                    } else {
                        hand.setStatus("[LOSE]");
                        this.chipsWon -= parseFloat(hand.getBet());
                    }
                }
            }
        }
        this.chips += parseFloat(this.chipsWon);
        this.setState({ gameState: State.END_GAME, endGameMessage: "Result: $" + this.chipsWon });
    }

    /**
     * Resolves whether hand of cards exceeds value of 21
     * @param {Object[]} hand cards to validate
     * @returns true/false
     */
    isBust(hand) {
        if (hand.getValue() > 21)
            return true;
        else
            return false;
    }

    /**
     * Resolves whether hand of cards is a value of 21 and length of 2 (cards)
     * @param {Object[]} hand 
     * @returns true/false
     */
    isBlackjack(hand) {
        if (hand.getValue() === 21 && hand.getCards().length === 2)
            return true;
        else
            return false;
    }

    /**
     * Resolves whether there is another hand to advance to
     * @returns true/false
     */
    hasNextHand() {
        let pHand = this.state.playerHand;
        if (this.state.activeHand < pHand.length - 1)
            return true;
        else
            return false;
    }

    /**
     * Resolves whether a hand can be split
     * @param {Object[]} hand 
     * @returns 
     */
    canSplit(hand) {
        if (hand.getCards().length === 2
            && this.calcCardVal([hand.getCards()[0]]) === this.calcCardVal([hand.getCards()[1]]))
            return true;
        else
            return false;
    }

    /**
     * Resolves whether a bet can be doubled
     * @param {Object[]} hand 
     * @returns 
     */
    canDouble(hand) {
        if (hand.getCards().length === 2)
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
            case State.PLACE_BET:
                return (
                    <div className="container-fluid center-in-parent">
                        <h3>Place Bet:</h3>
                        <GameControls placeBet={this.placeBet} chips={this.chips} gameState={this.state.gameState} />
                        <br />
                        <h4>Total Chips: ${this.chips}</h4>
                    </div>
                );
            case State.END_GAME:
            case State.PLAY_GAME:
                return (
                    <div className="container-fluid center-in-parent">
                        <DealerHand hand={this.state.dealerHand[0]} />
                        <p id="endGameMessage" className="center-in-parent">{this.state.endGameMessage}</p>
                        <PlayerHand hands={this.state.playerHand} activeHand={this.state.activeHand} />
                        <GameControls gameState={this.state.gameState} context={this}
                            startGame={this.startGame} quit={this.resetGame}
                            stand={this.stand} hit={this.hit} double={this.double} split={this.split} />
                    </div>
                );
            case State.IDLE:
            default:
                return (
                    <div className="center-in-parent">
                        <Button onClick={this.startGame} className="btn-play">Start Game</Button>
                    </div>
                );
        }
    }
}

export default Game;