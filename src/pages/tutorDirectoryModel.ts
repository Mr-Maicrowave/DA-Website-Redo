export type TutorDirectoryFilter = 'all' | 'english' | 'maths' | 'science' | 'primary';

type TutorDirectoryCandidate = {
  name: string;
  designation: string;
  tagline: string;
  subjects: string;
  hasPrimary: boolean;
  primarySubject: 'english' | 'math' | 'science' | 'both';
};

export function filterTutors<T extends TutorDirectoryCandidate>(
  tutors: readonly T[],
  filter: TutorDirectoryFilter,
  search: string,
): T[] {
  const query = search.trim().toLocaleLowerCase();
  return tutors.filter((tutor) => {
    const matchesFilter = filter === 'all'
      || (filter === 'english' && (tutor.primarySubject === 'english' || tutor.primarySubject === 'both'))
      || (filter === 'maths' && (tutor.primarySubject === 'math' || tutor.primarySubject === 'both'))
      || (filter === 'science' && tutor.primarySubject === 'science')
      || (filter === 'primary' && tutor.hasPrimary);
    const matchesQuery = !query || [tutor.name, tutor.designation, tutor.tagline, tutor.subjects]
      .some((value) => value.toLocaleLowerCase().includes(query));
    return matchesFilter && matchesQuery;
  });
}
