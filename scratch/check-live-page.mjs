import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8080/subjects/mathematics', { waitUntil: 'networkidle0' });

  // If skip introduction button exists, click it
  const skipBtn = await page.$('button');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const skip = buttons.find(b => b.textContent.includes('Skip introduction'));
    if (skip) skip.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Test interacting with the iframe on live page
  const frameHandle = await page.$('.year-cube__experience');
  const frame = await frameHandle.contentFrame();
  
  // Click cube inside iframe to roll and unfold
  await frame.click('#cube');
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(process.cwd(), 'scratch', 'live-unfolded-net.png') });
  console.log('Saved live unfolded net screenshot to scratch/live-unfolded-net.png');

  // Click Year 8 panel to open modal
  await frame.click('.net-panel[data-year="8"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(process.cwd(), 'scratch', 'live-modal-year8.png') });
  console.log('Saved live Year 8 modal screenshot to scratch/live-modal-year8.png');

  await browser.close();
})();
