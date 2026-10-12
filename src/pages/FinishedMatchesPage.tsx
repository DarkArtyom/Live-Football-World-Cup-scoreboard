import { useScoreboard } from "../context/scoreboard/useScoreboard";
import { Messages } from "../matches/constants";
import { MatchTable } from "../matches/MatchTable";
import { MatchStatus } from "../matches/types";
import { sortMatchesForSummary } from "../matches/utils";

const FinishedMatchesPage = () => {
  const { matches } = useScoreboard();
  const finishedMatches = sortMatchesForSummary(
    matches.filter((match) => match.status === MatchStatus.FINISHED),
  );

  return (
    <section
      aria-labelledby="finished-tab"
      className="page"
      id="finished-panel"
      role="tabpanel"
    >
      <h2 id="finished-page-title">Finished matches</h2>
      <MatchTable
        emptyMessage={Messages.FINISHED_MATCHES_EMPTY}
        matches={finishedMatches}
      />
    </section>
  );
};

export default FinishedMatchesPage;
