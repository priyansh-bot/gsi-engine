// Gold Aladdin - Phase 2: Backend Scraper
// v2.0 - Switched to a lighter, faster target (Google Finance) for reliability.

const puppeteer = require('puppeteer');

async function scrapeGlobalGoldPrice() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // --- CHANGE #1: The URL is now simpler and faster ---
    const url = 'https://www.google.com/finance/quote/XAU-USD';
    console.log(`Navigating to ${url}...`);

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        console.log('Page loaded. Waiting for the price data...');
        
        // --- CHANGE #2: A new, simpler selector for Google Finance ---
        const percentageChangeSelector = '.YMlKec.fxKbKc';
        
        await page.waitForSelector(percentageChangeSelector, { timeout: 10000 });

        const fullText = await page.$eval(percentageChangeSelector, el => el.textContent.trim());

        console.log(`Successfully scraped raw text: "${fullText}"`);

        // --- CHANGE #3: New logic to parse Google's text format, e.g., "+$10.50 (+0.45%)" ---
        const match = fullText.match(/\((.*?)%\)/); // Find the text inside the parentheses

        if (!match || !match[1]) {
            throw new Error('Could not find percentage change in the expected format.');
        }

        const percentageChange = parseFloat(match[1]);

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

// Run the scraper function
scrapeGlobalGoldPrice();
```

### Your New Plan

1.  **Save this new code** as `scraper_v2.js` in your `GSI Engine` folder. (You can keep the old one for reference).
2.  From your terminal, run this new file:
    ```bash
    node scraper_v2.js
    

