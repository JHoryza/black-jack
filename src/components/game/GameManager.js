import React from 'react';
import Button from 'react-bootstrap/Button';
import * as Game from '../Game';

class GameManager extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        switch (this.props.gameState) {
            case Game.GAME_TIE:
            case Game.GAME_WON:
            case Game.GAME_LOST:
                return (
                    <div id="game-manager">
                        <Button className="btn-game" onClick={this.props.startGame}>Play Again</Button>
                        <Button className="btn-game">Quit</Button>
                    </div>
                );
            case Game.PLAY_GAME:
            default:
                return (
                    <div id="game-manager"></div>
                );
        }
    }

    render() {
        return (
            <div className="row">
                {this.componentDidMount()}
            </div>
        );
    }
}

export default GameManager;