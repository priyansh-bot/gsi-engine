// Gold Aladdin - Phase 2 COMPLETE: Automated Data Pipeline
// This script implements the consultant's hybrid API plan.

const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');
const fs = require('fs'); // File System module to write files

// --- 1. FETCHER MODULES ---
// These functions get the raw data from our primary sources.

async function fetchYahooData() {
    console.log('--- Fetching data from Yahoo Finance...');
    try {
        const symbols = ['GC=F', 'USDINR=X', '^NSEI', '^TNX'];
        const results = await yahooFinance.quote(symbols);
        const data = {
            globalGold: results.find(q => q.symbol === 'GC=F')?.regularMarketChangePercent,
            usdInr: results.find(q => q.symbol === 'USDINR=X')?.regularMarketChangePercent,
            nifty50: results.find(q => q.symbol === '^NSEI')?.regularMarketChangePercent,
            us10yBond: results.find(q => q.symbol === '^TNX')?.regularMarketChange // Note: This is point change, not percent
        };
        console.log('✅ Success from Yahoo Finance!');
        return data;
    } catch (error) {
        console.error('❌ Error fetching from Yahoo Finance:', error.message);
        return {};
    }
}

async function fetchNseMcxData() {
    // Note: The direct NSE commodity API is difficult to access reliably.
    // For Phase 2, we will use a placeholder for MCX Gold as it's the least reliable data point to automate for free.
    console.log('--- Fetching MCX Data (using placeholder)...');
    return { mcxGold: 0.0 }; // Returning a neutral placeholder
}


// --- 2. NORMALIZER MODULE ---
// This function takes raw data and applies our GSI Rulebook logic.

function normalizeData(rawData) {
    console.log('--- Normalizing raw data into GSI signals...');
    const signals = {};

    // Apply rules from GSI_Rulebook_v1.2.md
    if (rawData.globalGold) signals.globalGold = rawData.globalGold > 0.3 ? 1 : rawData.globalGold < -0.3 ? -1 : 0;
    if (rawData.usdInr) signals.usdInr = rawData.usdInr > 0.15 ? 1 : rawData.usdInr < -0.15 ? -1 : 0; // Rupee weakens (+)
    if (rawData.mcxGold) signals.mcxGold = rawData.mcxGold > 0.3 ? 1 : rawData.mcxGold < -0.3 ? -1 : 0;
    if (rawData.nifty50) signals.nifty50 = rawData.nifty50 < -0.5 ? 1 : rawData.nifty50 > 0.5 ? -1 : 0; // Inverse
    if (rawData.us10yBond) signals.us10yBond = rawData.us10yBond < -0.05 ? 1 : rawData.us10yBond > 0.05 ? -1 : 0; // 5 bps change

    console.log('✅ Normalization complete!');
    return signals;
}

// --- 3. MAIN PIPELINE EXECUTION ---

async function runPipeline() {
    console.log('--- GSI DATA PIPELINE STARTED ---');
    
    const [yahooData, nseData] = await Promise.all([
        fetchYahooData(),
        fetchNseMcxData()
    ]);

    // Combine all raw data into one object
    const rawData = { ...yahooData, ...nseData };

    // Get the normalized signals
    const signals = normalizeData(rawData);

    // Get the date-based signals (from our index.html logic)
    // This part is now handled directly by the frontend for simplicity.

    // Prepare the final JSON output
    const output = {
        lastUpdated: new Date().toISOString(),
        rawData: rawData,
        signals: signals
    };

    // Write the data to a JSON file
    fs.writeFileSync('gsi-data.json', JSON.stringify(output, null, 2));

    console.log('\n--- ✅ PIPELINE COMPLETE ---');
    console.log('Successfully wrote latest data to gsi-data.json');
    console.log('-----------------------------');
}

runPipeline();

