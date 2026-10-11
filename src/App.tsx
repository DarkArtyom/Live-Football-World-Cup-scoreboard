import { Outlet } from "react-router-dom";
import "./App.css";
import NavigationTabs from "./navigation/NavigationTabs";

function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="app__header">
        <div className="app__brand">
          <span aria-hidden="true" className="app__brand-mark" />
          <h1>Live Football World Cup Scoreboard</h1>
        </div>
        <NavigationTabs />
      </header>
      <main className="app__content" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
