import { useScore } from '../score/useScore';
import { useOperationsGame } from './useOperationsGame';

export function OperationsPage() {
  const { decrementGamesLeft } = useScore();
  const { chooseOperation, currentNumbers, operations } = useOperationsGame();
  const [left, right, result] = currentNumbers;

  function handleOperationClick(operationLabel) {
    const isCorrect = chooseOperation(operationLabel);

    if (isCorrect) {
      window.alert('You won!');
      decrementGamesLeft();
      return;
    }

    window.alert('Incorrect');
  }

  return (
    <section className="operations-page">
      <div className="operations-box">
        <span className="operations-cell">{left}</span>
        <div className="operations-cell operations-buttons">
          {operations.map((operation) => (
            <button
              key={operation.label}
              className="operation-button"
              type="button"
              onClick={() => handleOperationClick(operation.label)}
            >
              {operation.label}
            </button>
          ))}
        </div>
        <span className="operations-cell">{right}</span>
        <span className="operations-cell">=</span>
        <span className="operations-cell">{result}</span>
      </div>
    </section>
  );
}
