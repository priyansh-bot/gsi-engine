# GSI Engine

A sentiment index for the Indian gold market (Gold Sentiment Index - **GSI**).  
The project tracks global and domestic macroeconomic indicators to generate trading signals for Indian gold prices.  

---

## 🚀 Project Status
- **Phase 1 (Crawl)** ✅: Manual proof-of-concept in Google Sheets.  
- **Phase 1.5** ✅: Automated signals & scoring in Google Sheets, added US10Y bond yield.  
- **Phase 2 (Walk)** 🔄: Semi-automation in progress. Scraper V2 live for global gold prices. GitHub repo created.  
- **Phase 3 (Run)** ⏳: Planned — advanced analytics (VAR, lag effects, seasonality multipliers, ML models).  

---

## 📊 Indicators Tracked
- Global Gold % Change  
- USD/INR % Change  
- MCX Gold % Change  
- NIFTY50 % Change  
- US10Y Bond Yield (bps change)  
- Festival Proximity (days to major event)  
- Monsoon Status  

---

## ⚙️ Current Features
- Lightweight web scraper (`scraper.js`) for global gold prices.  
- Static frontend (`index.html`) for displaying test results.  
- Rulebook (`GSI_Rulebook.md`) for indicator-to-signal mapping.  
- Version history tracked in [`CHANGELOG.md`](CHANGELOG.md).  

---

## 🛠️ How to Run (Phase 2 Prototype)
1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/gsi-engine.git
   cd gsi-engine
Run the scraper:

bash
Copy code
node scraper.js
Open index.html in your browser to view results.

👥 Contributors
You — Project Lead, researcher, tester, documentation.

Gemini — Backend & scraper development.

ChatGPT (ConsultantGPT) — Architecture, planning, documentation, and frontend support.

📌 Roadmap
See CHANGELOG.md for detailed history.
Upcoming: API integration, database storage, and live signal dashboard.

