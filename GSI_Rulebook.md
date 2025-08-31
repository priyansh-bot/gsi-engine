Gold Sentiment Index (GSI) - Scoring Rulebook V1.2
This document provides the standardized rules for assigning a signal score (+1, 0, -1) to each indicator.

Data Snapshot Time: Approx. 4:00 PM IST for daily price-based indicators.

1. Global Gold Price (Spot)
Source: Google Finance (XAU-USD)

Metric: Percentage change from the previous day's close.

Rules:

> +0.3% → Score +1

Between -0.3% and +0.3% → Score 0

< -0.3% → Score -1

2. USD/INR Exchange Rate
Source: Google Finance (USD-INR)

Metric: Percentage change from the previous day's close.

Rules:

> +0.15% (Rupee weakens) → Score +1

Between -0.15% and +0.15% → Score 0

< -0.15% (Rupee strengthens) → Score -1

3. Indian Gold Price (MCX Futures)
Source: Moneycontrol (MCX Gold Futures)

Metric: Percentage change from the previous day's close.

Rules:

> +0.3% → Score +1

Between -0.3% and +0.3% → Score 0

< -0.3% → Score -1

4. NIFTY 50 (Inverse)
Source: NSE India / Moneycontrol

Metric: Percentage change from the previous day's close.

Rules:

< -0.5% (Market falls) → Gold Score +1

Between -0.5% and +0.5% → Gold Score 0

> +0.5% (Market rises) → Gold Score -1

5. US 10-Year Treasury Yield (Inverse)
Source: Investing.com (US 10Y)

Metric: Basis point (bps) change from the previous day's close. (1 bps = 0.01%)

Rules:

< -5 bps (Falls significantly) → Gold Score +1

Between -5 bps and +5 bps → Score 0

> +5 bps (Rises significantly) → Gold Score -1

6. Festival/Wedding Season (Date-Based)
Rules (Calculated by the app):

Within 7 days of a major festival OR peak wedding season (Dec-Feb) → Score +2

Within 30 days of a major festival → Score +1

Otherwise → Score 0

7. Monsoon Outlook (Date-Based)
Rules (Calculated by the app):

Official forecast 'Above Normal' or 'Normal' → Score +1 (Jun-Sep)

Official forecast 'Below Normal' → Score -1 (Jun-Sep)

Post-monsoon lag effect → Carries forward last score (Oct-Dec)

Inactive season → Score 0 (Jan-May)
