import React from 'react';
import Button from 'react-bootstrap/Button';
import * as Game from '../Game';

class GameControls extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        switch (this.props.gameState) {
            case Game.PLAY_GAME:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.stand}>Stand</Button>
                        <Button className="btn-game" onClick={this.props.hit}>Hit</Button>
                        <Button className="btn-game">Split</Button>
                    </div>
                );
            case Game.GAME_WON:
            case Game.GAME_LOST:
            case Game.GAME_TIE:
            default:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.startGame}>Play Again</Button>
                        <Button className="btn-game">Quit</Button>
                    </div>
                );
        }
    }
}

export default GameControls;