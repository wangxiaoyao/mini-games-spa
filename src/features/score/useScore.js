import { useContext } from 'react';
import { ScoreContext } from './ScoreProvider';

export function useScore() {
  const context = useContext(ScoreContext);

  if (context === null) {
    throw new Error('useScore must be used within ScoreProvider');
  }

  return context;
}
