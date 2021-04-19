import React from 'react';
import Button from 'react-bootstrap/Button';

class GameControls extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="game-controls">
                <Button className="btn-game">Stand</Button>
                <Button className="btn-game" onClick={this.props.hit}>Hit</Button>
                <Button className="btn-game">Split</Button>
            </div>
        );
    }
}

export default GameControls;