import '../css/Game.css'
import Button from 'react-bootstrap/Button'

function Game() {
    return (
        <>
            <div className="Game">
                <div className="container-fluid">
                    <div className="row">
                        <h2>Blackjack</h2>
                        <Button type="button" class="btn btn-primary">Play Game</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game