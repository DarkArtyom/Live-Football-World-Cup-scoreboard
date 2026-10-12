import { useEffect, type PropsWithChildren } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/Button/Button";
import { Loader } from "../../components/Loader/Loader";
import { Messages } from "../../matches/constants";
import { ScoreboardStatus } from "../../matches/types";
import { useScoreboard } from "./useScoreboard";

export const ScoreboardGate = ({ children }: PropsWithChildren) => {
  const { status, error, retry } = useScoreboard();

  useEffect(() => {
    if (status !== ScoreboardStatus.ERROR) {
      return;
    }

    toast.error(error ?? Messages.MATCHES_LOAD_FAILED, {
      toastId: "matches-load-failed",
    });
  }, [error, status]);

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
