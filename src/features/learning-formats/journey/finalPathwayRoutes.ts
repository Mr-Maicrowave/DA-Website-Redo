import type { SubjectId } from "../logic/types.ts";

const ROUTES: Record<SubjectId, string> = {
  english: "/subjects/english",
  maths: "/subjects/mathematics",
  science: "/subjects/science",
  physics: "/subjects/science",
  chemistry: "/subjects/science",
  biology: "/subjects/science",
  "business-studies": "/subjects/business-studies",
  "legal-studies": "/subjects/legal-studies",
};

export function routeForSubject(subject: SubjectId): string { return ROUTES[subject]; }
