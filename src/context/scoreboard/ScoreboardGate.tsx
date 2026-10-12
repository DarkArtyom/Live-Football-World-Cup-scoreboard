import { Button } from "../../components/Button/Button";
import { Loader } from "../../components/Loader/Loader";
import { Messages } from "../../matches/constants";
import { ScoreboardStatus } from "../../matches/types";
import { useScoreboard } from "./useScoreboard";
import type { PropsWithChildren } from "react";

export const ScoreboardGate = ({ children }: PropsWithChildren) => {
  const { status, error, retry } = useScoreboard();

  if (status === ScoreboardStatus.LOADING) {
    return <Loader label={Messages.LOADING_MATCHES} />;
  }

  if (status === ScoreboardStatus.ERROR) {
    return (
      <div>
        <p role="alert">{error ?? Messages.MATCHES_LOAD_FAILED}</p>
        <Button onClick={retry} variant="primary">
          {Messages.TRY_AGAIN}
        </Button>
      </div>
    );
  }

  return children;
};
