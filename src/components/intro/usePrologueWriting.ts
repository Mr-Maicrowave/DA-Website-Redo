import { useCallback, useEffect, useRef, useState } from 'react';

export const PROLOGUE_BLOCKS = [
  {
    id: 'opening',
    text: 'There are books that tell stories.\nAnd there are books that begin them.',
    characterDelay: 26,
    pauseAfter: 420,
  },
  {
    id: 'welcome',
    text: 'Welcome to DA Tuition.',
    characterDelay: 30,
    pauseAfter: 520,
  },
  {
    id: 'body',
    text: 'Beyond these pages lies a place where curiosity is celebrated, confidence is built, and every student is encouraged to discover their potential.',
    characterDelay: 16,
    pauseAfter: 260,
  },
  {
    id: 'invitation',
    text: 'We invite you to step beyond these pages and begin your journey.',
    characterDelay: 20,
    pauseAfter: 220,
  },
] as const;

export type PrologueBlockId = (typeof PROLOGUE_BLOCKS)[number]['id'];

type ButtonPhase = 'hidden' | 'drawing' | 'ready';

type UsePrologueWritingOptions = {
  active: boolean;
  reducedMotion: boolean;
};

const emptyCharacterCounts = (): Record<PrologueBlockId, number> => ({
  opening: 0,
  welcome: 0,
  body: 0,
  invitation: 0,
});

export const usePrologueWriting = ({
  active,
  reducedMotion,
}: UsePrologueWritingOptions) => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [characterCounts, setCharacterCounts] = useState(emptyCharacterCounts);
  const [activeBlockId, setActiveBlockId] = useState<PrologueBlockId | null>(null);
  const [buttonPhase, setButtonPhase] = useState<ButtonPhase>('hidden');
  const [complete, setComplete] = useState(false);
  const generationRef = useRef(0);
  const currentBlockRef = useRef<PrologueBlockId | null>(null);
  const completeCurrentRef = useRef(false);
  const skipCountRef = useRef(0);

  const revealEverything = useCallback(() => {
    generationRef.current += 1;
    setLabelVisible(true);
    setCharacterCounts(Object.fromEntries(
      PROLOGUE_BLOCKS.map(block => [block.id, block.text.length]),
    ) as Record<PrologueBlockId, number>);
    setActiveBlockId(null);
    setButtonPhase('ready');
    setComplete(true);
  }, []);

  const skip = useCallback(() => {
    if (!active || complete) return;

    skipCountRef.current += 1;
    if (skipCountRef.current >= 2) {
      revealEverything();
      return;
    }

    setLabelVisible(true);
    completeCurrentRef.current = true;

    const currentBlock = currentBlockRef.current;
    if (!currentBlock) return;
    const block = PROLOGUE_BLOCKS.find(candidate => candidate.id === currentBlock);
    if (!block) return;
    setCharacterCounts(current => ({ ...current, [currentBlock]: block.text.length }));
  }, [active, complete, revealEverything]);

  useEffect(() => {
    if (!active) {
      generationRef.current += 1;
      currentBlockRef.current = null;
      completeCurrentRef.current = false;
      skipCountRef.current = 0;
      setLabelVisible(false);
      setCharacterCounts(emptyCharacterCounts());
      setActiveBlockId(null);
      setButtonPhase('hidden');
      setComplete(false);
      return;
    }

    if (reducedMotion) {
      revealEverything();
      return;
    }

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    let timer: number | undefined;

    const wait = (duration: number) => new Promise<void>(resolve => {
      timer = window.setTimeout(resolve, duration);
    });

    const stillCurrent = () => generationRef.current === generation;

    const run = async () => {
      await wait(600);
      if (!stillCurrent()) return;

      setLabelVisible(true);
      await wait(350);
      if (!stillCurrent()) return;

      for (const block of PROLOGUE_BLOCKS) {
        currentBlockRef.current = block.id;
        setActiveBlockId(block.id);
        completeCurrentRef.current = false;

        for (let characterIndex = 1; characterIndex <= block.text.length; characterIndex += 1) {
          if (!stillCurrent()) return;
          if (completeCurrentRef.current) {
            setCharacterCounts(current => ({ ...current, [block.id]: block.text.length }));
            break;
          }

          setCharacterCounts(current => ({ ...current, [block.id]: characterIndex }));
          await wait(block.characterDelay);
        }

        if (!stillCurrent()) return;
        setActiveBlockId(null);
        currentBlockRef.current = null;
        await wait(block.pauseAfter);
        if (!stillCurrent()) return;
      }

      setButtonPhase('drawing');
      await wait(620);
      if (!stillCurrent()) return;
      setButtonPhase('ready');
      setComplete(true);
    };

    void run();

    return () => {
      generationRef.current += 1;
      window.clearTimeout(timer);
    };
  }, [active, reducedMotion, revealEverything]);

  const textFor = useCallback((blockId: PrologueBlockId) => {
    const block = PROLOGUE_BLOCKS.find(candidate => candidate.id === blockId);
    return block?.text.slice(0, characterCounts[blockId]) ?? '';
  }, [characterCounts]);

  return {
    activeBlockId,
    buttonPhase,
    complete,
    labelVisible,
    skip,
    textFor,
  };
};
