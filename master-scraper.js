// Gold Aladdin - Phase 2: Master Scraper
// This is the main script that uses the engine to scrape all our indicators.

// Import the scrapeData function from our engine file
const { scrapeData } = require('./scraper-engine.js');

// Define a simple parser for Google Finance's format
function parseGoogleFinance(text) {
    return parseFloat(text);
}

// --- Define all our targets in one place ---
const targets = {
    globalGold: {
        url: 'https://www.google.com/finance/quote/XAU-USD',
        selector: '.JwB6zf',
        parser: parseGoogleFinance
    },
    // We will add our other indicators here later...
};


// --- Main function to run all scrapers ---
async function runAllScrapers() {
    console.log('Starting the master scraper...');
    
    const globalGoldPrice = await scrapeData(
        targets.globalGold.url,
        targets.globalGold.selector,
        targets.globalGold.parser
    );

    console.log('\n--- SCRAPING RESULTS ---');
    console.log(`Global Gold Price Change: ${globalGoldPrice}%`);
    console.log('------------------------');
}

// Run the main function
runAllScrapers();

