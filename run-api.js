// Gold Aladdin - Phase 2.5: API-Powered Data Fetcher
// This script uses the Finnhub API for reliable, real-time financial data.

const axios = require('axios');
const { API_KEY } = require('./config.js');

// --- Define our API targets ---
const symbols = {
    // NOTE: Finnhub uses specific symbols for each asset.
    globalGold: 'OANDA:XAU_USD',
    usdInr: 'OANDA:USD_INR',
    nifty50: '^NIFTY',
    // Finnhub data for Indian Gold (MCX) is not available on the free plan. We'll use a placeholder.
    indianGold: 'MCX_GOLD', 
    us10yBond: 'TMUBMUSD10Y'
};

const finnhubClient = axios.create({
    baseURL: 'https://finnhub.io/api/v1',
    params: {
        token: API_KEY
    }
});

// Function to get the quote for a single symbol
async function getQuote(symbol, name) {
    console.log(`--- Fetching data for ${name}...`);
    try {
        if (symbol === 'MCX_GOLD') {
            console.log('⚠️ MCX Gold data not available on free Finnhub plan. Returning placeholder.');
            return { percentChange: 0.0 }; // Return a neutral value
        }
        
        const response = await finnhubClient.get('/quote', { params: { symbol } });
        const { d, dp, c } = response.data; // d = change, dp = percent change, c = current price

        if (dp === null) {
            console.log(`❌ No percent change data available for ${name}.`);
            return { percentChange: 0.0 };
        }
        
        console.log(`✅ Success for ${name}! Percent Change: ${dp.toFixed(2)}%`);
        return { percentChange: dp.toFixed(2) };

    } catch (error) {
        console.error(`❌ Error fetching data for ${name}:`, error.response ? error.response.data.error : error.message);
        return { percentChange: null };
    }
}


// --- Main function to run all API calls ---
async function runAllFetchers() {
    console.log('--- Starting the GSI Data Fetcher (API v1.0) ---');

    const [gold, inr, nifty, mcx, bond] = await Promise.all([
        getQuote(symbols.globalGold, 'Global Gold'),
        getQuote(symbols.usdInr, 'USD/INR'),
        getQuote(symbols.nifty50, 'NIFTY 50'),
        getQuote(symbols.indianGold, 'Indian Gold (MCX)'),
        // Note: For bonds, we are getting the price change, not the yield change directly. This is a good proxy.
        getQuote(symbols.us10yBond, 'US 10Y Bond Price')
    ]);

    console.log('\n--- ✅ FINAL API RESULTS ---');
    console.log(`Global Gold Price (% Change): ${gold.percentChange}`);
    console.log(`USD/INR (% Change): ${inr.percentChange}`);
    console.log(`Indian Gold (MCX) (% Change): ${mcx.percentChange} (Placeholder)`);
    console.log(`NIFTY 50 (% Change): ${nifty.percentChange}`);
    console.log(`US 10Y Bond Price (% Change): ${bond.percentChange}`);
    console.log('-----------------------------');
}

runAllFetchers();

