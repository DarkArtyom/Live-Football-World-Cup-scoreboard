import { useState } from "react";
import { useScoreboard } from "../context/scoreboard/useScoreboard";
import { MatchEditorModal } from "../matches/MatchEditorModal/MatchEditorModal";
import { MatchTable } from "../matches/MatchTable/MatchTable";
import { MatchesToolbar } from "../matches/MatchesToolbar/MatchesToolbar";
import { Messages } from "../matches/constants";
import { type Match } from "../matches/types";
import { MatchEditorMode, MatchStatus } from "../matches/constants";
import { filterMatches, sortMatchesForSummary } from "../matches/utils";

const MatchesInProgressPage = () => {
  const { matches, addMatch, updateScore, finish } = useScoreboard();
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [matchBeingEdited, setMatchBeingEdited] = useState<Match | null>(null);
  const matchList = Array.from(matches.values());
  const visibleMatches = filterMatches(
    sortMatchesForSummary(
      matchList.filter((match) => match.status === MatchStatus.IN_PROGRESS),
    ),
    query,
  );

  return (
    <section
      aria-labelledby="matches-tab"
      className="page"
      id="matches-panel"
      role="tabpanel"
    >
      <h2 id="matches-page-title">Matches in progress</h2>
      <MatchesToolbar
        onCreate={() => setIsCreateOpen(true)}
        onSearch={setQuery}
        query={query}
      />
      <MatchTable
        emptyMessage={
          query
            ? Messages.NO_ACTIVE_MATCHES_FOR_QUERY(query)
            : Messages.NO_MATCHES_IN_PROGRESS
        }
        matches={visibleMatches}
        matchesById={matches}
        onEdit={setMatchBeingEdited}
        onFinish={finish}
      />
      {isCreateOpen && (
        <MatchEditorModal
          matches={matchList}
          mode={MatchEditorMode.CREATE}
          onCreate={addMatch}
          onDismiss={() => setIsCreateOpen(false)}
        />
      )}
      {matchBeingEdited && (
        <MatchEditorModal
          match={matchBeingEdited}
          mode={MatchEditorMode.EDIT}
          onDismiss={() => setMatchBeingEdited(null)}
          onUpdate={updateScore}
        />
      )}
    </section>
  );
};

export default MatchesInProgressPage;
