import { useEffect, type RefObject } from 'react';
import { aquariumFish } from './primaryStoryData';
import { keepInBounds, steerFromPointer, stepFish, type FishMotion } from './aquariumPhysics';
import { advanceRipple, createRipple, createWakeRipple, smoothPointer, type WaterPointer, type WaterRipple } from './waterEffects';

type Pixi = typeof import('pixi.js');
type BubbleVisual = { graphic: import('pixi.js').Graphics; x: number; y: number; vx: number; vy: number; size: number; age: number; maxAge: number; phase: number; active: boolean };
type RippleVisual = WaterRipple & { graphic: import('pixi.js').Graphics };

const coverSprite = (sprite: import('pixi.js').Sprite, width: number, height: number) => {
  const textureWidth = Math.max(sprite.texture.width, 1);
  const textureHeight = Math.max(sprite.texture.height, 1);
  const scale = Math.max(width / textureWidth, height / textureHeight);
  sprite.scale.set(scale);
  sprite.position.set((width - textureWidth * scale) / 2, (height - textureHeight * scale) / 2);
};

const createDisplacementCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const context = canvas.getContext('2d');
  if (!context) return canvas;
  context.fillStyle = 'rgb(128,128,128)';
  context.fillRect(0, 0, 160, 160);
  const gradient = context.createRadialGradient(80, 80, 3, 80, 80, 79);
  gradient.addColorStop(0, 'rgb(158,102,128)');
  gradient.addColorStop(.3, 'rgb(102,152,128)');
  gradient.addColorStop(.54, 'rgb(150,108,128)');
  gradient.addColorStop(.76, 'rgb(116,140,128)');
  gradient.addColorStop(1, 'rgb(128,128,128)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 160, 160);
  return canvas;
};

const buildWorld = async (PIXI: Pixi, app: import('pixi.js').Application, world: import('pixi.js').Container) => {
  const layerSources = [
    '/primary-reference/aquarium/water-background.png',
    '/primary-reference/aquarium/distant-reef.png',
    '/primary-reference/aquarium/midground-reef.png',
  ];
  const layerTextures = await Promise.all(layerSources.map((source) => PIXI.Assets.load(source)));
  layerTextures.forEach((texture) => {
    const sprite = new PIXI.Sprite(texture);
    coverSprite(sprite, app.screen.width, app.screen.height);
    world.addChild(sprite);
  });

  const fishTextures = await Promise.all(aquariumFish.map((fish) => PIXI.Assets.load(fish.src)));
  const motions: FishMotion[] = [];
  const sprites = fishTextures.map((texture, index) => {
    const definition = aquariumFish[index];
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(.5);
    sprite.scale.set(definition.start.scale);
    sprite.position.set(definition.start.x * app.screen.width, definition.start.y * app.screen.height);
    world.addChild(sprite);
    motions.push({ x: sprite.x, y: sprite.y, vx: (index % 2 ? -1 : 1) * (.42 + index * .04), vy: (index % 3 - 1) * .08, phase: index * .9, speed: definition.start.speed });
    return sprite;
  });

  const foreground = new PIXI.Sprite(await PIXI.Assets.load('/primary-reference/aquarium/foreground-reef.png'));
  coverSprite(foreground, app.screen.width, app.screen.height);
  world.addChild(foreground);
  return { sprites, motions };
};

export const useAquariumEngine = (hostRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || dispose) return;
      const PIXI = await import('pixi.js');
      if (cancelled) return;
      const app = new PIXI.Application();
      await app.init({ resizeTo: host, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(devicePixelRatio, 1.5), preference: 'webgl' });
      if (cancelled) { app.destroy(true); return; }
      host.prepend(app.canvas);

      const world = new PIXI.Container();
      const effects = new PIXI.Container();
      app.stage.addChild(world, effects);
      const { sprites, motions } = await buildWorld(PIXI, app, world);

      const displacementSprite = new PIXI.Sprite(PIXI.Texture.from(createDisplacementCanvas()));
      displacementSprite.anchor.set(.5);
      displacementSprite.position.set(-500, -500);
      world.addChild(displacementSprite);
      const displacement = new PIXI.DisplacementFilter({ sprite: displacementSprite, scale: { x: 0, y: 0 } });
      world.filters = [displacement];

      const pointerRef: { current: WaterPointer & { active: boolean; dragging: boolean; lastX: number; lastY: number; lastTime: number } } = {
        current: { x: -500, y: -500, targetX: -500, targetY: -500, speed: 0, targetSpeed: 0, active: false, dragging: false, lastX: -500, lastY: -500, lastTime: performance.now() },
      };
      const ripplesRef: { current: RippleVisual[] } = { current: [] };
      const bubblePoolRef: { current: BubbleVisual[] } = { current: [] };
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      let lastWakeAt = 0;

      const spawnBubble = (x: number, y: number, energetic = false) => {
        let bubble = bubblePoolRef.current.find((item) => !item.active);
        if (!bubble) {
          const graphic = new PIXI.Graphics();
          effects.addChild(graphic);
          bubble = { graphic, x, y, vx: 0, vy: 0, size: 4, age: 0, maxAge: 1400, phase: 0, active: false };
          bubblePoolRef.current.push(bubble);
        }
        Object.assign(bubble, {
          x: x + (Math.random() - .5) * (energetic ? 46 : 22), y: y + (Math.random() - .5) * 20,
          vx: (Math.random() - .5) * (energetic ? .55 : .25), vy: -(energetic ? .7 + Math.random() * .8 : .35 + Math.random() * .45),
          size: 2.5 + Math.random() * (energetic ? 7 : 4), age: 0, maxAge: 1100 + Math.random() * 800,
          phase: Math.random() * Math.PI * 2, active: true,
        });
      };
      const spawnRipple = (x: number, y: number) => {
        [0, 100, 200].forEach((delay) => {
          const graphic = new PIXI.Graphics();
          effects.addChild(graphic);
          ripplesRef.current.push({ ...createRipple(x, y, delay), graphic });
        });
        for (let index = 0; index < 7; index += 1) spawnBubble(x, y, true);
      };
      const spawnCursorWake = (x: number, y: number) => {
        const graphic = new PIXI.Graphics();
        effects.addChild(graphic);
        ripplesRef.current.push({ ...createWakeRipple(x, y), graphic });
      };
      const localPoint = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        return { x: (event.clientX - rect.left) * (app.screen.width / rect.width), y: (event.clientY - rect.top) * (app.screen.height / rect.height) };
      };
      const onMove = (event: PointerEvent) => {
        const point = localPoint(event);
        const now = performance.now();
        const elapsed = Math.max(now - pointerRef.current.lastTime, 8);
        const distance = Math.hypot(point.x - pointerRef.current.lastX, point.y - pointerRef.current.lastY);
        Object.assign(pointerRef.current, { targetX: point.x, targetY: point.y, targetSpeed: distance / elapsed * 16.667, active: event.pointerType === 'mouse' || pointerRef.current.dragging, lastX: point.x, lastY: point.y, lastTime: now });
        if (!reducedMotion.matches && distance > 3 && now - lastWakeAt > 38) {
          spawnCursorWake(point.x, point.y);
          lastWakeAt = now;
        }
        if (pointerRef.current.dragging && Math.random() < .14) spawnBubble(point.x, point.y);
      };
      const onDown = (event: PointerEvent) => {
        if ((event.target as HTMLElement).closest('button, a, aside, .primary-aquarium__fact')) return;
        const point = localPoint(event);
        Object.assign(pointerRef.current, { dragging: true, active: true, targetX: point.x, targetY: point.y });
        spawnRipple(point.x, point.y);
      };
      const onUp = () => { pointerRef.current.dragging = false; };
      const onLeave = () => { pointerRef.current.active = pointerRef.current.dragging; pointerRef.current.targetSpeed = 0; };
      host.addEventListener('pointermove', onMove, { passive: true });
      host.addEventListener('pointerdown', onDown);
      host.addEventListener('pointerup', onUp);
      host.addEventListener('pointercancel', onUp);
      host.addEventListener('pointerleave', onLeave, { passive: true });

      const section = host.closest('.primary-aquarium');
      const fishButtons = Array.from(section?.querySelectorAll<HTMLButtonElement>('.primary-aquarium__fish-button') ?? []);
      section?.classList.add('is-pixi-ready');
      let wakeClock = 0;
      app.ticker.add((ticker) => {
        const deltaMs = Math.min(ticker.deltaMS, 40);
        const pointer = pointerRef.current;
        Object.assign(pointer, smoothPointer(pointer, .2));
        pointer.targetSpeed *= .9;
        const motionStrength = reducedMotion.matches ? 0 : Math.min(pointer.speed / 48, 1);
        const activeStrength = pointer.active ? (.4 + motionStrength * .75 + (pointer.dragging ? .18 : 0)) : 0;
        displacementSprite.position.set(pointer.x, pointer.y);
        const radius = 105 + motionStrength * 55 + (pointer.dragging ? 18 : 0);
        displacementSprite.width = radius * 2;
        displacementSprite.height = radius * 2;
        displacementSprite.rotation += (.0015 + motionStrength * .004) * ticker.deltaTime;
        displacement.scale.x = 12 * activeStrength;
        displacement.scale.y = 10 * activeStrength;

        wakeClock += deltaMs;
        if (!reducedMotion.matches && pointer.active && pointer.speed > 8 && wakeClock > 90) { spawnBubble(pointer.x, pointer.y); wakeClock = 0; }
        if (!reducedMotion.matches) sprites.forEach((sprite, index) => {
          let next = stepFish(motions[index], deltaMs);
          if (pointer.active) next = steerFromPointer(next, pointer, 175, 2.4);
          next = keepInBounds(next, app.screen.width, app.screen.height, 54);
          motions[index] = next;
          sprite.position.set(next.x, next.y);
          const button = fishButtons[index];
          if (button) {
            button.style.left = `${next.x / app.screen.width * 100}%`;
            button.style.top = `${next.y / app.screen.height * 100}%`;
            button.style.transform = 'translate(-50%, -50%)';
          }
          sprite.scale.x = Math.abs(sprite.scale.x) * (next.vx < 0 ? -1 : 1);
          sprite.rotation = Math.max(-.16, Math.min(.16, next.vy * .08));
        });

        ripplesRef.current.forEach((ripple) => {
          Object.assign(ripple, advanceRipple(ripple, deltaMs));
          ripple.graphic.clear();
          if (!ripple.active || ripple.age < 0) { if (!ripple.active) ripple.graphic.destroy(); return; }
          const wobble = 1 + Math.sin(ripple.age * .018) * .025;
          const wake = ripple.kind === 'wake';
          ripple.graphic.ellipse(ripple.x, ripple.y, ripple.radius * wobble, ripple.radius * (wake ? .58 : .42)).stroke({ color: 0xe8fbff, width: Math.max(.8, (wake ? 2 : 3) * ripple.strength), alpha: ripple.alpha });
        });
        ripplesRef.current = ripplesRef.current.filter((ripple) => ripple.active);
        bubblePoolRef.current.forEach((bubble) => {
          if (!bubble.active) return;
          bubble.age += deltaMs; bubble.x += bubble.vx + Math.sin(bubble.age * .004 + bubble.phase) * .16; bubble.y += bubble.vy;
          const progress = bubble.age / bubble.maxAge;
          bubble.graphic.clear();
          if (progress >= 1 || bubble.y < 10) { bubble.active = false; return; }
          bubble.graphic.circle(bubble.x, bubble.y, bubble.size).stroke({ color: 0xf1fdff, width: 1.2, alpha: .48 * (1 - progress) });
          bubble.graphic.circle(bubble.x - bubble.size * .3, bubble.y - bubble.size * .3, Math.max(1, bubble.size * .18)).fill({ color: 0xffffff, alpha: .4 * (1 - progress) });
        });
      });

      const visibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start();
        else app.ticker.stop();
      }, { rootMargin: '120px' });
      visibilityObserver.observe(host);

      dispose = () => {
        host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerdown', onDown); host.removeEventListener('pointerup', onUp); host.removeEventListener('pointercancel', onUp); host.removeEventListener('pointerleave', onLeave);
        visibilityObserver.disconnect();
        fishButtons.forEach((button) => button.removeAttribute('style'));
        section?.classList.remove('is-pixi-ready');
        app.destroy(true, { children: true });
      };
      observer.disconnect();
    }, { rootMargin: '300px' });
    observer.observe(host);
    return () => { cancelled = true; observer.disconnect(); dispose?.(); };
  }, [hostRef]);
};
