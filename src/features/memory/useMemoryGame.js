import { useCallback, useEffect, useRef, useState } from 'react';

export const MEMORY_BUTTONS = ['A', 'B', 'C', 'D'];

const DISPLAY_MS = 1000;
const GAP_MS = 200;
const WINNING_ROUND = 5;

function createSequence(length) {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * MEMORY_BUTTONS.length);
    return MEMORY_BUTTONS[index];
  });
}

export function useMemoryGame({ onWin } = {}) {
  const [round, setRound] = useState(1);
  const [restartToken, setRestartToken] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [visibleChar, setVisibleChar] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [inputIndex, setInputIndex] = useState(0);
  const timersRef = useRef([]);
  const onWinRef = useRef(onWin);

  useEffect(() => {
    onWinRef.current = onWin;
  }, [onWin]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const restartGame = useCallback(() => {
    setRound(1);
    setRestartToken((currentToken) => currentToken + 1);
  }, []);

  const startRound = useCallback(
    (nextRound) => {
      clearTimers();

      const nextSequence = createSequence(nextRound);
      setSequence(nextSequence);
      setVisibleChar(null);
      setIsInputDisabled(true);
      setInputIndex(0);

      nextSequence.forEach((char, index) => {
        const showAt = index * (DISPLAY_MS + GAP_MS);

        timersRef.current.push(
          window.setTimeout(() => {
            setVisibleChar(char);
          }, showAt),
        );

        timersRef.current.push(
          window.setTimeout(() => {
            setVisibleChar(null);
          }, showAt + DISPLAY_MS),
        );
      });

      const inputEnabledAt = (nextSequence.length - 1) * (DISPLAY_MS + GAP_MS) + DISPLAY_MS;
      timersRef.current.push(
        window.setTimeout(() => {
          setIsInputDisabled(false);
        }, inputEnabledAt),
      );
    },
    [clearTimers],
  );

  useEffect(() => {
    startRound(round);

    return clearTimers;
  }, [clearTimers, restartToken, round, startRound]);

  const handleButtonClick = useCallback(
    (value) => {
      if (isInputDisabled) {
        return;
      }

      if (value !== sequence[inputIndex]) {
        window.alert('You lost!');
        restartGame();
        return;
      }

      const nextInputIndex = inputIndex + 1;

      if (nextInputIndex < sequence.length) {
        setInputIndex(nextInputIndex);
        return;
      }

      if (round === WINNING_ROUND) {
        window.alert('You won!');
        onWinRef.current?.();
        restartGame();
        return;
      }

      setRound((currentRound) => currentRound + 1);
    },
    [inputIndex, isInputDisabled, restartGame, round, sequence],
  );

  return {
    round,
    visibleChar,
    isInputDisabled,
    buttons: MEMORY_BUTTONS,
    handleButtonClick,
  };
}
