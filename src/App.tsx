import { Outlet } from "react-router-dom";
import "./App.css";
import { ScoreboardProvider } from "./context/scoreboard/ScoreboardProvider";
import NavigationTabs from "./navigation/NavigationTabs";

const App = () => {
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
        <ScoreboardProvider>
          <Outlet />
        </ScoreboardProvider>
      </main>
    </div>
  );
};

export default App;
