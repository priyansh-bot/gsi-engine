// Gold Aladdin - Phase 2: Backend Scraper
// v2.2 - Simplified the text parsing logic to match the new format from Google Finance.

const puppeteer = require('puppeteer');

async function scrapeGlobalGoldPrice() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const url = 'https://www.google.com/finance/quote/XAU-USD';
    console.log(`Navigating to ${url}...`);

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Page loaded. Checking for cookie consent banner...');

        const cookieButtonSelector = 'button[aria-label="Accept all"]';
        try {
            await page.waitForSelector(cookieButtonSelector, { timeout: 3000 });
            await page.click(cookieButtonSelector);
            console.log('Clicked "Accept all" on cookie banner.');
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        } catch (error) {
            console.log('Cookie banner not found or already handled.');
        }

        console.log('Waiting for the price data...');
        const percentageChangeSelector = '.JwB6zf';
        await page.waitForSelector(percentageChangeSelector, { timeout: 20000 });

        const fullText = await page.$eval(percentageChangeSelector, el => el.textContent.trim());
        console.log(`Successfully scraped raw text: "${fullText}"`);

        // --- CHANGE: Simplified parsing logic ---
        // We no longer need a complex regular expression.
        // parseFloat() is a built-in JS function that intelligently extracts a number from a string.
        const percentageChange = parseFloat(fullText);

        // Check if the parsing was successful. If not, parseFloat returns NaN (Not a Number).
        if (isNaN(percentageChange)) {
            throw new Error('Could not parse the percentage change into a number.');
        }

        console.log('----------------------------------------');
        console.log('✅ Success! (from Google Finance)');
        console.log(`Global Gold Price % Change: ${percentageChange}%`);
        console.log('----------------------------------------');

        return percentageChange;

    } catch (error) {
        console.error('An error occurred during scraping:', error);
        return null;
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
}

scrapeGlobalGoldPrice();


