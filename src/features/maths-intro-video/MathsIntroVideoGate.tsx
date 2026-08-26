import { VideoArrivalGate } from '../intro-video/VideoArrivalGate';
import {
  markMathsIntroPlayedThisAppLoad,
  shouldShowMathsIntroOnThisAppLoad,
} from './maths-intro-visit-state';

export const MathsIntroVideoGate = () => {
  if (!shouldShowMathsIntroOnThisAppLoad()) return null;

  return <VideoArrivalGate subject="Mathematics" videoSrc="/math_intro_video.mp4" posterSrc="/images/intro-posters/maths-intro.jpg" onShow={markMathsIntroPlayedThisAppLoad} />;
};
