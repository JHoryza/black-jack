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
                        {this.props.chips >= 5 ?
                            <Button className="btn-game" onClick={this.props.placeBet} value={5} disabled={false}>$5</Button> :
                            <Button className="btn-game" onClick={this.props.placeBet} value={5} disabled={true}>$5</Button>}
                        {this.props.chips >= 10 ?
                            <Button className="btn-game" onClick={this.props.placeBet} value={10} disabled={false}>$10</Button> :
                            <Button className="btn-game" onClick={this.props.placeBet} value={10} disabled={true}>$10</Button>}
                        {this.props.chips >= 25 ?
                            <Button className="btn-game" onClick={this.props.placeBet} value={25} disabled={false}>$25</Button> :
                            <Button className="btn-game" onClick={this.props.placeBet} value={25} disabled={true}>$25</Button>}
                        {this.props.chips >= 50 ?
                            <Button className="btn-game" onClick={this.props.placeBet} value={50} disabled={false}>$50</Button> :
                            <Button className="btn-game" onClick={this.props.placeBet} value={50} disabled={true}>$50</Button>}
                        {this.props.chips >= 100 ?
                            <Button className="btn-game" onClick={this.props.placeBet} value={100} disabled={false}>$100</Button> :
                            <Button className="btn-game" onClick={this.props.placeBet} value={100} disabled={true}>$100</Button>}
                    </div>
                );
            case State.PLAY_GAME:
                return (
                    <div id="game-controls">
                        <Button className="btn-game" onClick={this.props.stand}>Stand</Button>
                        <Button className="btn-game" onClick={this.props.hit}>Hit</Button>
                        {this.props.context.canDouble(this.props.context.state.playerHand[this.props.context.state.activeHand]) == true ?
                            <Button className="btn-game" onClick={this.props.double} disabled={false}>Double</Button> :
                            <Button className="btn-game" onClick={this.props.double} disabled={true}>Double</Button>
                        }
                        {this.props.context.canSplit(this.props.context.state.playerHand[this.props.context.state.activeHand]) == true ?
                            <Button className="btn-game" onClick={this.props.split} disabled={false}>Split</Button> :
                            <Button className="btn-game" onClick={this.props.split} disabled={true}>Split</Button>
                        }

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