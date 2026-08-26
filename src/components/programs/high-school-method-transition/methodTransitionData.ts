import { ClipboardCheck, MessageCircle, Pencil, Search, Send } from 'lucide-react';

export type MethodId = 'diagnose' | 'explain' | 'practise' | 'apply' | 'review';
export type MethodItem = { id: MethodId; label: string; accent: string; bloom: string; card?: string; Icon: typeof Search };

export const methodItems: MethodItem[] = [
  { id: 'diagnose', label: 'Diagnose', accent: '#1f766d', bloom: '/images/programs/high-school-method-transition/method-bloom-diagnose-teal-v1.png', Icon: Search },
  { id: 'explain', label: 'Explain', accent: '#1f5d89', bloom: '/images/programs/high-school-method-transition/method-bloom-explain-green-v1.png', card: '/images/programs/high-school-method-transition/method-card-explain-blue-v1.png', Icon: MessageCircle },
  { id: 'practise', label: 'Practise', accent: '#7652a8', bloom: '/images/programs/high-school-method-transition/method-bloom-practise-lavender-v1.png', card: '/images/programs/high-school-method-transition/method-card-practise-purple-v1.png', Icon: Pencil },
  { id: 'apply', label: 'Apply', accent: '#cf6f35', bloom: '/images/programs/high-school-method-transition/method-bloom-apply-peach-v1.png', card: '/images/programs/high-school-method-transition/method-card-apply-orange-v1.png', Icon: Send },
  { id: 'review', label: 'Review', accent: '#ad7414', bloom: '/images/programs/high-school-method-transition/method-bloom-review-gold-v1.png', card: '/images/programs/high-school-method-transition/method-card-review-gold-v1.png', Icon: ClipboardCheck },
];
