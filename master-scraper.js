// Gold Aladdin - Phase 2: Master Scraper
// v2.4 - Final Production Version with updated, verified selectors for all targets.

const { scrapeData } = require('./scraper-engine.js');

// --- Define Parser Functions ---
function parseGoogleFinance(text) {
    // This regex is more robust, finding the percentage value inside parentheses
    const match = text.match(/\((.*?)%\)/);
    if (match && match[1]) {
        return parseFloat(match[1]);
    }
    // Fallback for simple percentage text
    return parseFloat(text);
}

function parseMoneyControl(text) {
    const match = text.match(/\((.*?)%\)/);
    if (match && match[1]) {
        return parseFloat(match[1]);
    }
    const singlePercentMatch = text.match(/(-?[\d.]+)%/);
    if (singlePercentMatch && singlePercentMatch[1]) {
        return parseFloat(singlePercentMatch[1]);
    }
    throw new Error(`Could not parse Moneycontrol format: "${text}"`);
}

function parseTradingView(text) {
    const cleanText = text.replace(/−/, '-');
    return parseFloat(cleanText);
}

// --- Define all our targets in one place ---
const targets = {
    globalGold: {
        url: 'https://www.tradingview.com/markets/commodities/quotes-all/',
        selector: 'tr[data-symbol="OANDA:XAUUSD"] > td:nth-of-type(6) span',
        parser: parseTradingView
    },
    usdInr: {
        url: 'https://www.google.com/finance/quote/USD-INR',
        // CORRECTED SELECTOR: This now specifically targets the span with the percentage change.
        selector: 'span.N5ykwe',
        parser: parseGoogleFinance
    },
    indianGold: {
        url: 'https://www.moneycontrol.com/commodity/gold-price.html',
        selector: '#mc_commodity .comm-list-price .chg_prcnt',
        parser: parseMoneyControl
    },
    nifty50: {
        url: 'https://www.google.com/finance/quote/NIFTY_50:INDEXNSE',
        // CORRECTED SELECTOR: Specific to the index page percentage change.
        selector: 'span.N5ykwe',
        parser: parseGoogleFinance
    },
    us10yBond: {
        url: 'https://www.google.com/finance/quote/US10Y:INDEXBOM',
        selector: 'div.P6K39c',
        parser: parseGoogleFinance
    }
};

// --- Main function to run all scrapers in parallel ---
async function runAllScrapers() {
    console.log('--- Starting the master scraper for all indicators (v2.4 Final) ---');
    
    const results = await Promise.all([
        scrapeData(targets.globalGold.url, targets.globalGold.selector, targets.globalGold.parser),
        scrapeData(targets.usdInr.url, targets.usdInr.selector, targets.usdInr.parser),
        scrapeData(targets.indianGold.url, targets.indianGold.selector, targets.indianGold.parser),
        scrapeData(targets.nifty50.url, targets.nifty50.selector, targets.nifty50.parser),
        scrapeData(targets.us10yBond.url, targets.us10yBond.selector, targets.us10yBond.parser)
    ]);

    const [globalGold, usdInr, indianGold, nifty50, us10yBond] = results;

    console.log('\n--- ✅ FINAL SCRAPING RESULTS ---');
    console.log(`Global Gold Price (% Change): ${globalGold !== null ? globalGold : 'Failed'}`);
    console.log(`USD/INR (% Change): ${usdInr !== null ? usdInr : 'Failed'}`);
    console.log(`Indian Gold (MCX) (% Change): ${indianGold !== null ? indianGold : 'Failed'}`);
    console.log(`NIFTY 50 (% Change): ${nifty50 !== null ? nifty50 : 'Failed'}`);
    console.log(`US 10Y Bond (Basis Point Change): ${us10yBond !== null ? us10yBond : 'Failed'}`);
    console.log('-----------------------------------');
}

runAllScrapers();
