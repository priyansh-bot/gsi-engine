// Gold Aladdin - Phase 2 COMPLETE: Automated Data Pipeline
// v2.6 - Final Version. Simplified bond yield fetching for maximum reliability.

const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');

// --- 1. FETCHER MODULE ---
// We now only need one fetcher, as Yahoo Finance can provide all data reliably.
async function fetchAllData() {
    console.log('--- Fetching all data from Yahoo Finance...');
    try {
        // ADDED ^TNX to the main list of symbols.
        const symbols = ['GC=F', 'USDINR=X', '^NSEI', 'GOLDBEES.NS', '^TNX'];
        const results = await yahooFinance.quote(symbols);

        const get = (s) => results.find(q => q.symbol === s);

        const data = {
            globalGold: get('GC=F')?.regularMarketChangePercent ?? 0,
            usdInr: get('USDINR=X')?.regularMarketChangePercent ?? 0,
            nifty50: get('^NSEI')?.regularMarketChangePercent ?? 0,
            goldBee: get('GOLDBEES.NS')?.regularMarketChangePercent ?? 0,
            // GETTING THE LIVE POINT CHANGE DIRECTLY. This is much more reliable.
            us10yBond: get('^TNX')?.regularMarketChange ?? 0
        };

        // Validate that all data points were found
        for (const key in data) {
            if (typeof data[key] !== 'number') throw new Error(`Could not find valid data for ${key}`);
        }

        console.log('✅ Success from Yahoo Finance!');
        return data;
    } catch (error) {
        console.error('❌ Error fetching from Yahoo Finance:', error.message);
        return { globalGold: null, usdInr: null, nifty50: null, goldBee: null, us10yBond: null };
    }
}


// --- 2. NORMALIZER MODULE ---
function normalizeData(rawData) {
    console.log('--- Normalizing raw data into GSI signals...');
    const signals = {};
    if (typeof rawData.globalGold === 'number') signals.globalGold = rawData.globalGold > 0.3 ? 1 : rawData.globalGold < -0.3 ? -1 : 0;
    if (typeof rawData.usdInr === 'number') signals.usdInr = rawData.usdInr > 0.15 ? 1 : rawData.usdInr < -0.15 ? -1 : 0;
    if (typeof rawData.goldBee === 'number') signals.indianGold = rawData.goldBee > 0.3 ? 1 : rawData.goldBee < -0.3 ? -1 : 0;
    if (typeof rawData.nifty50 === 'number') signals.nifty50 = rawData.nifty50 < -0.5 ? 1 : rawData.nifty50 > 0.5 ? -1 : 0;
    // Rule: US10Y change is in basis points. A 5 bps change is 0.05.
    if (typeof rawData.us10yBond === 'number') signals.us10yBond = rawData.us10yBond < -0.05 ? 1 : rawData.us10yBond > 0.05 ? -1 : 0;
    console.log('✅ Normalization complete!');
    return signals;
}


// --- 3. MAIN PIPELINE EXECUTION ---
async function runPipeline() {
    console.log('--- GSI DATA PIPELINE STARTED (v2.6 Final) ---');
    
    // We no longer need Promise.all as we have a single, unified fetcher.
    const rawData = await fetchAllData();
    const signals = normalizeData(rawData);

    const output = {
        lastUpdated: new Date().toISOString(),
        rawData: rawData,
        signals: signals
    };

    fs.writeFileSync('gsi-data.json', JSON.stringify(output, null, 2));

    console.log('\n--- ✅ PIPELINE COMPLETE ---');
    console.log('Successfully wrote latest data to gsi-data.json');
    console.log('-----------------------------');
}

runPipeline();


