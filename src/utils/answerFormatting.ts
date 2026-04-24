export function formatAnswerDisplay(answer: string, isObjectiveQuiz: boolean): string {
  if (isObjectiveQuiz || !answer.includes("|")) {
    return answer;
  }

  return answer
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" | ");
}
