import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import test, { after, before } from "node:test";
import puppeteer from "puppeteer";
import { createServer } from "vite";

const SHOTS = "/tmp/learning-journey-qa";
const externalUrl = process.env.LEARNING_JOURNEY_BASE_URL;
let browser;
let server;
let baseUrl;

before(async () => {
  await mkdir(SHOTS, { recursive: true });
  if (externalUrl) baseUrl = externalUrl.replace(/\/$/, "");
  else {
    server = await createServer({ logLevel: "silent", server: { host: "127.0.0.1", port: 0 } });
    await server.listen();
    const address = server.httpServer?.address();
    assert.ok(address && typeof address === "object");
    baseUrl = `http://127.0.0.1:${address.port}`;
  }
  browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
}, { timeout: 30_000 });

after(async () => {
  await browser?.close();
  await server?.close();
});

const settle = (delay = 900) => new Promise((resolve) => setTimeout(resolve, delay));

const openJourney = async ({ width, height, reducedMotion = false }) => {
  const page = await browser.newPage();
  const issues = [];
  await page.setViewport({ width, height });
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  }
  page.on("pageerror", (error) => issues.push(error.message));
  page.on("console", (message) => {
    if (!["error", "warning", "warn"].includes(message.type())) return;
    const text = message.text();
    if (/React Router Future Flag Warning|welcome\.webp was preloaded/.test(text)) return;
    issues.push(text);
  });
  await page.goto(`${baseUrl}/learning-formats`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForSelector("[data-journey-academic-arrival]");
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  });
  return { page, issues };
};

const getRange = (page) => page.evaluate(() => {
  const spacer = document.querySelector(".pin-spacer");
  const viewport = document.querySelector(".learning-journey__viewport");
  if (!(spacer instanceof HTMLElement) || !(viewport instanceof HTMLElement)) throw new Error("Pinned range missing");
  return { start: spacer.offsetTop, distance: spacer.offsetHeight - viewport.offsetHeight };
});

const scrollToProgress = async (page, range, progress) => {
  await page.evaluate(({ start, distance, progress }) => scrollTo(0, start + distance * progress), { ...range, progress });
  await settle(1_800);
};

test("desktop journey enforces five ordered gates and stops at the Step 7 placeholder", { timeout: 180_000 }, async () => {
  const { page, issues } = await openJourney({ width: 1280, height: 900 });
  try {
    const range = await getRange(page);
    await scrollToProgress(page, range, 0.99);
    const held = await page.evaluate(({ start, distance }) => {
      const scene = document.querySelector("[data-journey-academic-arrival]");
      const idle = document.querySelector("[data-journey-character-idle]");
      if (!(scene instanceof HTMLElement) || !(idle instanceof HTMLElement)) throw new Error("Encounter missing");
      const rect = scene.getBoundingClientRect();
      return {
        progress: (scrollY - start) / distance,
        left: rect.left,
        right: rect.right,
        idle: Number(getComputedStyle(idle).opacity),
        radios: document.querySelectorAll('input[name="academic-level"]').length,
        checked: document.querySelectorAll('input[name="academic-level"]:checked').length,
      };
    }, range);
    assert.ok(held.progress <= 0.41, `escaped academic hold: ${held.progress}`);
    assert.ok(held.left >= 0 && held.right <= 1280, JSON.stringify(held));
    assert.equal(held.radios, 3);
    assert.equal(held.checked, 0);
    assert.ok(held.idle >= 0.99);
    await page.screenshot({ path: `${SHOTS}/step2-arrival.png` });

    await page.focus('input[value="rebuilding"]');
    await page.keyboard.press("ArrowRight");
    await settle(180);
    const confirming = await page.evaluate(() => ({
      value: document.querySelector('input[name="academic-level"]:checked')?.value,
      phase: document.querySelector(".assessment-encounter")?.getAttribute("data-encounter-phase"),
      announcement: document.querySelector("[data-encounter-confirmation]")?.textContent?.trim(),
      dimmed: document.querySelectorAll('[data-dimmed="true"]').length,
    }));
    assert.deepEqual(confirming, { value: "year-level", phase: "confirming", announcement: "Got it.", dimmed: 2 });

    await settle(2_000);
    await scrollToProgress(page, range, 0.99);
    const confidenceHold = await page.evaluate(({ start, distance }) => {
      const scene = document.querySelector("[data-journey-confidence-arrival]");
      const idle = document.querySelector("[data-journey-character-idle]");
      if (!(scene instanceof HTMLElement) || !(idle instanceof HTMLElement)) throw new Error("Confidence encounter missing");
      const rect = scene.getBoundingClientRect();
      return {
        progress: (scrollY - start) / distance,
        left: rect.left,
        right: rect.right,
        idle: Number(getComputedStyle(idle).opacity),
      };
    }, range);
    assert.ok(confidenceHold.progress > held.progress);
    assert.ok(confidenceHold.progress <= 0.67, `escaped confidence hold: ${confidenceHold.progress}`);
    assert.ok(confidenceHold.left >= 0 && confidenceHold.right <= 1280, JSON.stringify(confidenceHold));
    assert.ok(confidenceHold.idle >= 0.99);

    await page.$eval('[data-encounter="confidence"] [data-encounter-choice="encouraged"]', (choice) => choice.click());
    await settle(2_000);
    await scrollToProgress(page, range, 0.99);
    const learningHabitsHold = await page.evaluate(({ start, distance }) => {
      const scene = document.querySelector('[data-journey-learning-habits-arrival]');
      if (!(scene instanceof HTMLElement)) throw new Error("Learning Habits encounter missing");
      const rect = scene.getBoundingClientRect();
      return { progress: (scrollY - start) / distance, left: rect.left, right: rect.right, radios: document.querySelectorAll('input[name="learning-habits"]').length, choiceOpacities: [...document.querySelectorAll('[data-encounter="learning-habits"] .assessment-choice')].map((choice) => Number(getComputedStyle(choice).opacity)) };
    }, range);
    assert.ok(learningHabitsHold.progress > confidenceHold.progress);
    assert.ok(learningHabitsHold.progress <= 0.89, `escaped learning habits hold: ${learningHabitsHold.progress}`);
    assert.ok(learningHabitsHold.left >= 0 && learningHabitsHold.right <= 1280, JSON.stringify(learningHabitsHold));
    assert.equal(learningHabitsHold.radios, 3);
    assert.ok(learningHabitsHold.choiceOpacities.every((opacity) => opacity >= 0.99), JSON.stringify(learningHabitsHold));

    await page.$eval('[data-encounter="learning-habits"] [data-encounter-choice="check-in"]', (choice) => choice.click());
    await settle(2_000);
    await scrollToProgress(page, range, 0.99);
    const motivationHold = await page.evaluate(({ start, distance }) => {
      const scene = document.querySelector('[data-journey-motivation-arrival]');
      if (!(scene instanceof HTMLElement)) throw new Error("Motivation encounter missing");
      const rect = scene.getBoundingClientRect();
      return { progress: (scrollY - start) / distance, left: rect.left, right: rect.right, radios: document.querySelectorAll('input[name="motivation"]').length, value: document.querySelector('input[name="learning-habits"]:checked')?.value };
    }, range);
    assert.equal(motivationHold.value, "check-in");
    assert.ok(motivationHold.progress <= 0.975, `escaped motivation hold: ${motivationHold.progress}`);
    assert.ok(motivationHold.left >= 0 && motivationHold.right <= 1280, JSON.stringify(motivationHold));
    assert.equal(motivationHold.radios, 3);
    await page.screenshot({ path: `${SHOTS}/step5-arrival.png` });

    await page.$eval('[data-encounter="motivation"] [data-encounter-choice="persistent"]', (choice) => choice.click());
    await settle(2_000);
    await scrollToProgress(page, range, 0.99);
    const goalsHold = await page.evaluate(({ start, distance }) => {
      const scene = document.querySelector('[data-journey-goals-arrival]');
      if (!(scene instanceof HTMLElement)) throw new Error("Goals encounter missing");
      const rect = scene.getBoundingClientRect();
      return { progress: (scrollY - start) / distance, left: rect.left, right: rect.right, opacity: Number(getComputedStyle(scene).opacity), radios: document.querySelectorAll('input[name="goals"]').length, value: document.querySelector('input[name="motivation"]:checked')?.value };
    }, range);
    assert.equal(goalsHold.value, "persistent");
    assert.ok(goalsHold.progress <= 0.965, `escaped goals hold: ${goalsHold.progress}`);
    assert.ok(goalsHold.left >= 0 && goalsHold.right <= 1280, JSON.stringify(goalsHold));
    assert.equal(goalsHold.radios, 3);
    assert.ok(goalsHold.opacity >= 0.99, JSON.stringify(goalsHold));
    await page.screenshot({ path: `${SHOTS}/step6-arrival.png` });

    const telescopeBefore = await page.$eval('.telescope-lookout__scope', (scope) => getComputedStyle(scope).transform);
    await page.hover('[data-encounter="goals"] [data-encounter-choice="extension"]');
    await settle(450);
    const telescopeAfter = await page.$eval('.telescope-lookout__scope', (scope) => getComputedStyle(scope).transform);
    assert.notEqual(telescopeAfter, telescopeBefore);

    await page.$eval('[data-encounter="goals"] [data-encounter-choice="steady-progress"]', (choice) => choice.click());
    await settle(3_000);
    const complete = await page.evaluate(() => ({
      value: document.querySelector('input[name="goals"]:checked')?.value,
      completionOpacity: Number(getComputedStyle(document.querySelector('[data-journey-completion]')).opacity),
      progressComplete: document.querySelectorAll('[data-journey-goals-arrival] [data-progress-state="complete"]').length,
      placeholder: document.querySelectorAll('[data-step-seven-placeholder]').length,
    }));
    assert.deepEqual(complete, { value: "steady-progress", completionOpacity: 1, progressComplete: 5, placeholder: 0 });
    await page.screenshot({ path: `${SHOTS}/step6-completion.png` });
    await page.click('[data-journey-completion] button');
    assert.equal(await page.$$eval('[data-step-seven-placeholder]', (nodes) => nodes.length), 1);
    assert.deepEqual(issues, []);
  } finally {
    await page.close();
  }
});

test("smaller screens keep the encounter in view without document overflow", { timeout: 120_000 }, async () => {
  for (const viewport of [{ width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    const { page, issues } = await openJourney(viewport);
    try {
      const range = await getRange(page);
      await scrollToProgress(page, range, 0.99);
      const state = await page.evaluate(() => {
        const scene = document.querySelector("[data-journey-academic-arrival]");
        if (!(scene instanceof HTMLElement)) throw new Error("Encounter missing");
        const rect = scene.getBoundingClientRect();
        return { left: rect.left, right: rect.right, scrollWidth: document.documentElement.scrollWidth, width: innerWidth };
      });
      assert.ok(state.left >= -1 && state.right <= state.width + 1, JSON.stringify(state));
      assert.ok(state.scrollWidth <= state.width + 1, JSON.stringify(state));
      assert.deepEqual(issues, []);
    } finally {
      await page.close();
    }
  }
});

test("reduced motion is unpinned and functional", { timeout: 120_000 }, async () => {
  const { page, issues } = await openJourney({ width: 1440, height: 900, reducedMotion: true });
  try {
    const state = await page.evaluate(() => ({
      pins: document.querySelectorAll(".pin-spacer").length,
      position: getComputedStyle(document.querySelector("[data-journey-academic-arrival]")).position,
      scrollHeight: document.documentElement.scrollHeight,
    }));
    assert.equal(state.pins, 0);
    assert.equal(state.position, "static");
    assert.ok(state.scrollHeight > 900);
    await page.click('input[value="above-level"]');
    assert.equal(await page.$eval('input[value="above-level"]', (input) => input.checked), true);
    assert.equal(await page.$$eval('input[name="confidence"]', (nodes) => nodes.length), 3);
    assert.equal(
      await page.$eval("#confidence-heading", (node) => node.textContent.trim()),
      "Even when they know the answer, what usually happens?",
    );
    await page.$eval(
      '[data-encounter="confidence"] [data-encounter-choice="encouraged"]',
      (choice) => choice.click(),
    );
    await settle(120);
    assert.equal(
      await page.$eval('[data-encounter="confidence"]', (node) => node.getAttribute("data-encounter-phase")),
      "confirming",
    );
    assert.equal(
      await page.$eval(
        '[data-encounter="confidence"] [data-encounter-confirmation]',
        (node) => node.textContent.trim(),
      ),
      "Got it.",
    );
    assert.equal(
      await page.$eval('input[name="confidence"][value="encouraged"]', (input) => input.checked),
      true,
    );
    await settle(900);
    await page.$eval(
      '[data-encounter="confidence"] [data-encounter-choice="quiet"]',
      (choice) => choice.click(),
    );
    assert.equal(
      await page.$eval('input[name="confidence"][value="quiet"]', (input) => input.checked),
      true,
    );
    assert.equal(await page.$$eval('input[name="learning-habits"]', (nodes) => nodes.length), 3);
    await page.$eval('[data-encounter="learning-habits"] [data-encounter-choice="independent"]', (choice) => choice.click());
    assert.equal(await page.$eval('input[name="learning-habits"][value="independent"]', (input) => input.checked), true);
    assert.equal(await page.$$eval('input[name="motivation"]', (nodes) => nodes.length), 3);
    await page.$eval('[data-encounter="motivation"] [data-encounter-choice="challenge-seeking"]', (choice) => choice.click());
    assert.equal(await page.$eval('input[name="motivation"][value="challenge-seeking"]', (input) => input.checked), true);
    await settle(900);
    await page.$eval('[data-encounter="motivation"] [data-encounter-choice="needs-encouragement"]', (choice) => choice.click());
    assert.equal(await page.$eval('input[name="motivation"][value="needs-encouragement"]', (input) => input.checked), true);
    assert.equal(await page.$$eval('input[name="goals"]', (nodes) => nodes.length), 3);
    await page.$eval('[data-encounter="goals"] [data-encounter-choice="extension"]', (choice) => choice.click());
    assert.equal(await page.$eval('input[name="goals"][value="extension"]', (input) => input.checked), true);
    await settle(900);
    await page.$eval('[data-encounter="goals"] [data-encounter-choice="confidence-foundations"]', (choice) => choice.click());
    assert.equal(await page.$eval('input[name="goals"][value="confidence-foundations"]', (input) => input.checked), true);
    await page.click('[data-journey-completion] button');
    assert.equal(await page.$$eval('[data-step-seven-placeholder]', (nodes) => nodes.length), 1);
    assert.equal(
      await page.$eval('input[name="academic-level"][value="above-level"]', (input) => input.checked),
      true,
    );
    assert.deepEqual(issues, []);
  } finally {
    await page.close();
  }
});

test("narrow reduced-motion Goals composition stacks without overflow", { timeout: 120_000 }, async () => {
  const { page, issues } = await openJourney({ width: 390, height: 844, reducedMotion: true });
  try {
    const state = await page.evaluate(() => {
      const scene = document.querySelector('[data-journey-goals-arrival]');
      const choices = [...document.querySelectorAll('[data-encounter="goals"] .assessment-choice')];
      if (!(scene instanceof HTMLElement)) throw new Error('Goals scene missing');
      return {
        tops: choices.map((choice) => choice.getBoundingClientRect().top),
        radios: document.querySelectorAll('input[name="goals"]').length,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    assert.equal(state.radios, 3);
    assert.ok(state.tops[0] < state.tops[1] && state.tops[1] < state.tops[2], JSON.stringify(state));
    assert.ok(state.scrollWidth <= 391, JSON.stringify(state));
    assert.deepEqual(issues, []);
  } finally {
    await page.close();
  }
});
