export function getStudentName(studentFirstName?: string): string {
  return studentFirstName?.trim() || 'your child';
}
