import { fetchInitialMatches, toLoadError } from "./fetchInitialMatches";
import { INITIAL_MATCHES } from "./initialMatches";
import { Messages } from "../matches/constants";

describe("fetchInitialMatches", () => {
  it("returns a copy of the seeded matches after the load delay", async () => {
    vi.useFakeTimers();
    const pending = fetchInitialMatches();

    await vi.advanceTimersByTimeAsync(600);
    const matches = await pending;

    expect(matches).toHaveLength(INITIAL_MATCHES.length);
    expect(matches[0]).toEqual(INITIAL_MATCHES[0]);
    expect(matches[0]).not.toBe(INITIAL_MATCHES[0]);
    vi.useRealTimers();
  });

  it("turns an unknown failure into a readable error", () => {
    expect(toLoadError("offline")).toEqual(
      new Error(Messages.MATCHES_LOAD_FAILED),
    );
    expect(toLoadError(new Error("network"))).toEqual(new Error("network"));
  });
});
