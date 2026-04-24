import { useEffect, useRef } from 'react';
import { useScore } from '../score/useScore';

export function DashboardPage() {
  const { gamesLeft, isLoadingInitialScore, resetGamesLeft } = useScore();
  const hasShownCongratulationsRef = useRef(false);

  useEffect(() => {
    if (isLoadingInitialScore || gamesLeft !== 0 || hasShownCongratulationsRef.current) {
      return;
    }

    hasShownCongratulationsRef.current = true;
    window.alert('Congratulations!');
    resetGamesLeft();
  }, [gamesLeft, isLoadingInitialScore, resetGamesLeft]);

  const displayedGamesLeft = isLoadingInitialScore || gamesLeft === null ? '...' : gamesLeft;

  return (
    <section className="dashboard-page">
      <p className="dashboard-title">Please choose an option from the sidebar.</p>
      <p>
        Games left to win: {displayedGamesLeft}{' '}
        <button className="reset-button" type="button" onClick={resetGamesLeft}>
          (reset)
        </button>
      </p>
    </section>
  );
}
