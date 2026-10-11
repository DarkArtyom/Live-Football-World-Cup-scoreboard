import { ROUTER_PATHS } from "../router/paths";

export type NavigationTab = {
  id: string;
  label: string;
  path: string;
  panelId: string;
};

export const NAVIGATION_TABS = [
  {
    id: "matches-tab",
    label: "Matches in progress",
    path: ROUTER_PATHS.matches,
    panelId: "matches-panel",
  },
  {
    id: "finished-tab",
    label: "Finished matches",
    path: ROUTER_PATHS.finished,
    panelId: "finished-panel",
  },
] as const satisfies readonly NavigationTab[];
