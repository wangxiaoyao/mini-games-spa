import { useScore } from '../score/useScore';
import { GAME_SIZE, SHOOTER_SIZE, TARGET_SIZE, useSpaceGame } from './useSpaceGame';

export function SpacePage() {
  const { decrementGamesLeft } = useScore();
  const { shooterX, targets } = useSpaceGame({ onWin: decrementGamesLeft });

  return (
    <section className="space-page">
      <div className="space-window" aria-label="Space invaders game window">
        {targets.map((target) => (
          <div
            key={target.id}
            className="space-target"
            style={{
              left: target.x,
              top: target.y,
              width: TARGET_SIZE,
              height: TARGET_SIZE,
            }}
          />
        ))}
        <div
          className="space-shooter"
          style={{
            left: shooterX,
            top: GAME_SIZE - SHOOTER_SIZE,
            width: SHOOTER_SIZE,
            height: SHOOTER_SIZE,
          }}
        />
      </div>
    </section>
  );
}
