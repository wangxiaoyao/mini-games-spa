import { useScore } from '../score/useScore';
import { useMemoryGame } from './useMemoryGame';

export function MemoryPage() {
  const { decrementGamesLeft } = useScore();
  const { buttons, handleButtonClick, isInputDisabled, visibleChar } = useMemoryGame({
    onWin: decrementGamesLeft,
  });

  return (
    <section className="memory-page">
      <div className="memory-buttons">
        {buttons.map((button) => (
          <button
            key={button}
            type="button"
            className="memory-button"
            disabled={isInputDisabled}
            onClick={() => handleButtonClick(button)}
          >
            {button}
          </button>
        ))}
      </div>
      <div className="memory-instruction-area">
        <div className="memory-instruction-box">{visibleChar}</div>
      </div>
    </section>
  );
}
