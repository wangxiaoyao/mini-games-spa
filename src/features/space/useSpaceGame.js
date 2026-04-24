import { useCallback, useEffect, useRef, useState } from 'react';

export const GAME_SIZE = 500;
export const SHOOTER_SIZE = 10;
export const TARGET_SIZE = 20;
export const TARGET_GAP = 15;
export const TARGET_COLUMNS = 10;
export const TARGET_ROWS = 2;
export const SHOOTER_STEP = 1;

function createTargets() {
  return Array.from({ length: TARGET_ROWS * TARGET_COLUMNS }, (_, index) => {
    const row = Math.floor(index / TARGET_COLUMNS);
    const column = index % TARGET_COLUMNS;

    return {
      id: `${row}-${column}`,
      x: column * (TARGET_SIZE + TARGET_GAP),
      y: row * (TARGET_SIZE + TARGET_GAP),
    };
  });
}

function doesShooterOverlapTarget(shooterX, target) {
  const shooterLeft = shooterX;
  const shooterRight = shooterX + SHOOTER_SIZE;
  const targetLeft = target.x;
  const targetRight = target.x + TARGET_SIZE;

  return shooterLeft < targetRight && shooterRight > targetLeft;
}

function chooseHitTarget(shooterX, targets) {
  return targets.find((target) => doesShooterOverlapTarget(shooterX, target));
}

export function useSpaceGame({ onWin } = {}) {
  const [shooterX, setShooterX] = useState(0);
  const [targets, setTargets] = useState(() => createTargets());
  const shooterXRef = useRef(0);
  const onWinRef = useRef(onWin);

  useEffect(() => {
    onWinRef.current = onWin;
  }, [onWin]);

  const resetGame = useCallback(() => {
    shooterXRef.current = 0;
    setShooterX(0);
    setTargets(createTargets());
  }, []);

  const moveShooter = useCallback((direction) => {
    setShooterX((currentX) => {
      const nextX = Math.min(
        Math.max(currentX + direction * SHOOTER_STEP, 0),
        GAME_SIZE - SHOOTER_SIZE,
      );
      shooterXRef.current = nextX;
      return nextX;
    });
  }, []);

  const shoot = useCallback(() => {
    const hitTarget = chooseHitTarget(shooterXRef.current, targets);

    if (!hitTarget) {
      return;
    }

    const nextTargets = targets.filter((target) => target.id !== hitTarget.id);
    setTargets(nextTargets);

    if (nextTargets.length === 0) {
      window.alert('You won!');
      onWinRef.current?.();
      resetGame();
    }
  }, [resetGame, targets]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveShooter(-1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveShooter(1);
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        shoot();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveShooter, shoot]);

  return {
    shooterX,
    targets,
  };
}
