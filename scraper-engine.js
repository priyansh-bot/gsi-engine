// Gold Aladdin - Phase 2: Reusable Scraper Engine
// v1.1 - Added puppeteer-extra and stealth plugin to avoid being blocked.

// We use 'puppeteer-extra' to add plugins
const puppeteer = require('puppeteer-extra');
// The stealth plugin makes our scraper look more like a real user
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeData(url, selector, parserFunction) {
    console.log(`--- Starting scrape for: ${url} ---`);
    let browser = null; // Initialize browser to null
    try {
        // Launch the browser using our enhanced puppeteer
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Increased timeout to 60s

        await page.waitForSelector(selector, { timeout: 30000 }); // Increased timeout to 30s
        const rawText = await page.$eval(selector, el => el.textContent.trim());
        console.log(`Successfully scraped raw text: "${rawText}"`);

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
        if (browser) {
            await browser.close();
        }
        console.log(`--- Finished scrape for: ${url} ---`);
    }
}

module.exports = { scrapeData };


