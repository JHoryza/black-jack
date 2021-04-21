import React from 'react';
import Button from 'react-bootstrap/Button';
import * as State from '../../game/State';

class GameControls extends React.Component {

    render() {
        switch (this.props.gameState) {
            case State.PLAY_GAME:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.stand}>Stand</Button>
                        <Button className="btn-game" onClick={this.props.hit}>Hit</Button>
                        <Button className="btn-game">Split</Button>
                    </div>
                );
            case State.GAME_WON:
            case State.GAME_LOST:
            case State.GAME_TIE:
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