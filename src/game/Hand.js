class Hand {

    constructor(hand) {
        this.cards = hand;
        this.value = 0;
        this.status = "";
        this.bet = 0;
    }

    addCards(cards) {
        for (var i = 0; i < cards.length; i++) {
            this.cards.push(cards[i]);
        }
    }

    removeCards(cards) {
        this.cards.splice(1, 1);
    }

    getCards() {
        return this.cards;
    }

    setCards(cards) {
        this.cards = cards;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getBet() {
        return this.bet;
    }

    setBet(bet) {
        this.bet = bet;
    }
}

export default Hand