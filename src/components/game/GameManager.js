import React from 'react';
import Button from 'react-bootstrap/Button';
import Game from '../Game';

class GameManager extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        switch (this.props.gameState) {
            case Game.PLAY_GAME:
            default:
                return (
                    <Button>Play Again</Button>
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