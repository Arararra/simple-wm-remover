const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const images = await fs.readdirSync('images/raw');
  for (const image of images) {
    const browser = await puppeteer.launch({
      headless: 'new'
    });
    const incognitoBrowser = await browser.createIncognitoBrowserContext();
    const page = await incognitoBrowser.newPage();
    await page.goto('https://clipdrop.co/text-remover');

    // Image input
    const imgInputSelector = 'input.hidden';
    const imgInputElement = await page.$(imgInputSelector);
    await imgInputElement.uploadFile(`images/raw/${image}`);

    // Image resizer
    await page.waitForTimeout(5000);
    const imgResizerSelector = 'button.flex-1:nth-child(1)';
    try {
      await page.waitForSelector(imgResizerSelector);
    } finally {
      await page.click(imgResizerSelector);
    }

    await page.waitForTimeout(5000);
    const downloadBtnSelector = 'button.bg-primary-500:nth-child(2):not([disabled])';

    try {
      await page.waitForSelector(downloadBtnSelector, {
        timeout: 120000
      });
      await page.click(downloadBtnSelector);
      // await page.waitForNavigation();
      await page.waitForTimeout(5000);
      console.log(`${image} saved!`);
    } catch (err) {
      console.error(`${image} can't be saved`)
    }

    await browser.close();
  }
})();