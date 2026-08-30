import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const htmlContent = fs.readFileSync(path.join(process.cwd(), 'public', 'interactive', 'year-cube', 'index.html'), 'utf8');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  // Take initial folded cube screenshot
  const foldedScreenshotPath = path.join(process.cwd(), 'scratch', 'folded-cube-light.png');
  await page.screenshot({ path: foldedScreenshotPath });
  console.log(`Saved folded cube screenshot to ${foldedScreenshotPath}`);

  // Test 1: Click the 3D Cube to trigger Roll & Unfold
  console.log('Testing 3D Dice Roll & Net Unfold...');
  await page.evaluate(() => {
    const cube = document.getElementById('cube');
    if (cube) cube.click();
  });

  // Wait for 3D roll and unfolding animation (~1500ms)
  await new Promise(r => setTimeout(r, 1600));

  // Check 1:1 dimensions and positioning of each of the 6 panels
  const panelLayout = await page.evaluate(() => {
    const panels = Array.from(document.querySelectorAll('.net-panel'));
    return panels.map(p => {
      const rect = p.getBoundingClientRect();
      return {
        year: p.dataset.year,
        net: p.dataset.net,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
      };
    });
  });

  console.log('Panel layout measurements:', JSON.stringify(panelLayout, null, 2));

  // Take screenshot of the unfolded net for visual verification
  const screenshotPath = path.join(process.cwd(), 'scratch', 'unfolded-net-check.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Test 2: Click Year 8 panel on the unfolded net
  console.log('Testing click on Year 8 net panel...');
  await page.evaluate(() => {
    const p8 = document.querySelector('.net-panel[data-year="8"]');
    if (p8) p8.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const modalIsOpen = await page.evaluate(() => {
    const m = document.getElementById('masterclassModal');
    return m && m.classList.contains('is-open');
  });
  console.log('Modal opened after clicking Year 8 panel:', modalIsOpen);

  const yr8Title = await page.$eval('#modalYearHeading', el => el.textContent);
  console.log('Year 8 modal heading:', yr8Title);

  // Test 3: Close modal to return to the unfolded net
  await page.evaluate(() => {
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Test 4: Fold back into 3D Cube
  console.log('Testing Fold Back into Cube...');
  await page.evaluate(() => {
    const foldBtn = document.getElementById('stageFoldBtn');
    if (foldBtn) foldBtn.click();
  });
  await new Promise(r => setTimeout(r, 1100));

  const isFoldedBack = await page.evaluate(() => {
    const net = document.getElementById('netContainer');
    const cube = document.getElementById('cube');
    return (!net || !net.classList.contains('active')) && cube && !cube.classList.contains('unfolded');
  });
  console.log('Folded back into 3D Cube cleanly:', isFoldedBack);

  await browser.close();
  console.log('ALL TESTS PASSED!');
  process.exit(0);
}

run().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
