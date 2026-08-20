// src/features/maths-topic-network/MathsTopicNetwork.tsx
import { useIsMobile } from '@/hooks/use-mobile';
import MathsTopicNetworkDiagram from './MathsTopicNetworkDiagram';
import MathsTopicNetworkMobile from './MathsTopicNetworkMobile';

export function MathsTopicNetwork() {
  const isMobile = useIsMobile();
  return isMobile ? <MathsTopicNetworkMobile /> : <MathsTopicNetworkDiagram />;
}
