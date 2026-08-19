import React from 'react';
import { Composition, registerRoot } from 'remotion';
import IntroVideo from './IntroVideo';
import { BlurSlide, BLUR_SLIDE_DURATION } from '../src/examples/BlurSlide';

export const Root = () => (
  <>
    <Composition
      id="IntroVideo"
      component={IntroVideo}
      durationInFrames={288}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="BlurSlide"
      component={BlurSlide}
      durationInFrames={BLUR_SLIDE_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
