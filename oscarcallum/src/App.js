import './App.css';
import NavBar from './Components/NavBar.js';
import GameIcon from './Components/GameIcon';

function App() {
  return (
    <div className="homescreen">
      <NavBar></NavBar>
      <div className="gamesection">
        <p>WOW LOOK AT ALL THESE COOOL GAMES</p>
      </div>
      <div id="menu-section">
        <GameIcon></GameIcon>
        <GameIcon></GameIcon>
        <GameIcon></GameIcon>
        <GameIcon></GameIcon>
        <GameIcon></GameIcon>
        <GameIcon></GameIcon>
        <GameIcon></GameIcon>
      </div>
      
    </div>
  );
}

export default App;
