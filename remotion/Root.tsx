import React from 'react';
import { Composition, registerRoot } from 'remotion';
import IntroVideo from './IntroVideo';

export const Root = () => (
  <Composition
    id="IntroVideo"
    component={IntroVideo}
    durationInFrames={288}
    fps={24}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
