import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchInitialScore } from './scoreApi';

export const ScoreContext = createContext(null);

const INITIAL_SCORE_KEY = 'mini-games.initialScore';
const GAMES_LEFT_KEY = 'mini-games.gamesLeft';
const FALLBACK_SCORE = 5;

function readStoredNumber(key) {
  let storedValue = null;

  try {
    storedValue = window.localStorage.getItem(key);
  } catch {
    return null;
  }

  if (storedValue === null) {
    return null;
  }

  try {
    const parsedValue = Number(JSON.parse(storedValue));
    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function writeStoredNumber(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
}

export function ScoreProvider({ children }) {
  const [initialScore, setInitialScore] = useState(() => readStoredNumber(INITIAL_SCORE_KEY));
  const [gamesLeft, setGamesLeft] = useState(() => readStoredNumber(GAMES_LEFT_KEY));
  const [isLoadingInitialScore, setIsLoadingInitialScore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadInitialScore() {
      setIsLoadingInitialScore(true);
      setError(null);

      try {
        const score = await fetchInitialScore();

        if (!isActive) {
          return;
        }

        setInitialScore(score);
        writeStoredNumber(INITIAL_SCORE_KEY, score);

        setGamesLeft((currentGamesLeft) => {
          if (currentGamesLeft !== null) {
            return currentGamesLeft;
          }

          writeStoredNumber(GAMES_LEFT_KEY, score);
          return score;
        });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError.message);

        setInitialScore((currentInitialScore) => {
          const nextInitialScore = currentInitialScore ?? FALLBACK_SCORE;
          writeStoredNumber(INITIAL_SCORE_KEY, nextInitialScore);
          return nextInitialScore;
        });

        setGamesLeft((currentGamesLeft) => {
          const nextGamesLeft = currentGamesLeft ?? FALLBACK_SCORE;
          writeStoredNumber(GAMES_LEFT_KEY, nextGamesLeft);
          return nextGamesLeft;
        });
      } finally {
        if (isActive) {
          setIsLoadingInitialScore(false);
        }
      }
    }

    loadInitialScore();

    return () => {
      isActive = false;
    };
  }, []);

  const decrementGamesLeft = useCallback(() => {
    setGamesLeft((currentGamesLeft) => {
      const nextGamesLeft = Math.max((currentGamesLeft ?? initialScore ?? FALLBACK_SCORE) - 1, 0);
      writeStoredNumber(GAMES_LEFT_KEY, nextGamesLeft);
      return nextGamesLeft;
    });
  }, [initialScore]);

  const resetGamesLeft = useCallback(() => {
    const nextGamesLeft = initialScore ?? FALLBACK_SCORE;
    setGamesLeft(nextGamesLeft);
    writeStoredNumber(GAMES_LEFT_KEY, nextGamesLeft);
  }, [initialScore]);

  const value = useMemo(
    () => ({
      initialScore,
      gamesLeft,
      isLoadingInitialScore,
      error,
      decrementGamesLeft,
      resetGamesLeft,
    }),
    [decrementGamesLeft, error, gamesLeft, initialScore, isLoadingInitialScore, resetGamesLeft],
  );

  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>;
}
