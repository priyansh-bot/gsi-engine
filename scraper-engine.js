// Gold Aladdin - Phase 2: Reusable Scraper Engine
// This module contains a generic function to scrape data from any given URL and selector.

const puppeteer = require('puppeteer');

async function scrapeData(url, selector, parserFunction) {
    console.log(`--- Starting scrape for: ${url} ---`);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // A generic attempt to handle cookie banners
        try {
            const cookieButtonSelector = 'button[aria-label="Accept all"], button:has-text("Accept")';
            await page.waitForSelector(cookieButtonSelector, { timeout: 3000 });
            await page.click(cookieButtonSelector);
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            console.log('Cookie banner handled.');
        } catch (error) {
            console.log('Cookie banner not found or already handled.');
        }

        await page.waitForSelector(selector, { timeout: 20000 });
        const rawText = await page.$eval(selector, el => el.textContent.trim());
        console.log(`Successfully scraped raw text: "${rawText}"`);

        // Use the provided parser function to process the text
        const data = parserFunction(rawText);

        if (isNaN(data)) {
            throw new Error('Parser function returned NaN.');
        }

        console.log(`✅ Parsed data: ${data}`);
        return data;

    } catch (error) {
        console.error(`❌ Error scraping ${url}:`, error.message);
        return null;
    } finally {
        await browser.close();
        console.log(`--- Finished scrape for: ${url} ---`);
    }
}

// We use 'module.exports' to make this function available to other files.
module.exports = { scrapeData };

