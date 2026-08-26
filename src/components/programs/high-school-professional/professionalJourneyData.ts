import { Search, Lightbulb, PencilLine, Rocket, ClipboardCheck, Blocks, CalendarDays, UserRound, Trophy, GraduationCap, MessageSquare, Flag } from 'lucide-react';

export const teachingStages = [
  { title: 'Diagnose', description: 'Identify strengths, weaknesses and learning gaps.', Icon: Search },
  { title: 'Explain', description: 'Break concepts into clear, manageable steps.', Icon: Lightbulb },
  { title: 'Practise', description: 'Use targeted questions to build accuracy.', Icon: PencilLine },
  { title: 'Apply', description: 'Transfer skills to unfamiliar and exam-style tasks.', Icon: Rocket },
  { title: 'Review', description: 'Track progress and refine strategies regularly.', Icon: ClipboardCheck },
] as const;

export const supportPrinciples = [
  { title: 'Small-group attention', description: 'More time for questions and individual support.', Icon: UserRound },
  { title: 'Questions encouraged', description: 'A safe place to ask, share and grow confidently.', Icon: MessageSquare },
  { title: 'Individual feedback', description: 'Specific guidance that shows how to improve.', Icon: ClipboardCheck },
  { title: 'Weaknesses caught early', description: 'We address gaps before they become barriers.', Icon: Flag },
] as const;

export const milestones = [
  { title: 'Stronger foundations', description: 'Build a solid base for future learning.', Icon: Blocks },
  { title: 'Better study habits', description: 'Smarter planning and consistent effort.', Icon: CalendarDays },
  { title: 'Greater independence', description: 'Take charge of learning and problem solving.', Icon: UserRound },
  { title: 'Assessment confidence', description: 'Approach tests and assignments with confidence.', Icon: Trophy },
  { title: 'Senior-school readiness', description: 'Skills and mindset for Years 11–12 and beyond.', Icon: GraduationCap },
] as const;
