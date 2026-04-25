export const SCORE_URL = "/db/score.json";

export async function fetchInitialScore() {
  const response = await fetch(SCORE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch initial score");
  }

  const data = await response.json();

  if (!Number.isFinite(data.score)) {
    throw new Error("Initial score response is invalid");
  }

  return data.score;
}
