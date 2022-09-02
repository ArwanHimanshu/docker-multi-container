import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { OtherPage, Fib } from "./components";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App-header">
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </div>

        <Routes>
          <Route exact path="/" element={<Fib></Fib>} />
          <Route path="/otherpage" element={<OtherPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
