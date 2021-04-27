import React from 'react';
import Button from 'react-bootstrap/Button';
import * as State from '../../game/State';

class GameControls extends React.Component {

    render() {
        switch (this.props.gameState) {
            case State.PLACE_BET:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.placeBet} value={1}>$1</Button>
                        <Button className="btn-game" onClick={this.props.placeBet} value={5}>$5</Button>
                        <Button className="btn-game" onClick={this.props.placeBet} value={10}>$10</Button>
                        <Button className="btn-game" onClick={this.props.placeBet} value={25}>$25</Button>
                        <Button className="btn-game" onClick={this.props.placeBet} value={50}>$50</Button>
                        <Button className="btn-game" onClick={this.props.placeBet} value={100}>$100</Button>
                    </div>
                );
            case State.PLAY_GAME:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.stand}>Stand</Button>
                        <Button className="btn-game" onClick={this.props.hit}>Hit</Button>
                        <Button className="btn-game" onClick={this.props.split}>Split</Button>
                    </div>
                );
            case State.END_GAME:
            default:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.startGame}>Play Again</Button>
                        <Button className="btn-game" onClick={this.props.quit}>Quit</Button>
                    </div>
                );
        }
    }
}

export default GameControls;