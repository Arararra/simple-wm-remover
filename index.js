const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Initialize puppeteer browser
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('https://replicate.com/xinntao/realesrgan');

  // Image input
  const imgInputSelector = 'input.hidden';
  const imgInputElement = await page.$(imgInputSelector);
  // Version input
  const versionInputSelector = '#input-version';
  const versionInputElement = await page.$(versionInputSelector);
  // Tile input
  const tileInputSelector = '#input-tile';
  // Submit button
  const submitBtnSelector = '.form-button';
  // Download button
  const downloadBtnSelector = 'div.inline-block:nth-child(5) > button:nth-child(1)';

  // Run the script
  const images = await fs.readdirSync('images/nowm');
  for (const image of images) {
    await imgInputElement.uploadFile(`images/nowm/${image}`);
    await page.select(versionInputSelector, 'General - RealESRGANplus');
    await page.click(submitBtnSelector);
    await page.type(tileInputSelector, '0');

    try {
      await page.waitForSelector(downloadBtnSelector, {
        timeout: 120000
      });
      await page.click(downloadBtnSelector);
      // await page.waitForNavigation();
      await page.waitForTimeout(5000);
      console.log(`${image} saved!`);
    } catch (err) {
      console.error(`${image} can't be saved`);
    }
  }

  // close browser
  await browser.close();
})();