import { Navigate, createHashRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import App from "../App";
import FinishedMatchesPage from "../pages/FinishedMatchesPage";
import MatchesInProgressPage from "../pages/MatchesInProgressPage";
import { ROUTER_PATHS } from "./paths";
import ChangelogPage from "../pages/ChangelogPage";

export const appRoutes: RouteObject[] = [
  {
    path: ROUTER_PATHS.home,
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate replace to={ROUTER_PATHS.matches} />,
      },
      {
        path: ROUTER_PATHS.matches,
        element: <MatchesInProgressPage />,
      },
      {
        path: ROUTER_PATHS.finished,
        element: <FinishedMatchesPage />,
      },
      {
        path: ROUTER_PATHS.changelog,
        element: <ChangelogPage />,
      },
      {
        path: "*",
        element: <Navigate replace to={ROUTER_PATHS.matches} />,
      },
    ],
  },
];

export const router = createHashRouter(appRoutes);
