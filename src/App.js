import './css/App.css';
import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      <hr />
      <Game />
      <hr />
      <Footer />
    </div>
  );
}

export default App;
