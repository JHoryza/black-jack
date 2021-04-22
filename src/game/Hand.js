class Hand {

    constructor(hand) {
        this.cards = hand;
        this.value = 0;
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
}

export default Hand