import { useMemo, useState } from 'react';
import { operationNumbers } from './numbers';

const OPERATIONS = [
  {
    label: '+',
    test: (left, right, result) => left + right === result,
  },
  {
    label: '-',
    test: (left, right, result) => left - right === result,
  },
  {
    label: 'x',
    test: (left, right, result) => left * right === result,
  },
  {
    label: '÷',
    test: (left, right, result) => right !== 0 && left / right === result,
  },
];

export function useOperationsGame() {
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentNumbers = operationNumbers[questionIndex];
  const [left, right, result] = currentNumbers;
  const operations = useMemo(() => OPERATIONS, []);

  function chooseOperation(operationLabel) {
    const operation = operations.find((item) => item.label === operationLabel);

    if (!operation) {
      return false;
    }

    const isCorrect = operation.test(left, right, result);

    if (isCorrect) {
      setQuestionIndex((currentIndex) => (currentIndex + 1) % operationNumbers.length);
    }

    return isCorrect;
  }

  return {
    currentNumbers,
    operations,
    chooseOperation,
  };
}
