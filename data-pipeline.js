// Gold Aladdin - Phase 2 COMPLETE: Automated Data Pipeline
// v1.3.2 - Added correct calculation for US 10Y Bond Yield using historical data

const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');
const fs = require('fs');

// --- 1. FETCHER MODULES ---
async function fetchYahooData() {
    console.log('--- Fetching data from Yahoo Finance...');
    try {
        const symbols = ['GC=F', 'USDINR=X', '^NSEI'];
        const results = await yahooFinance.quote(symbols);

        // Extract normal daily % change directly
        const data = {
            globalGold: results.find(q => q.symbol === 'GC=F')?.regularMarketChangePercent,
            usdInr: results.find(q => q.symbol === 'USDINR=X')?.regularMarketChangePercent,
            nifty50: results.find(q => q.symbol === '^NSEI')?.regularMarketChangePercent
        };

        console.log('✅ Success from Yahoo Finance!');
        return data;
    } catch (error) {
        console.error('❌ Error fetching from Yahoo Finance:', error.message);
        return {};
    }
}

// US 10Y Bond (% change vs yesterday’s close)
async function fetchBondYield() {
    console.log('--- Fetching US 10Y Bond historical data...');
    try {
        const history = await yahooFinance.historical('^TNX', { period1: '2d', interval: '1d' });

        if (history.length >= 2) {
            const yesterday = history[0].close;
            const today = history[1].close;
            const pctChange = ((today - yesterday) / yesterday) * 100;

            return { us10yBond: pctChange };
        } else {
            console.warn('⚠️ Not enough historical data for US 10Y Bond');
            return { us10yBond: 0 };
        }
    } catch (error) {
        console.error('❌ Error fetching US 10Y Bond:', error.message);
        return { us10yBond: 0 };
    }
}

// MCX proxy → GoldBee
async function fetchGoldBee() {
    console.log('--- Fetching GoldBee Data (using placeholder)...');
    return { goldBee: 1.48817 }; // keep placeholder for now
}

// --- 2. NORMALIZER MODULE ---
function normalizeData(rawData) {
    console.log('--- Normalizing raw data into GSI signals...');
    const signals = {};

    if (typeof rawData.globalGold === 'number')
        signals.globalGold = rawData.globalGold > 0.3 ? 1 : rawData.globalGold < -0.3 ? -1 : 0;

    if (typeof rawData.usdInr === 'number')
        signals.usdInr = rawData.usdInr > 0.15 ? 1 : rawData.usdInr < -0.15 ? -1 : 0;

    if (typeof rawData.goldBee === 'number')
        signals.goldBee = rawData.goldBee > 0.3 ? 1 : rawData.goldBee < -0.3 ? -1 : 0;

    if (typeof rawData.nifty50 === 'number')
        signals.nifty50 = rawData.nifty50 < -0.5 ? 1 : rawData.nifty50 > 0.5 ? -1 : 0;

    if (typeof rawData.us10yBond === 'number')
        signals.us10yBond = rawData.us10yBond < -0.05 ? 1 : rawData.us10yBond > 0.05 ? -1 : 0;

    console.log('✅ Normalization complete!');
    return signals;
}

// --- 3. MAIN PIPELINE EXECUTION ---
async function runPipeline() {
    console.log('--- GSI DATA PIPELINE STARTED (v1.3.2) ---');

    const [yahooData, bondData, goldBeeData] = await Promise.all([
        fetchYahooData(),
        fetchBondYield(),
        fetchGoldBee()
    ]);

    const rawData = { ...yahooData, ...bondData, ...goldBeeData };
    const signals = normalizeData(rawData);

    const output = {
        lastUpdated: new Date().toISOString(),
        rawData: rawData,
        signals: signals
    };

    fs.writeFileSync('gsi-data.json', JSON.stringify(output, null, 2));

    console.log('\n--- ✅ PIPELINE COMPLETE ---');
    console.log('Wrote latest data to gsi-data.json');
    console.log('-----------------------------');
}

runPipeline();

