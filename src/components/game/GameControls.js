import React from 'react';
import Button from 'react-bootstrap/Button';
import * as State from '../../game/State';

class GameControls extends React.Component {

    render() {
        switch (this.props.gameState) {
            case State.PLAY_GAME:
                return (
                    <div id="game-controls">
                        <Button className="btn btn-game" onClick={this.props.stand}>Stand</Button>
                        <Button className="btn btn-game" onClick={this.props.hit}>Hit</Button>
                        <Button className="btn btn-game" onClick={this.props.split}>Split</Button>
                    </div>
                );
            case State.END_GAME:
            default:
                return (
                    <div id="game-controls">
                        <Button className="btn btn-game" onClick={this.props.startGame}>Play Again</Button>
                        <Button className="btn btn-game">Quit</Button>
                    </div>
                );
        }
    }
}

export default GameControls;