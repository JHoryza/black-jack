import React from 'react';
import Button from 'react-bootstrap/Button';

class GameControls extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Button className="btn-game">Stand</Button>
                <Button className="btn-game" onClick={this.props.hit}>Hit</Button>
                <Button className="btn-game">Split</Button>
            </div>
        );
    }
}

export default GameControls;