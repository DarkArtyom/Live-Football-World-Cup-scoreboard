import { ChangelogTable } from "../changelog/ChangelogTable";
import { useScoreboard } from "../context/scoreboard/useScoreboard";
import { sortHistoryEvents } from "../matches/history";

const ChangelogPage = () => {
  const { events } = useScoreboard();
  const visibleEvents = sortHistoryEvents(events);

  return (
    <section
      aria-labelledby="changelog-tab"
      className="page"
      id="changelog-panel"
      role="tabpanel"
    >
      <h2 id="changelog-page-title">Changelog</h2>
      <ChangelogTable events={visibleEvents} />
    </section>
  );
};

export default ChangelogPage;
