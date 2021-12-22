import logo from './logo.svg';
import './App.css';
import Timeline from './Timeline.js'

function App() {
  return (
    <div className="Timeline">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <Timeline name="hi" />
      </header>
    </div>
  );
}

export default App;
