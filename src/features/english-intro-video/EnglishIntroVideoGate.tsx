import { VideoArrivalGate } from '../intro-video/VideoArrivalGate';
import {
  markEnglishIntroPlayedThisAppLoad,
  shouldShowEnglishIntroOnThisAppLoad,
} from './english-intro-visit-state';

export const EnglishIntroVideoGate = () => {
  if (!shouldShowEnglishIntroOnThisAppLoad()) return null;

  return <VideoArrivalGate subject="English" videoSrc="/english_intro_video.mp4" posterSrc="/images/intro-posters/english-intro.jpg" onShow={markEnglishIntroPlayedThisAppLoad} />;
};
