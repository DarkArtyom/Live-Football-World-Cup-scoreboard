import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./NavigationTabs.module.css";
import { NAVIGATION_TABS } from "./tabs";

const getNextTabIndex = (key: string, currentIndex: number) => {
  const lastIndex = NAVIGATION_TABS.length - 1;

  switch (key) {
    case "ArrowLeft":
      return currentIndex === 0 ? lastIndex : currentIndex - 1;
    case "ArrowRight":
      return currentIndex === lastIndex ? 0 : currentIndex + 1;
    case "Home":
      return 0;
    case "End":
      return lastIndex;
    default:
      return null;
  }
};

const NavigationTabs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const activePath =
    NAVIGATION_TABS.find(({ path }) => pathname === path)?.path ??
    NAVIGATION_TABS[0].path;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    currentIndex: number,
  ) => {
    const nextIndex = getNextTabIndex(event.key, currentIndex);

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    navigate(NAVIGATION_TABS[nextIndex].path);
  };

  return (
    <nav aria-label="Scoreboard views" className={styles.navigation}>
      <div aria-label="Match views" className={styles.tabs} role="tablist">
        {NAVIGATION_TABS.map((tab, index) => {
          const isActive = tab.path === activePath;

          return (
            <NavLink
              aria-controls={tab.panelId}
              aria-selected={isActive}
              className={({ isActive: isCurrent }) =>
                `${styles.tab}${isCurrent ? ` ${styles.activeTab}` : ""}`
              }
              id={tab.id}
              key={tab.path}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              to={tab.path}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationTabs;
