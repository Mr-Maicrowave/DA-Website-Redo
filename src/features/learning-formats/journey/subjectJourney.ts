export function subjectContinueLabel(count: number): string {
  return `Continue with ${count} ${count === 1 ? "subject" : "subjects"} →`;
}
