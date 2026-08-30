import {
  CircleHelp,
  Eye,
  Flag,
  LibraryBig,
  MessageSquareText,
  Sprout,
  Star,
  Trophy,
} from 'lucide-react';

export const supportPrinciples = [
  { title: 'Questions encouraged', description: 'There’s always room to ask.', Icon: CircleHelp },
  { title: 'Mistakes noticed', description: 'Before they become gaps.', Icon: Eye },
  { title: 'Feedback happens here', description: 'Specific. Immediate. Personal.', Icon: MessageSquareText },
  { title: 'Weaknesses addressed', description: 'So confidence can grow.', Icon: Sprout },
] as const;

export const milestones = [
  { title: 'Foundations', description: 'Strong understanding of the basics.', Icon: Sprout },
  { title: 'Study habits', description: 'Better routines. Better focus.', Icon: LibraryBig },
  { title: 'Independence', description: 'Thinking for themselves.', Icon: Flag },
  { title: 'Confidence', description: 'They know they can do it.', Icon: Star },
  { title: 'Readiness', description: 'Ready for assessments, ready for what’s next.', Icon: Trophy },
] as const;
